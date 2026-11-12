// AGENT-12 · Sitemaps by page type. sitemap.xml remains the complete list; these files repeat the same URLs
// grouped by type, plus an index, so Search Console can report indexing per type. Pure function, no I/O.
export const SITEMAP_TYPES = ['core', 'industries', 'guides', 'compare'];

export function sitemapType(url, origin) {
  const path = url.startsWith(origin) ? url.slice(origin.length) || '/' : new URL(url).pathname;
  if (path.startsWith('/ai-answering-service/compare/')) return 'compare';
  if (path === '/ai-answering-service' || path.startsWith('/ai-answering-service/')) return 'guides';
  if (path === '/industries' || path.startsWith('/industry_') || path.startsWith('/industries/')) return 'industries';
  return 'core';
}

/** @returns {Array<[string, string]>} [file name, xml] for each typed sitemap and the index. */
export function sitemapsByType(sitemapXml, origin) {
  const entries = [...sitemapXml.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m => m[0].trim());
  const groups = new Map(SITEMAP_TYPES.map(t => [t, []]));
  for (const entry of entries) {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    groups.get(sitemapType(loc, origin)).push(entry);
  }
  const head = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const files = [];
  const index = [];
  for (const [type, items] of groups) {
    if (!items.length) continue;
    const name = `sitemap-${type}.xml`;
    files.push([name, head + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ' + items.join('\n  ') + '\n</urlset>\n']);
    index.push(`  <sitemap><loc>${origin}/${name}</loc></sitemap>`);
  }
  files.push(['sitemap-index.xml', head + '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + index.join('\n') + '\n</sitemapindex>\n']);
  return files;
}
