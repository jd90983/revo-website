import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { registryErrors } from '../lib/registry-contract.mjs';
import { applyAndApprove, buildBatch, copyProblems, DISCLAIMER, evidenceText, REVIEWER } from '../../app/tools/auto-batch.mjs';

const sha = text => createHash('sha256').update(text, 'utf8').digest('hex');
const registry = JSON.parse(readFileSync(new URL('../data/landing-pages.json', import.meta.url), 'utf8'));
const date = '2026-11-09';
const markdown = `# Fixture Trade Answering Service Guide

Fixture trade companies get calls while crews are on jobs. An answering service picks up, captures the problem and sets a clear next step for every caller who reaches your business.

${DISCLAIMER(date)}

## The calls a fixture company gets
${'Callers describe a problem, ask about timing and want to know what happens next. '.repeat(6)}

## What to capture on every call
${'Ask for the address, the problem, how urgent it is and the best number to call back. '.repeat(6)}

## Why the first answer matters
${'A caller who reaches nobody often calls the next company in the search results. '.repeat(5)}

## Where Revo fits
Revo answers the calls you forward to it, 24/7, and follows your script and rules. Plans start from $87.50/mo at launch. [See Revo's plans](/pricing)

## Frequently asked questions
### Can it dispatch a technician?
It follows your rules. Your team decides who goes.
### Can it quote prices?
Only with a published pricing rule you provide.
`;
const page = { op: 'add', slug: 'fixture-trade-answering-service', keyword: 'fixture trade answering service', title: 'Fixture Trade Answering Service Guide', description: 'A fixture answering service guide used only by tests to check the automated batch path end to end.', navigationLabel: 'Fixture trade answering service', eyebrow: 'Fixture trade calls', related: [], markdown };
page.approvedSha256 = sha(evidenceText({ pages: [page] }));
const request = { batchId: '2026-11-09-fixture', date, approver: REVIEWER, slack: { keywordsTs: '1.1', copyTs: '2.2' }, pages: [page] };

test('approved copy passes the editorial rules and becomes an approved record', () => {
  assert.deepEqual(copyProblems(page, date), []);
  const batch = buildBatch(registry, request);
  const { registry: next } = applyAndApprove(registry, batch, request);
  const record = next.find(r => r.slug === page.slug);
  assert.equal(record.publicationStatus, 'approved');
  assert.equal(record.review.reviewer, REVIEWER);
  assert.deepEqual(registryErrors(next), []);
});

test('copy edited after approval is rejected', () => {
  const edited = { ...page, markdown: page.markdown.replace('Plans start', 'Plans begin') };
  assert.throws(() => buildBatch(registry, { ...request, pages: [edited] }), /differs from what was approved/);
});

test('a second price or a missing disclaimer is caught', () => {
  assert.ok(copyProblems({ ...page, markdown: page.markdown.replace('24/7,', '24/7 for $99,') }, date).length > 0);
  assert.ok(copyProblems({ ...page, markdown: page.markdown.replace(DISCLAIMER(date), '') }, date).length > 0);
});
