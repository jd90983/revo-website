import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {publicUrl} from '../lib/public-url.ts';
import {withSeoRewrites, seoRedirects} from '../../app/tools/routes.mjs';
const root = new URL('../../../', import.meta.url);
const read = p => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const vercel = read('vercel.json');
const legacy = read('seo/shared/data/public-html-routes.json');
const config = read('seo/app/site.config.json');
const pages = read('seo/shared/data/landing-pages.json');
test('every legacy HTML alias has a direct permanent redirect and physical rewrite', () => {
 for (const [old, clean] of Object.entries(legacy)) {
  const redirect = vercel.redirects.find(r => r.source === old);
  assert.equal(redirect?.destination, 'https://www.revoapp.ai' + clean, old);
  assert.equal(redirect.permanent, true, old);
  assert.ok(!vercel.redirects.some(r => r.source === clean), clean);
  if(clean !== '/') assert.ok(vercel.rewrites.some(r => r.source === clean && r.destination === (old === '/ser.html' ? '/services.html' : old === '/ind.html' ? '/industries.html' : old)), clean);
  assert.ok(vercel.redirects.indexOf(redirect) < vercel.redirects.findIndex(r => r.has?.some(h => h.type === 'host')), old);
 }
 assert.ok(!vercel.cleanUrls);
 assert.ok(vercel.headers.some(r => r.source === '/thank-you' && r.headers.some(h=>h.key==='X-Robots-Tag' && h.value==='noindex')));
});
test('generator maintains HTML redirects for every approved guide, including future batches', () => {
 const next = withSeoRewrites(vercel, pages, config);
 for(const redirect of seoRedirects(pages, config)) assert.ok(next.redirects.some(r=>JSON.stringify(r)===JSON.stringify(redirect)), redirect.source);
 assert.deepEqual(withSeoRewrites(next,pages,config),next);
 const generated = withSeoRewrites(vercel, [{slug:'future-page',publicationStatus:'approved'}],config);
 assert.ok(generated.redirects.some(r=>r.source==='/ai-answering-service/future-page.html' && r.destination.endsWith('/future-page')));
});
test('rendered references preserve query and fragment, leave external HTML and assets alone', () => {
 assert.equal(publicUrl('https://www.revoapp.ai/pricing.html?utm_source=test#plans'),'https://www.revoapp.ai/pricing?utm_source=test#plans');
 assert.equal(publicUrl('https://revoapp.ai/ser.html?a=1#x'),'https://www.revoapp.ai/services?a=1#x');
 assert.equal(publicUrl('/index.html#top'),'/#top');
 assert.equal(publicUrl('/templates/transform-cta-section.html'),'/templates/transform-cta-section');
 for(const url of ['https://example.com/pricing.html','/images/logo.webp','/ai-answering-service/assets/templates/example.csv']) assert.equal(publicUrl(url),url);
});
