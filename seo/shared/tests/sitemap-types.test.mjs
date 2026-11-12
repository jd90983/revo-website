import test from 'node:test';
import assert from 'node:assert/strict';
import { sitemapsByType, sitemapType } from '../lib/sitemap-types.mjs';

const origin = 'https://www.revoapp.ai';
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
  <url><loc>${origin}/pricing</loc></url>
  <url><loc>${origin}/industries</loc></url>
  <url><loc>${origin}/industry_plumbing</loc></url>
  <url><loc>${origin}/ai-answering-service</loc></url>
  <url><loc>${origin}/ai-answering-service/missed-calls</loc><lastmod>2026-11-01</lastmod></url>
  <url><loc>${origin}/ai-answering-service/compare/ai-vs-voicemail</loc></url>
</urlset>`;

test('each URL lands in exactly one typed sitemap and the index lists every file', () => {
  const files = new Map(sitemapsByType(xml, origin));
  const locs = name => [...files.get(name).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(locs('sitemap-core.xml'), [origin + '/', origin + '/pricing']);
  assert.deepEqual(locs('sitemap-industries.xml'), [origin + '/industries', origin + '/industry_plumbing']);
  assert.deepEqual(locs('sitemap-guides.xml'), [origin + '/ai-answering-service', origin + '/ai-answering-service/missed-calls']);
  assert.deepEqual(locs('sitemap-compare.xml'), [origin + '/ai-answering-service/compare/ai-vs-voicemail']);
  assert.ok(files.get('sitemap-guides.xml').includes('<lastmod>2026-11-01</lastmod>'), 'lastmod kept');
  assert.equal(locs('sitemap-index.xml').length, 4);
  assert.equal(sitemapType(origin + '/ai-answering-service/compare/x', origin), 'compare');
});
