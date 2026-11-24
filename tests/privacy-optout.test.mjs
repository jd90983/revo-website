import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const pages = readdirSync(new URL('../', import.meta.url)).filter(f => f.endsWith('.html'));
const tagged = pages.filter(f => /GTM-PFJBFLVF|2435811520564771|DARE3CJC77U88MSO6OQ0/.test(read(f)));

test('every page with ad or analytics tags runs the opt-out guard first in <head>', () => {
  assert.ok(tagged.length > 60);
  for (const f of tagged) {
    const html = read(f);
    const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
    const firstScript = head.slice(head.indexOf('<script'));
    assert.ok(firstScript.startsWith('<script>\n(function () {\n  var optout = false;'), f + ': guard is not the first script');
    assert.ok(head.indexOf('window.revoAdOptOut = optout') < head.indexOf('googletagmanager.com/gtm.js') || !head.includes('googletagmanager.com/gtm.js'), f);
  }
});

test('Meta and TikTok snippets do nothing when opted out; no Meta <noscript> image', () => {
  for (const f of tagged) {
    const html = read(f);
    for (const block of html.match(/<!-- Meta Pixel Code[\s\S]*?<!-- End Meta Pixel Code -->/g) || []) {
      assert.match(block, /<script>\nif \(!window\.revoAdOptOut\) \{\n/, f);
    }
    assert.doesNotMatch(html, /facebook\.com\/tr\?id=/, f);
    if (html.includes('installRevoTikTokPixel = function')) assert.ok(html.includes('if (installed || window.revoAdOptOut) return;'), f);
    assert.doesNotMatch(html, /^\s*add\('https:\/\/connect\.facebook\.net/m, f);
  }
});

test('"Your Privacy Choices" link in the footer of every page', () => {
  for (const f of pages.filter(p => p !== 'benefits-temp.html')) {
    const html = read(f);
    const footer = html.slice(html.indexOf('<footer'));
    assert.match(footer, /<a href="\/?privacy-choices">Your Privacy Choices<\/a>/, f);
  }
});

function runGuard({ gpc = false, stored = null, cookie = '' } = {}) {
  const html = read('index.html');
  const code = html.match(/<script>\n(\(function \(\) \{\n  var optout = false;[\s\S]*?)<\/script>/)[1];
  const window = { dataLayer: undefined };
  const ctx = {
    window, navigator: { globalPrivacyControl: gpc },
    localStorage: { getItem: k => (k === 'revo_ad_optout' ? stored : null) },
    document: { cookie }
  };
  ctx.dataLayer = undefined;
  vm.createContext(ctx);
  vm.runInContext('var dataLayer;' + code.replace(/window\.dataLayer = window\.dataLayer \|\| \[\];/, 'window.dataLayer = window.dataLayer || []; dataLayer = window.dataLayer;'), ctx);
  return window;
}

test('guard: GPC, localStorage or cookie opt out; otherwise not', () => {
  const none = runGuard();
  assert.equal(none.revoAdOptOut, false);
  assert.equal(JSON.stringify(none.dataLayer.at(-1)), '{"revo_ad_optout":"no"}');
  assert.equal(none.fbq, undefined);
  for (const opts of [{ gpc: true }, { stored: '1' }, { cookie: 'a=b; revo_ad_optout=1' }]) {
    const w = runGuard(opts);
    assert.equal(w.revoAdOptOut, true, JSON.stringify(opts));
    assert.equal(JSON.stringify(w.dataLayer.at(-1)), '{"revo_ad_optout":"yes"}');
    assert.equal(JSON.stringify(Array.from(w.dataLayer[0])), JSON.stringify(['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]));
    assert.equal(typeof w.fbq, 'function');
  }
});

test('privacy policy: 14 sections, November 2026, contents match anchors', () => {
  const html = read('privacy-policy.html');
  assert.ok(html.includes('Effective Date: November 2026'));
  assert.doesNotMatch(html, /July 2026/);
  const ids = [...html.matchAll(/<section class="legal-section" id="([^"]+)">/g)].map(m => m[1]);
  const toc = [...html.slice(html.indexOf('legal-toc'), html.indexOf('</nav>', html.indexOf('legal-toc'))).matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, 14);
  assert.deepEqual(toc, ids);
  assert.ok(ids.includes('your-choices-about-advertising'));
  assert.ok(html.includes('<a href="/privacy-choices">Your Privacy Choices</a>'));
  assert.ok(html.includes('We honor Global Privacy Control (GPC) signals'));
});

test('privacy choices page: noindex, not in the sitemap, both buttons and the email request', () => {
  const html = read('privacy-choices.html');
  assert.ok(html.includes('<meta name="robots" content="noindex">'));
  assert.ok(!read('sitemap.xml').includes('privacy-choices'));
  assert.ok(html.includes('<a href="/privacy-policy#your-choices-about-advertising">Privacy Policy</a>'));
  for (const id of ['pc-status', 'pc-optout', 'pc-optin']) assert.ok(html.includes(`id="${id}"`), id);
  assert.ok(html.includes('href="mailto:privacy@revoapp.ai?subject=Opt%20out%20of%20sharing%20for%20advertising&amp;body=Please%20opt%20me%20out.%20Email%20or%20phone%20used%20with%20Revo%3A%20"'));
  assert.ok(html.includes("document.cookie = 'revo_ad_optout=1; max-age=63072000; path=/; SameSite=Lax; Secure';"));
  assert.ok(html.includes('Opting out does not affect your Revo account or service.'));
  assert.equal(JSON.parse(read('vercel.json')).rewrites.find(r => r.source === '/privacy-choices').destination, '/privacy-choices.html');
});
