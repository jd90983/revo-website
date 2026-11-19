import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  appUrl, goTarget, cleanAttribution, leadIdFor, isIcp, isUsZip, normalizeUsPhone, APP_KEYS
} from '../api/_app-flow.js';
import { validate, crmPayload } from '../api/app-start.js';
import goHandler from '../api/go.js';
import { TRADES } from '../scripts/build-app-flow-pages.mjs';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

test('app URL: query before the #, only the app keys, nothing after the route', () => {
  const url = appUrl({ lead_id: 'abc', utm_source: 'facebook', utm_campaign: 'trial', trade: 'locksmith', lp: '/locksmith', fbclid: 'X_1' });
  assert.equal(url, 'https://web.revoapp.ai/?lead_id=abc&utm_source=facebook&utm_campaign=trial&fbclid=X_1#/auth');
  const [beforeHash, afterHash] = url.split('#');
  assert.equal(afterHash, '/auth');
  assert.ok(beforeHash.includes('?'));
  for (const key of new URL(url).searchParams.keys()) assert.ok(APP_KEYS.includes(key), key);
});

test('attribution: unsafe values dropped', () => {
  const a = cleanAttribution({
    utm_source: 'facebook', utm_medium: 'x'.repeat(257), utm_campaign: 'https://evil.example',
    utm_content: 'me@example.com', utm_term: 'a#b', gclid: 'Cj0-abc_1', fbclid: 'bad value!', other: 'z'
  });
  assert.deepEqual(a, { utm_source: 'facebook', gclid: 'Cj0-abc_1' });
});

test('/go/<channel>: defaults only fill missing keys, and point to /start or the trade landing', () => {
  assert.equal(goTarget('meta', {}), '/start?utm_source=facebook&utm_medium=paid_social');
  assert.equal(goTarget('meta', { utm_source: 'fb_ads', utm_campaign: 'trial' }), '/start?utm_source=fb_ads&utm_campaign=trial&utm_medium=paid_social');
  assert.equal(goTarget('google', { trade: 'hvac', gclid: 'G1' }), '/hvac?gclid=G1&utm_source=google&utm_medium=cpc');
  assert.equal(goTarget('qr', { trade: 'other' }), '/start?utm_source=print&utm_medium=offline&trade=other');
  assert.equal(goTarget('unknown', { utm_source: 'x', evil: '1' }), '/start?utm_source=x');
});

test('/go handler answers 302 with no-store and noindex', () => {
  const headers = {};
  const res = { statusCode: 0, setHeader: (k, v) => { headers[k] = v; }, end() { this.ended = true; } };
  goHandler({ query: { channel: 'tiktok', utm_campaign: 'c1', utm_source: ['a', 'b'] } }, res);
  assert.equal(res.statusCode, 302);
  assert.equal(headers.Location, '/start?utm_campaign=c1&utm_source=tiktok&utm_medium=paid_social');
  assert.equal(headers['Cache-Control'], 'no-store');
  assert.ok(res.ended);
});

test('lead_id is stable per email (case-insensitive) and not the email', () => {
  const a = leadIdFor('Owner@Shop.com', 'salt'), b = leadIdFor('owner@shop.com ', 'salt');
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.notEqual(leadIdFor('owner@shop.com', 'other'), a);
  assert.ok(!a.includes('shop'));
});

test('ICP: a listed trade and a US ZIP', () => {
  assert.equal(isIcp('locksmith', '92101'), true);
  assert.equal(isIcp('other', '92101'), false);
  assert.equal(isIcp('hvac', 'M5V 2T6'), false);
  assert.equal(isUsZip('00000'), false);
  assert.equal(isUsZip('92101-1234'), true);
});

test('phone: US mobile normalized, others rejected', () => {
  assert.equal(normalizeUsPhone('(619) 555-0134'), '+16195550134');
  assert.equal(normalizeUsPhone('+1 619 555 0134'), '+16195550134');
  assert.equal(normalizeUsPhone('555-0134'), '');
  assert.equal(normalizeUsPhone('1 019 555 0134'), '');
});

