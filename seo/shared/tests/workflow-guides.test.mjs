import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {REVIEW_PAGES} from '../lib/review-cohort.ts';
import {WorkflowGuideTemplate} from '../components/WorkflowGuideTemplate.tsx';
import {publicRoutes} from '../../app/tools/routes.mjs';
import {contentHash,registryErrors} from '../lib/registry-contract.mjs';

const guides=REVIEW_PAGES.filter(p=>p.template==='workflow'&&p.publicationStatus!=='withdrawn');
test('measured workflow drafts stay out of routes and have no acquisition controls',()=>{
 assert.equal(guides.length,20);
 assert.equal(new Set(guides.map(page=>page.slug)).size,20);
 assert.ok(!guides.some(page=>['after-hours','industry_plumbing.html'].includes(page.slug)));
 const routes=publicRoutes(REVIEW_PAGES,{navigationLimit:6});
 for(const page of guides){
  assert.equal(page.publicationStatus,'draft');
  assert.ok(!routes.includes('/ai-answering-service/'+page.slug));
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page}));
  assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(!/<form\b|\/api\/|free-test|signup|apps\.apple\.com/.test(html));
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const link of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(link[1]),link[1]);
  assert.ok(html.includes('/css/revo-call-design.css'));
 }
});
test('template choice is editorial content covered by the approval hash',()=>{
 const page=guides[0];
 assert.notEqual(contentHash(page),contentHash({...page,template:undefined}));
 assert.ok(registryErrors([{...page,template:'unrecognized'}]).some(e=>e.includes('template')));
});
