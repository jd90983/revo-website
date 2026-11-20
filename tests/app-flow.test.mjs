import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  appUrl, goTarget, cleanAttribution, leadIdFor, isIcp, normalizeUsPhone, safeValue, APP_KEYS
} from '../api/_app-flow.js';
import appStart, { validate, crmPayload } from '../api/app-start.js';
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
  assert.equal(goTarget('meta', {}), '/home-services?utm_source=facebook&utm_medium=paid_social');
  assert.equal(goTarget('meta', { utm_source: 'fb_ads', utm_campaign: 'trial' }), '/home-services?utm_source=fb_ads&utm_campaign=trial&utm_medium=paid_social');
  assert.equal(goTarget('google', { trade: 'hvac', gclid: 'G1' }), '/hvac?gclid=G1&utm_source=google&utm_medium=cpc');
  assert.equal(goTarget('qr', { trade: 'other' }), '/home-services?utm_source=print&utm_medium=offline&trade=other');
  assert.equal(goTarget('unknown', { utm_source: 'x', evil: '1' }), '/home-services?utm_source=x');
});

test('/go handler answers 302 with no-store and noindex', () => {
  const headers = {};
  const res = { statusCode: 0, setHeader: (k, v) => { headers[k] = v; }, end() { this.ended = true; } };
  goHandler({ query: { channel: 'tiktok', utm_campaign: 'c1', utm_source: ['a', 'b'] } }, res);
  assert.equal(res.statusCode, 302);
  assert.equal(headers.Location, '/home-services?utm_campaign=c1&utm_source=tiktok&utm_medium=paid_social');
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

test('ICP: a listed trade (not other) and a valid US mobile', () => {
  assert.equal(isIcp('locksmith', '(619) 555-0134'), true);
  assert.equal(isIcp('landscaping', '+1 619 555 0134'), true);
  assert.equal(isIcp('other', '6195550134'), false);
  assert.equal(isIcp('', '6195550134'), false);
  assert.equal(isIcp('hvac', '555-0134'), false);
});

test('phone: US mobile normalized, others rejected', () => {
  assert.equal(normalizeUsPhone('(619) 555-0134'), '+16195550134');
  assert.equal(normalizeUsPhone('+1 619 555 0134'), '+16195550134');
  assert.equal(normalizeUsPhone('555-0134'), '');
  assert.equal(normalizeUsPhone('1 019 555 0134'), '');
});

test('form: three fields (email, US mobile, business name) plus the trade; no ZIP', () => {
  const ok = { email: 'a@b.co', phone: '6195550134', business_name: 'Key Pros', trade: 'locksmith' };
  const v = validate(ok);
  assert.ok(!v.error);
  assert.deepEqual(Object.keys(v).sort(), ['businessName', 'email', 'phone', 'trade']);
  assert.deepEqual(validate({ ...ok, email: 'nope' }).error, ['email', 'Enter a valid email.']);
  assert.deepEqual(validate({ ...ok, phone: '12' }).error, ['phone', 'Enter a valid US mobile number.']);
  assert.deepEqual(validate({ ...ok, phone: '+44 20 7946 0958' }).error, ['phone', 'Enter a valid US mobile number.']);
  assert.deepEqual(validate({ ...ok, business_name: ' ' }).error, ['business_name', 'Enter your business name.']);
  assert.deepEqual(validate({ ...ok, trade: 'towing' }).error, ['trade', 'Pick your trade.']);
  assert.ok(!validate({ ...ok, trade: 'cleaning' }).error);
});

test('UTM ids: utm_content / utm_term accept bare numeric ids up to 20 digits; other filters stay', () => {
  assert.equal(safeValue('123456789012', 'utm_content'), '123456789012');
  assert.equal(safeValue('12345678901234567890', 'utm_term'), '12345678901234567890');
  assert.equal(safeValue('123456789012345678901', 'utm_content'), '');
  assert.equal(safeValue('123456789012', 'utm_campaign'), '');
  assert.equal(safeValue('ad_123456789012', 'utm_content'), '');
  assert.equal(safeValue('me@x.co', 'utm_content'), '');
  assert.equal(safeValue('https://x.co', 'utm_term'), '');
  assert.equal(safeValue('a#b', 'utm_term'), '');
  assert.deepEqual(cleanAttribution({ utm_content: '123456789012', utm_term: '987654321' }), { utm_content: '123456789012', utm_term: '987654321' });
  assert.equal(goTarget('meta', { trade: 'locksmith', utm_campaign: 'test_flow', utm_content: '123456789012' }),
    '/locksmith?utm_campaign=test_flow&utm_content=123456789012&utm_source=facebook&utm_medium=paid_social');
});

test('GoHighLevel payload: same keys and tags, plus last_* and no ZIP', () => {
  const v = validate({ email: 'a@b.co', business_name: 'Key Pros', trade: 'locksmith', phone: '6195550134' });
  const p = crmPayload(v, 'L1', { utm_source: 'facebook', fbclid: 'F' }, '/locksmith', '2026-11-19T20:00:00.000Z', 'now',
    { utm_source: 'google', utm_content: '123456789012', gclid: 'G1' }, '/locksmith');
  assert.equal(p.last_utm_source, 'google');
  assert.equal(p.last_utm_content, '123456789012');
  assert.equal(p.last_gclid, 'G1');
  assert.equal(p.last_utm_campaign, '');
  assert.equal(p.page_url, 'https://www.revoapp.ai/locksmith');
  assert.ok(!('zip' in p) && !('postal_code_is_us' in p));
  assert.equal(p.tags, 'revo-app-start,trade-locksmith,icp');
  assert.equal(p.trade_tag, 'trade-locksmith');
  assert.equal(p.icp, 'icp');
  assert.equal(p.trade, 'Locksmith');
  assert.equal(p.phone, '+16195550134');
  assert.equal(p.utm_source, 'facebook');
  assert.equal(p.fbclid, 'F');
  assert.equal(p.landing_page, '/locksmith');
  const other = crmPayload(validate({ email: 'a@b.co', business_name: 'X', trade: 'other', phone: '6195550134' }), 'L2', {}, '', '', 'now');
  assert.equal(other.page_url, 'https://www.revoapp.ai/home-services');
  assert.equal(other.tags, 'revo-app-start,trade-other,not-icp');
});

const pages = [...TRADES.map(t => t.slug), 'start', 'home-services'];

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
    for (const banned of [/million/i, /20M\+/, /four million/i, /under 10 minutes/i, /10 days/i, /unlimited/i, /testimonial/i, /★/, /Ucallz|Uleadz|Teli|Group-U/i, /bilingual/i, /spanish|español/i]) {
      assert.doesNotMatch(html, banned, slug + ' ' + banned);
    }
  }
  for (const t of TRADES) {
    const html = read(t.slug + '.html');
    assert.ok(html.includes(`data-trade="${t.slug}"`));
    assert.doesNotMatch(html, /<audio/);
  }
});

