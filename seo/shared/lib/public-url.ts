/** Resolve historical Revo references for navigation without changing reviewed source records. */
export function publicUrl(href: string): string {
  const absolute = /^https?:\/\//.test(href);
  if (!absolute && !href.startsWith('/')) return href;
  const url = new URL(href, 'https://www.revoapp.ai');
  if (!['www.revoapp.ai', 'revoapp.ai'].includes(url.hostname) || !url.pathname.endsWith('.html')) return href;
  const aliases: Record<string, string> = {'/index.html':'/', '/ser.html':'/services', '/ind.html':'/industries'};
  const path = aliases[url.pathname] ?? url.pathname.slice(0, -5);
  return (absolute ? 'https://www.revoapp.ai' : '') + path + url.search + url.hash;
}
