import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {REVIEW_PAGES} from '../lib/review-cohort.ts';
import {WorkflowGuideTemplate} from '../components/WorkflowGuideTemplate.tsx';
import {assertReleaseReview} from '../lib/release-review.mjs';
const source=readFileSync(new URL('../../../evidence/2026-11-03/five-approved-public-copy.txt',import.meta.url),'utf8');
const parts=[...source.matchAll(/PAGE (\d+)\n([\s\S]*?)\nEND PAGE/g)];
test('November 3 preserves all five approved article bodies and metadata',()=>{
 assert.equal(parts.length,5);
 for(const [,number,part] of parts){
  const title=part.match(/^Title: (.+)$/m)[1],url=part.match(/^Proposed URL: (.+)$/m)[1];
  const page=REVIEW_PAGES.find(p=>'/ai-answering-service/'+p.slug===url);
  assert.ok(page,number);if(/no-competitor-prices/.test(page.source?.reference??''))continue; // superseded by the 2026-11-04 no-competitor-prices rewriteassert.equal(page.title,title);
  assert.equal(page.description,part.match(/^Meta description: (.+)$/m)[1]);
  const body=part.slice(part.indexOf('\n\n')+2);
  assert.equal(page.markdownArticle.content,body,number+': exact approved public body');
  assert.equal(page.markdownArticle.sha256,createHash('sha256').update(body).digest('hex'));
  const sections=body.split(/^## /m).slice(1);
  assert.equal(page.sections.length,sections.length);
  sections.forEach((section,i)=>{
   const line=section.indexOf('\n');
   assert.equal(page.sections[i].title,section.slice(0,line));
   assert.equal(page.sections[i].paragraphs.join('\n\n'),section.slice(line+1).trim());
  });
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page}));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(html.includes('href="/pricing"'));
  assert.ok(html.includes('href="#read"'));
  assert.ok(!/<form\b|href="[^\"]*(?:signup|apps.apple.com)|PRIVATE EDITORIAL APPENDIX/.test(html));
  for(const [,href] of body.matchAll(/\]\((https:\/\/[^)]+)\)/g))assert.ok(html.includes('href="'+href+'"'),href);
  if(body.includes('| --- |')){assert.ok(html.includes('scope="col"'));assert.ok(html.includes('tabindex="0"'));}
 }
 const newo=REVIEW_PAGES.find(p=>p.slug==='newo-ai-receptionist');
 assert.match(newo.source.reference,/no-competitor-prices/,'newo was superseded by the 2026-11-04 no-competitor-prices rewrite');
});
test('November 3 copy approval alone cannot authorize production',()=>{
 const slugs=parts.map(([, ,p])=>p.match(/^Proposed URL: \/ai-answering-service\/(.+)$/m)[1]);
 const pending=REVIEW_PAGES.map(p=>slugs.includes(p.slug)?{...p,review:{...p.review,releaseApproval:'pending'}}:p);
 assert.doesNotThrow(()=>assertReleaseReview(pending,'preview'));
 assert.throws(()=>assertReleaseReview(pending,'production'),/Owner approval of the exact PR/);
});