test('form on the first screen: email, phone, business name, hidden trade, no ZIP, no /start hop', () => {
  for (const t of TRADES) {
    const html = read(t.slug + '.html');
    const hero = html.slice(html.indexOf('<section class="af-hero"'), html.indexOf('</section>'));
    assert.ok(hero.includes('id="app-start-form"'), t.slug);
    for (const name of ['email', 'phone', 'business_name']) assert.ok(hero.includes(`name="${name}"`), t.slug + ' ' + name);
    assert.ok(hero.includes(`<input type="hidden" name="trade" value="${t.slug}">`), t.slug);
    assert.ok(hero.includes('>Create my free account</button>'), t.slug);
    assert.ok(hero.includes('We’ll use it to reach you about your account.'), t.slug);
    // Email, then phone, then business name.
    assert.ok(hero.indexOf('name="email"') < hero.indexOf('name="phone"') && hero.indexOf('name="phone"') < hero.indexOf('name="business_name"'), t.slug);
    assert.doesNotMatch(html, /name="zip"|href="\/start/, t.slug);
    // A flow step, not a landing: one form, one call to action, nothing below it.
    assert.equal((html.match(/Create my free account/g) || []).length, 1, t.slug);
    assert.equal((html.match(/<form /g) || []).length, 1, t.slug);
    assert.doesNotMatch(html, /af-more|af-cta-secondary/, t.slug);
  }
  assert.equal(read('home-services.html'), read('start.html'));
  const start = read('home-services.html');
  assert.ok(start.includes('home service'));
  assert.ok(start.includes('<select id="af-trade" name="trade" required>'));
  for (const t of TRADES) assert.ok(start.includes(`<option value="${t.slug}">`), t.slug);
  assert.doesNotMatch(start, /name="zip"/);
  assert.ok(TRADES.some(t => t.slug === 'landscaping') && TRADES.some(t => t.slug === 'cleaning'));
});

test('a trade with no page (towing) and links with no trade go to /home-services, keeping UTMs', () => {
  assert.equal(goTarget('meta', { trade: 'towing', utm_campaign: 'c1' }), '/home-services?utm_campaign=c1&utm_source=facebook&utm_medium=paid_social');
});

test('last click goes to the app and to last_*; first touch stays in utm_*', async () => {
  delete process.env.GHL_APP_START_WEBHOOK_URL;
  const body = {
    email: 'qa@example.com', phone: '6195550134', business_name: 'QA', trade: 'locksmith', page: '/locksmith',
    attribution: { utm_source: 'facebook', utm_campaign: 'first', lp: '/locksmith', first_touch_at: '2026-11-01T00:00:00.000Z' },
    last: { utm_source: 'google', utm_campaign: 'second', utm_content: '123456789012', gclid: 'G1' }
  };
  const headers = {};
  let out = '';
  const res = { statusCode: 200, setHeader: (k, v) => { headers[k] = v; }, end(x) { out = x || ''; } };
  await appStart({ method: 'POST', body }, res);
  const j = JSON.parse(out);
  assert.equal(j.ok, true);
  const app = new URL(j.redirect);
  assert.equal(app.searchParams.get('utm_source'), 'google');
  assert.equal(app.searchParams.get('utm_campaign'), 'second');
  assert.equal(app.searchParams.get('utm_content'), '123456789012');
  assert.equal(app.searchParams.get('gclid'), 'G1');
  assert.equal(app.hash, '#/auth');
  for (const key of app.searchParams.keys()) assert.ok(APP_KEYS.includes(key), key);
  // With no last click, the app gets the first touch.
  await appStart({ method: 'POST', body: { ...body, last: {} } }, res);
  assert.equal(new URL(JSON.parse(out).redirect).searchParams.get('utm_campaign'), 'first');
});

const LEGACY = ['/10-free-calls', '/free-calls', '/free-account', '/free-agent', '/free-test', '/free-trial-b', '/lp/:path*'];

test('old funnels: each rewrites to the /go handler, which answers 302 and keeps the UTMs', () => {
  const v = JSON.parse(read('vercel.json'));
  for (const src of LEGACY) {
    const r = v.rewrites.find(x => x.source === src);
    assert.ok(r, src);
    assert.equal(r.destination, '/api/go?channel=legacy', src);
  }
  const headers = {};
  const res = { statusCode: 0, setHeader: (k, v) => { headers[k] = v; }, end() {} };
  goHandler({ query: { channel: 'legacy', utm_source: 'facebook', utm_campaign: 'old_ad', utm_content: '123456789012', fbclid: 'F1', path: 'some-slug' } }, res);
  assert.equal(res.statusCode, 302);
  assert.equal(headers.Location, '/home-services?utm_source=facebook&utm_campaign=old_ad&utm_content=123456789012&fbclid=F1');
  goHandler({ query: { channel: 'legacy', trade: 'hvac', utm_source: 'google' } }, res);
  assert.equal(headers.Location, '/hvac?utm_source=google');
});

test('vercel.json: new routes only added, never replacing existing ones', () => {
  const v = JSON.parse(read('vercel.json'));
  const rewrite = s => v.rewrites.find(r => r.source === s);
  assert.equal(rewrite('/go/:channel').destination, '/api/go?channel=:channel');
  for (const slug of pages) assert.equal(rewrite('/' + slug).destination, '/' + slug + '.html');
  const sources = v.rewrites.map(r => r.source).concat(v.redirects.map(r => r.source));
  assert.equal(new Set(sources).size, sources.length, 'duplicate route source');
});
