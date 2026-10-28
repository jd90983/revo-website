import {publicUrl} from '../lib/public-url.ts';
import {hasAcquisitionLink,verifyPublicAssetBoundary} from '../lib/publication-boundary.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {REVIEW_PAGES} from '../lib/review-cohort.ts';
import {WorkflowGuideTemplate} from '../components/WorkflowGuideTemplate.tsx';
import {publicRoutes} from '../../app/tools/routes.mjs';
import {contentHash,registryErrors} from '../lib/registry-contract.mjs';

const guides=REVIEW_PAGES.filter(p=>p.template==='workflow'&&p.publicationStatus!=='withdrawn');
test('approved workflow guides obey publication approval and have no acquisition controls',()=>{
 assert.ok(guides.length>=103,'retain the existing workflow cohort while allowing reviewed additions');
 assert.equal(new Set(guides.map(page=>page.slug)).size,guides.length);
 assert.ok(!guides.some(page=>['after-hours','industry_plumbing.html'].includes(page.slug)));
 const routes=publicRoutes(REVIEW_PAGES,{navigationLimit:6});
 for(const page of guides){
  assert.ok(['draft','approved'].includes(page.publicationStatus));
  assert.equal(routes.includes('/ai-answering-service/'+page.slug),page.publicationStatus==='approved');
  if(page.publicationStatus==='approved')assert.equal(page.review.contentHash,contentHash(page));
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page}));
  assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(!hasAcquisitionLink(html));
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const link of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(link[1]),link[1]);
  assert.ok(html.includes('/css/layout.css'));
  assert.ok(html.includes('/css/variables.css'));
  assert.ok(html.includes('home-guide-title-base'));
  assert.ok(html.includes('home-guide-title-accent'));
 }
});
test('named-provider comparison preserves tier boundaries and adjacent primary sources',()=>{
 const page=guides.find(p=>p.slug==='compare/home-services-ai-receptionists');
 assert.ok(page);
 const providers=page.sections.slice(0,5);
 assert.deepEqual(providers.map(s=>s.title.split(':')[0]),['Avoca','Goodcall','Revo','Sameday','Smith.ai']);
 assert.ok(providers.every(s=>s.sources?.length));
 const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page}));
 assert.ok(html.includes('Sources for Avoca'));
 assert.ok(page.sections[2].paragraphs.join(' ').includes('excluded from Solo'));
 const invalid={...page,sections:[{...page.sections[0],sources:[{label:'Unsafe',href:'javascript:alert(1)'}]}]};
 assert.ok(registryErrors([invalid]).some(e=>e.includes('HTTPS')));
});
test('template choice is editorial content covered by the approval hash',()=>{
 const page=guides[0];
 assert.notEqual(contentHash(page),contentHash({...page,template:undefined}));
 assert.ok(registryErrors([{...page,template:'unrecognized'}]).some(e=>e.includes('template')));
});