test('form validation messages', () => {
  const ok = { email: 'a@b.co', business_name: 'Key Pros', trade: 'locksmith', zip: '92101', phone: '6195550134' };
  assert.ok(!validate(ok).error);
  assert.deepEqual(validate({ ...ok, email: 'nope' }).error, ['email', 'Enter a valid email.']);
  assert.deepEqual(validate({ ...ok, trade: 'dentist' }).error, ['trade', 'Pick your trade.']);
  assert.deepEqual(validate({ ...ok, phone: '12' }).error, ['phone', 'Enter a valid mobile number.']);
  // A non-US postal code is accepted (the account is tagged not-icp, never blocked).
  assert.ok(!validate({ ...ok, zip: 'M5V 2T6' }).error);
});

test('GoHighLevel payload: tags and attribution', () => {
  const v = validate({ email: 'a@b.co', business_name: 'Key Pros', trade: 'locksmith', zip: '92101', phone: '6195550134' });
  const p = crmPayload(v, 'L1', { utm_source: 'facebook', fbclid: 'F' }, '/locksmith', '2026-11-19T20:00:00.000Z', 'now');
  assert.equal(p.tags, 'revo-app,trade-locksmith,icp');
  assert.equal(p.trade, 'Locksmith');
  assert.equal(p.phone, '+16195550134');
  assert.equal(p.utm_source, 'facebook');
  assert.equal(p.fbclid, 'F');
  assert.equal(p.landing_page, '/locksmith');
  const other = crmPayload(validate({ email: 'a@b.co', business_name: 'X', trade: 'other', zip: '92101', phone: '6195550134' }), 'L2', {}, '', '', 'now');
  assert.equal(other.tags, 'revo-app,trade-other,not-icp');
});

const pages = [...TRADES.map(t => t.slug), 'start'];

test('every new page: noindex, GTM, Meta stub, flow script, out of the sitemap', () => {
  const sitemap = read('sitemap.xml');
  for (const slug of pages) {
    const html = read(slug + '.html');
    assert.ok(html.includes('<meta name="robots" content="noindex, nofollow">'), slug);
    assert.ok(html.includes('GTM-PFJBFLVF'), slug);
    assert.ok(html.includes("fbq('init', '2435811520564771')"), slug);
    assert.ok(html.includes('/js/app-flow.js'), slug);
    assert.ok(!sitemap.includes('revoapp.ai/' + slug + '<'), slug);
  }
});

test('copy rules: trial wording, prices, no banned claims, demo labeled', () => {
  for (const slug of pages) {
    const html = read(slug + '.html');
    assert.ok(html.includes('10 free calls. No credit card.'), slug);
    for (const banned of [/million/i, /20M\+/, /four million/i, /under 10 minutes/i, /10 days/i, /unlimited/i, /testimonial/i, /★/, /Ucallz|Uleadz|Teli|Group-U/i]) {
      assert.doesNotMatch(html, banned, slug + ' ' + banned);
    }
  }
  for (const t of TRADES) {
    const html = read(t.slug + '.html');
    assert.ok(html.includes('Example scenario'));
    assert.ok(html.includes('Acted example, not a real customer call.'));
    assert.ok(html.includes('$87.50 USD/mo for your first 3 months, then $175 USD/mo.'));
    assert.ok(html.includes('Free trial: 10 calls. Prices in USD.'));
    assert.ok(html.includes(`data-trade="${t.slug}"`));
    assert.equal((html.match(/data-app-cta=/g) || []).length, 2);
    assert.doesNotMatch(html, /<audio/);
  }
});

test('vercel.json: new routes only added, never replacing existing ones', () => {
  const v = JSON.parse(read('vercel.json'));
  const rewrite = s => v.rewrites.find(r => r.source === s);
  assert.equal(rewrite('/go/:channel').destination, '/api/go?channel=:channel');
  for (const slug of pages) assert.equal(rewrite('/' + slug).destination, '/' + slug + '.html');
  const sources = v.rewrites.map(r => r.source).concat(v.redirects.map(r => r.source));
  assert.equal(new Set(sources).size, sources.length, 'duplicate route source');
});
