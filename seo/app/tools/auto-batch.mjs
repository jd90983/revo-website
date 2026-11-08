// Turns an owner-approved request (written by the n8n approval flow) into the
// same artifacts the manual runbook produces: an evidence file with the exact
// approved copy and its SHA-256, a batch file, the applied registry and the
// owner's approval bound to each page's content hash.
//
// The request is only written after Jorge Perez approved the keywords and the
// exact copy in Slack. Every page's copy hash must match the hash recorded at
// approval time, so nothing that was not shown in Slack can be approved here.
//
// Usage: node seo/app/tools/auto-batch.mjs --request evidence/<date>/<batchId>-request.json
//
// Known registry issue: `seo apply` and `seo approve` validate after each step
// and fail with "related page ... is not approved" when an approved page links
// to a page an update has just moved back to draft. This tool applies the batch
// and approves every touched page in memory, then validates the registry once.
// The review recorded is the same shape approvePage writes (reviewer, date,
// content hash, note). PRs opened by the automation declare this.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { contentHash, registryErrors } from '../../shared/lib/registry-contract.mjs';
import { batchErrors, logBatch } from './batch.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const data = join(root, 'seo/shared/data');
const files = {
  registry: join(data, 'landing-pages.json'),
  batchLog: join(data, 'batch-log.json'),
  batches: join(data, 'batches'),
};

const sha256 = text => createHash('sha256').update(text, 'utf8').digest('hex');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };

export const REVIEWER = 'Jorge Perez (owner)';
export const DISCLAIMER = date => `Published by Revo, which sells an AI receptionist for home service businesses. Reviewed ${longDate(date)}.`;
const ALLOWED_PRICE = '$87.50/mo at launch';
const PLANS_LINK = "[See Revo's plans](/pricing)";
const BANNED = [/four million/i, /4,?000,?000/, /\b4M\b/];

