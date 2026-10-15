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
 assert.equal(guides.length,39);
 assert.equal(new Set(guides.map(page=>page.slug)).size,39);
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