test('coverage example reviews follow every call in their interval and the declared office policy',async()=>{
 const {readFile}=await import('node:fs/promises');
 const page=guides.find(p=>p.slug==='plan-24-7-phone-coverage');
 assert.ok(page);
 const links=page.sections.flatMap(s=>s.sources??[]).map(s=>s.href).filter(h=>/phone-coverage-fictional/.test(h));
 assert.equal(links.length,2);
 const parseCsv=text=>text.trimEnd().split(/\r?\n/).map(line=>line.slice(1,-1).split('","').map(v=>v.replaceAll('""','"')));
 const firstReview=end=>{
  const date=new Date(end);
  const localDay=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),0));
  // Examples use America/Phoenix, UTC-07, so derive the local calendar date explicitly.
  const local=new Date(end-7*3600000);
  localDay.setUTCFullYear(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate());
  for(let d=0;d<8;d++){
   const day=new Date(localDay.getTime()+d*86400000);
   if([0,6].includes(day.getUTCDay()))continue;
   for(const hour of [8,12,18]){const candidate=day.getTime()+(hour+7)*3600000;if(candidate>=end)return candidate;}
  }
  throw Error('No office review found');
 };
 for(const href of links){
  const name=new URL(href).pathname.split('/').pop();
  const text=await readFile(new URL('../public/ai-answering-service/assets/templates/'+name,import.meta.url),'utf8');
  const [fields,...rows]=parseCsv(text);let total=0;const byDay=new Map();
  for(const values of rows){
   assert.equal(values.length,fields.length);const r=Object.fromEntries(fields.map((key,i)=>[key,values[i]]));
   assert.equal(r.time_zone,'America/Phoenix');
   const start=Number(r.start_hour_local_inclusive),stop=Number(r.end_hour_local_exclusive);
   const end=Date.parse(r.effective_date+'T00:00:00-07:00')+stop*3600000;
   const review=Date.parse(r.routine_review_at);
   assert.ok(review>=end,`${name}: review precedes interval end on ${r.effective_date} ${start}-${stop}`);
   assert.equal(review,firstReview(end),`${name}: unnecessary delay beyond first eligible office review`);
   assert.notEqual(r.primary_answerer_role,r.backup_answerer_role);assert.equal(r.status,'planned_not_verified');
   if(!byDay.has(r.effective_date))byDay.set(r.effective_date,[]);byDay.get(r.effective_date).push([start,stop]);total+=stop-start;
  }
  assert.equal(byDay.size,7);assert.equal(total,168);
  for(const intervals of byDay.values()){let end=0;for(const [start,stop]of intervals.sort((a,b)=>a[0]-b[0])){assert.equal(start,end);assert.ok(stop>start);end=stop;}assert.equal(end,24);}
 }
});

test('worksheet downloads stay on the current deployment without changing reviewed source data',async()=>{
 const {readFile}=await import('node:fs/promises');const {createHash}=await import('node:crypto');
 let downloads=0;
 for(const slug of ['customer-service-call-log','plan-24-7-phone-coverage']){
  const page=guides.find(p=>p.slug===slug);const before=contentHash(page);
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page}));
  for(const s of page.sections.flatMap(s=>s.sources??[]).filter(s=>s.href.endsWith('.csv'))){
   const url=new URL(s.href);assert.ok(html.includes(`href="${url.pathname}"`));assert.ok(!html.includes(`href="${s.href}"`));
   const bytes=await readFile(new URL('../public'+url.pathname,import.meta.url));
   const hash=createHash('sha256').update(bytes).digest('hex');
   assert.ok(url.pathname.endsWith('-'+hash.slice(0,12)+'.csv'));assert.ok(page.sourcePaths.some(p=>p.includes(hash)));
   assert.equal(new URL(url.pathname,'https://preview.example.test').origin,'https://preview.example.test');downloads++;
  }
  assert.equal(contentHash(page),before);assert.equal(page.review.contentHash,before);
 }
 assert.equal(downloads,5);
 const original=guides.find(p=>p.slug==='customer-service-call-log');
 const links=['https://supplier.example/ai-answering-service/assets/templates/file.csv','https://www.revoapp.ai/pricing.html','https://www.revoapp.ai.evil.example/ai-answering-service/assets/templates/file.csv'];
 const probe={...original,sections:[{...original.sections[0],sources:links.map(href=>({href,label:'External reference'}))}]};
 const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page:probe}));
 for(const href of links)assert.ok(html.includes(`href="${publicUrl(href)}"`));
});

test('approved Markdown transfers retain exact copy, semantic tables, code and local companion resources',async()=>{
 const {createHash}=await import('node:crypto');const {readFile}=await import('node:fs/promises');
 const articles=guides.filter(p=>p.markdownArticle);assert.ok(articles.length>=17,'retain the original Markdown cohort while validating reviewed additions');
 let tables=0,codes=0,resources=0;
 for(const page of articles){
  const article=page.markdownArticle;
  assert.equal(createHash('sha256').update(article.content).digest('hex'),article.sha256);
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page}));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  const h1=article.content.split('\n')[0].slice(2);
  assert.ok(html.includes(h1.split(' ').slice(0,-3).join(' ')));
  if(article.content.includes('|---')){assert.ok(html.includes('<table>'));assert.ok(html.includes('scope="col"'));assert.ok(html.includes('tabindex="0"'));tables++;}
  if(article.content.includes('```')){assert.ok(html.includes('<pre>'));codes++;}
  for(const a of article.assets){
   assert.ok(html.includes(`href="${a.href}"`));const bytes=await readFile(new URL('../public'+a.href,import.meta.url));
   assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);resources++;
  }
  const changed={...page,markdownArticle:{...article,content:article.content+'\nChanged'}};
  assert.notEqual(contentHash(changed),contentHash(page));
 }
 assert.ok(tables>=5);assert.ok(codes>=1);assert.equal(resources,7);
});

