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
  assert.ok(!/<form\b|\/api\/|free-test|signup|apps\.apple\.com/.test(html));
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