const words = text => text.replace(/[#*_\[\]()`>-]/g, ' ').split(/\s+/).filter(Boolean).length;

/** Editorial rules from the handoff. Returns a list of problems (empty = ok). */
export function copyProblems(page, date) {
  const p = [];
  const t = page.markdown;
  if (!t.startsWith(`# ${page.title}\n`)) p.push('markdown must start with "# <title>"');
  if (!t.includes(DISCLAIMER(date))) p.push('missing the Revo disclaimer line with today\'s date');
  const n = words(t);
  if (n < 280 || n > 450) p.push(`word count ${n} outside 280-450`);
  const h2 = [...t.matchAll(/^## (.+)$/gm)].map(m => m[1]);
  const body = h2.filter(h => !/^frequently asked questions$/i.test(h));
  if (body.length < 3 || body.length > 4) p.push(`needs 3-4 "##" sections besides the FAQ, has ${body.length}`);
  if (!h2.some(h => /^frequently asked questions$/i.test(h))) p.push('missing "## Frequently asked questions"');
  const faq = (t.split(/^## Frequently asked questions$/im)[1] ?? '').match(/^### /gm) ?? [];
  if (faq.length < 2 || faq.length > 3) p.push(`needs 2-3 FAQs, has ${faq.length}`);
  if (/^\s*\|.*\|\s*$/m.test(t)) p.push('tables are not allowed');
  const prices = t.match(/\$\s?\d[\d,.]*/g) ?? [];
  if (prices.some(x => x.replace(/\s/g, '') !== '$87.50') || !t.includes(ALLOWED_PRICE)) p.push(`only one Revo price is allowed: "${ALLOWED_PRICE}"`);
  if (!t.includes(PLANS_LINK)) p.push(`Revo section must close with ${PLANS_LINK}`);
  for (const re of BANNED) if (re.test(t)) p.push(`banned phrase ${re}`);
  return p;
}

/** Converts approved markdown into the registry fields the site renders. */
export function recordFromMarkdown(page, date) {
  const text = page.markdown.endsWith('\n') ? page.markdown : page.markdown + '\n';
  const [, afterTitle] = text.split(/^# .+\n/m);
  const [preamble, ...chunks] = afterTitle.split(/^## /m);
  const lead = preamble.split(/\n{2,}/).map(s => s.trim()).filter(s => s && !s.startsWith('Published by Revo'))[0];
  const sections = chunks.map(chunk => {
    const [title, ...rest] = chunk.split('\n');
    return { title: title.trim(), paragraphs: [rest.join('\n').trim()], items: [] };
  });
  return {
    slug: page.slug,
    title: page.title,
    description: page.description,
    navigationLabel: page.navigationLabel,
    eyebrow: page.eyebrow,
    lead,
    intro: lead,
    sections,
    faqs: [],
    takeaway: 'Review Revo’s current plans',
    sourcePaths: ['https://www.revoapp.ai/pricing'],
    template: 'workflow',
    pricingVariant: 'full',
    editorialDate: date,
    markdownArticle: { content: text, sha256: sha256(text), assets: [] },
    related: (page.related ?? []).slice(0, 4),
  };
}

/** Keyword retarget: only title, description, labels and the first paragraph change. */
export function retargetRecord(existing, page, date) {
  const { publicationStatus, review, source, withdrawal, ...base } = existing;
  void publicationStatus; void review; void source; void withdrawal;
  const next = { ...base, title: page.title, description: page.description, navigationLabel: page.navigationLabel, eyebrow: page.eyebrow, lead: page.firstParagraph, editorialDate: date };
  const oldLead = existing.lead ?? '';
  const intro = existing.intro ?? '';
  next.intro = intro.startsWith(oldLead) && oldLead ? page.firstParagraph + intro.slice(oldLead.length) : page.firstParagraph;
  if (existing.markdownArticle?.content) {
    const lines = existing.markdownArticle.content.split('\n');
    const h1 = lines.findIndex(l => l.startsWith('# '));
    lines[h1] = `# ${page.title}`;
    const p0 = lines.findIndex((l, i) => i > h1 && l.trim() && !l.startsWith('#'));
    if (p0 > 0 && lines[p0].trim() === oldLead.trim()) lines[p0] = page.firstParagraph;
    const content = lines.join('\n');
    next.markdownArticle = { ...existing.markdownArticle, content, sha256: sha256(content) };
  }
  return next;
}

/** Exact public copy shown in Slack, page by page. Its SHA-256 is what the owner approved. */
export function evidenceText(request) {
  return request.pages.map(page => page.op === 'add'
    ? `=== add ${page.slug} (keyword: ${page.keyword})\nTitle: ${page.title}\nDescription: ${page.description}\nNavigation label: ${page.navigationLabel}\nEyebrow: ${page.eyebrow}\n\n${page.markdown.trim()}\n`
    : `=== update ${page.slug} (keyword: ${page.keyword})\nTitle: ${page.title}\nDescription: ${page.description}\nNavigation label: ${page.navigationLabel}\nEyebrow: ${page.eyebrow}\nFirst paragraph: ${page.firstParagraph}\n`).join('\n');
}

export function buildBatch(registry, request) {
  const { batchId, date } = request;
  const problems = [];
  const ops = [];
  for (const page of request.pages) {
    const shown = page.op === 'add' ? page.markdown : page.firstParagraph;
    if (sha256(evidenceText({ pages: [page] })) !== page.approvedSha256) problems.push(`${page.slug}: copy differs from what was approved in Slack`);
    if (page.title.length < 10 || page.title.length > 62) problems.push(`${page.slug}: title must be 10-62 characters`);
    if (/\d/.test(page.navigationLabel) || /\d/.test(page.eyebrow)) problems.push(`${page.slug}: navigation label and eyebrow cannot contain numbers`);
    if (!shown) problems.push(`${page.slug}: empty copy`);
    const existing = registry.find(r => r.slug === page.slug);
    if (page.op === 'add') {
      if (existing) problems.push(`${page.slug}: already exists; new pages cannot reuse a slug`);
      problems.push(...copyProblems(page, date).map(x => `${page.slug}: ${x}`));
      ops.push({ op: 'add', record: recordFromMarkdown(page, date) });
    } else {
      if (!existing) { problems.push(`${page.slug}: no page to update`); continue; }
      if (page.slug === 'after-hours') problems.push('after-hours uses a fixed component; it is excluded from automated updates');
      ops.push({ op: 'update', record: retargetRecord(existing, page, date) });
    }
  }
  if (problems.length) throw new Error(`Request rejected:\n- ${problems.join('\n- ')}`);
  return {
    batchId,
    source: {
      kind: 'owner-approved-exact-copy',
      reference: `Owner-approved exact public copy; evidence/${date}/${batchId}-approved-public-copy.txt SHA256 ${request.copySha256}; keywords approved by ${REVIEWER} in Slack (message ${request.slack.keywordsTs}) and copy approved in Slack (message ${request.slack.copyTs}) on ${longDate(date)}; implementation by the Revo SEO automation`,
    },
    operations: ops,
  };
}

/** Applies the batch and approves every touched page, validating once at the end. */
export function applyAndApprove(registry, batch, request) {
  const next = registry.map(r => ({ ...r }));
  const changes = [];
  for (const operation of batch.operations) {
    const incoming = { ...operation.record, source: { kind: batch.source.kind, reference: `${batch.source.reference} (batch ${batch.batchId})` } };
    const i = next.findIndex(r => r.slug === incoming.slug);
    const approved = { ...incoming, publicationStatus: 'approved' };
    approved.review = {
      reviewer: REVIEWER,
      reviewedAt: request.date,
      contentHash: contentHash(approved),
      note: `${REVIEWER} approved keywords and exact copy in Slack on ${longDate(request.date)} (messages ${request.slack.keywordsTs}, ${request.slack.copyTs}); implemented by the Revo SEO automation`,
    };
    if (operation.op === 'add') { next.push(approved); changes.push(`added ${incoming.slug} as draft`, `approved ${incoming.slug}`); }
    else { next[i] = approved; changes.push(`updated ${incoming.slug}; back to draft until re-approved`, `approved ${incoming.slug}`); }
  }
  const problems = registryErrors(next);
  if (problems.length) throw new Error(`Registry would be invalid:\n- ${problems.join('\n- ')}`);
  return { registry: next, changes };
}

function main() {
  const at = process.argv.indexOf('--request');
  if (at < 0) throw new Error('usage: auto-batch.mjs --request evidence/<date>/<batchId>-request.json');
  const request = readJson(resolve(root, process.argv[at + 1]));
  if (request.approver !== REVIEWER) throw new Error(`request approver must be ${REVIEWER}`);
  if (!request.slack?.keywordsTs || !request.slack?.copyTs) throw new Error('request needs the Slack approval message ids');
  const text = evidenceText(request);
  if (sha256(text) !== request.copySha256) throw new Error('evidence hash does not match the hash approved in Slack');

  const registry = readJson(files.registry);
  const batch = buildBatch(registry, request);
  const errors = batchErrors(batch);
  if (errors.length) throw new Error(`Batch is invalid:\n- ${errors.join('\n- ')}`);

  const evidenceDir = join(root, 'evidence', request.date);
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(join(evidenceDir, `${request.batchId}-approved-public-copy.txt`), text);
  const batchFile = join(files.batches, `${batch.batchId}.json`);
  if (existsSync(batchFile)) throw new Error(`${batchFile} already exists; batches are immutable`);
  writeJson(batchFile, batch);

  const { registry: next, changes } = applyAndApprove(registry, batch, request);
  writeJson(files.registry, next);
  writeJson(files.batchLog, logBatch(readJson(files.batchLog), batch, changes, { date: request.date }));
  console.log(`Applied and approved ${batch.batchId}:\n- ${changes.join('\n- ')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exit(1); }
}