test('publication boundary permits only exact approved public resources and Google documentation',async()=>{
 const {createHash}=await import('node:crypto');
 assert.equal(hasAcquisitionLink('<a href="https://developers.google.com/workspace/calendar/api/auth">Official documentation</a>'),false);
 for(const href of ['/api/leads','https://www.revoapp.ai/api/leads','https://other.example/api/auth','https://developers.google.com.evil.example/workspace/calendar/api/auth','https://developers.google.com/workspace/calendar/api/unapproved','/free-test','https://example.test/signup'])assert.equal(hasAcquisitionLink(`<a href="${href}">Blocked</a>`),true,href);
 assert.equal(hasAcquisitionLink('<form action="/anything"></form>'),true);
 const bytes=Buffer.from('Approved public worksheet\n'),sha=createHash('sha256').update(bytes).digest('hex'),path='ai-answering-service/assets/templates/worksheet-'+sha.slice(0,12)+'.md',manifest=[{path,sha256:sha}];
 await verifyPublicAssetBoundary([path],async()=>bytes,manifest);
 for(const forbidden of ['notes/private.md','notes/private.py','seo/shared/data/research.md','api/leads.js','.env','.env.local','credentials.pem','backup.sql'])await assert.rejects(verifyPublicAssetBoundary([path,forbidden],async()=>bytes,manifest),/Internal source/);
 await assert.rejects(verifyPublicAssetBoundary([path],async()=>Buffer.from('Changed'),manifest),/hash mismatch/);
 await assert.rejects(verifyPublicAssetBoundary([],async()=>bytes,manifest),/Missing/);
 await assert.rejects(verifyPublicAssetBoundary(['notes/private.md'],async()=>bytes,[{path:'notes/private.md',sha256:sha}]),/Invalid/);
});

test('public companion downloads have scoped attachment headers and safe content types',async()=>{
 const {readFile}=await import('node:fs/promises');
 const manifest=JSON.parse(await readFile(new URL('../data/public-companion-assets.json',import.meta.url),'utf8'));
 const vercel=JSON.parse(await readFile(new URL('../../../vercel.json',import.meta.url),'utf8'));
 for(const a of manifest){
  const rule=vercel.headers.find(h=>h.source==='/'+a.path);assert.ok(rule,a.path);
  const headers=Object.fromEntries(rule.headers.map(h=>[h.key.toLowerCase(),h.value]));
  assert.ok(headers['content-disposition'].startsWith('attachment;'));
  assert.match(headers['content-type'],/^(text\/(plain|csv)|application\/json); charset=utf-8$/);
 }
});

test('Markdown decision maps and code blocks have explicit AA text contrast',async()=>{
 const {readFile}=await import('node:fs/promises');
 const css=await readFile(new URL('../../../css/revo-markdown-guides.css',import.meta.url),'utf8');
 const rule=css.match(/\.home-guide-markdown pre\{([^}]+)\}/)?.[1];assert.ok(rule);
 const fg=rule.match(/(?:^|;)color:(#[a-f0-9]{6})(?:;|$)/)?.[1],bg=rule.match(/(?:^|;)background:(#[a-f0-9]{6})(?:;|$)/)?.[1];assert.ok(fg&&bg,'Both foreground and background must be explicit');
 const luminance=hex=>{
  const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  return c[0]*0.2126+c[1]*0.7152+c[2]*0.0722;
 };
 const a=luminance(fg),b=luminance(bg);assert.ok((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)>=4.5);
 assert.match(css,/\.home-guide-markdown pre code\{color:inherit\}/);
 const breezy=guides.find(p=>p.slug==='breezy-ai-receptionist');const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page:breezy}));
 assert.ok(html.includes('<pre><code class="language-text">Where should the office manage the customer record?'));
});
