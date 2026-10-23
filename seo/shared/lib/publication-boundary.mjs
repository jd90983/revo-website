import {createHash} from 'node:crypto';
// Explicit references approved in the scheduling guide; not a general /api/ exception.
const PUBLIC_API_REFERENCES=new Set([
 'https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query',
 'https://developers.google.com/workspace/calendar/api/auth',
 'https://developers.google.com/workspace/calendar/api/guides/version-resources',
 'https://developers.google.com/workspace/calendar/api/guides/errors',
]);
export function hasAcquisitionLink(html){
 if(/<form\b/i.test(html))return true;
 for(const match of html.matchAll(/href\s*=\s*(["'])(.*?)\1/gi)){
  const href=match[2];
  if(/free-test|signup|apps\.apple\.com/i.test(href))return true;
  if(/\/api\//i.test(href)&&!PUBLIC_API_REFERENCES.has(href))return true;
 }
 return false;
}
export function sensitivePublicPath(path){
 return /(?:^|\/)(?:api|seo|\.git|\.aws|\.codex)(?:\/|$)/i.test(path)||/(?:^|\/)\.env(?:\.|$)/i.test(path)||/\.(?:sql|env|pem|key)$/i.test(path);
}
/** A public Markdown exception is exact-path AND exact-bytes, never extension-wide. */
export async function verifyPublicAssetBoundary(files,readBytes,manifest){
 const allowed=new Map();
 for(const asset of manifest){
  if(!/^ai-answering-service\/assets\/templates\/[a-z0-9_-]+-[a-f0-9]{12}\.(?:csv|md|py|json)$/.test(asset.path)||!/^[a-f0-9]{64}$/.test(asset.sha256)||sensitivePublicPath(asset.path)||allowed.has(asset.path))throw Error('Invalid public companion asset manifest');
  if(!asset.path.includes('-'+asset.sha256.slice(0,12)+'.'))throw Error('Public companion filename/hash mismatch');
  allowed.set(asset.path,asset.sha256);
 }
 for(const path of files){
  if(sensitivePublicPath(path)||(/\.(?:md|py)$/i.test(path)&&!allowed.has(path)))throw Error('Internal source leaked into static output: '+path);
  if(allowed.has(path)&&createHash('sha256').update(await readBytes(path)).digest('hex')!==allowed.get(path))throw Error('Public companion asset hash mismatch: '+path);
 }
 for(const path of allowed.keys())if(!files.includes(path))throw Error('Missing approved public companion asset: '+path);
}
