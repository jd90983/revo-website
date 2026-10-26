import {publicUrl} from '../lib/public-url.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {REVIEW_PAGES} from '../lib/review-cohort.ts';
import {GuideTable} from '../components/GuideTable.tsx';
import {LandingPageTemplate} from '../components/LandingPageTemplate.tsx';
import {WorkflowGuideTemplate} from '../components/WorkflowGuideTemplate.tsx';
import {ApprovedAfterHours} from '../components/ApprovedAfterHours.tsx';
import {guideStructuredData} from '../lib/guide-structured-data.ts';
import {contentHash,registryErrors} from '../lib/registry-contract.mjs';
const page=slug=>REVIEW_PAGES.find(p=>p.slug===slug);

test('comparison tables are semantic, sourced, escaped and bound to the reviewed content',()=>{
 const p=page('compare/home-services-ai-receptionists');
 const html=renderToStaticMarkup(React.createElement(GuideTable,{table:p.overviewTable}));
 assert.equal((html.match(/scope="row"/g)||[]).length,7);
 assert.ok(html.includes('role="region"')&&html.includes('tabindex="0"')&&html.includes('<caption>'));
 assert.equal((html.match(/scope="col"/g)||[]).length,4);
 assert.equal(p.overviewTable.sources.length,7);
 assert.notEqual(contentHash(p),contentHash({...p,overviewTable:{...p.overviewTable,caption:'Changed'}}));
 const malformed={...p,overviewTable:{...p.overviewTable,rows:[['missing columns']]}};
 assert.ok(registryErrors([malformed]).some(e=>e.includes('complete text rows')));
 const unsafe={...p,overviewTable:{...p.overviewTable,sources:[{label:'Source',href:'javascript:alert(1)'}]}};
 assert.ok(registryErrors([unsafe]).some(e=>e.includes('HTTPS')));
 const escaped=renderToStaticMarkup(React.createElement(GuideTable,{table:{caption:'Example',columns:['Name','Value'],rows:[['A','<script>alert(1)</script>']]}}));
 assert.ok(escaped.includes('&lt;script&gt;'));assert.ok(!escaped.includes('<script>'));
});

test('dated guide FAQs in structured data are the same answers rendered without JS',()=>{
 for(const slug of ['cost-of-missed-calls','answering-service-cost','ruby-receptionist-pricing','compare/home-services-ai-receptionists','after-hours']){
  const p=page(slug),schema=guideStructuredData(p),web=schema['@graph'][0],faq=schema['@graph'][1];
  const template=slug==='after-hours'?ApprovedAfterHours:p.template==='workflow'?WorkflowGuideTemplate:LandingPageTemplate;
  const html=renderToStaticMarkup(React.createElement(template,slug==='after-hours'?{availableSlugs:REVIEW_PAGES.filter(p=>p.publicationStatus==='approved').map(p=>p.slug)}:{page:p,mode:'public',acquisitionEnabled:false}));
  assert.equal(web.dateModified,'2026-10-21');assert.ok(html.includes('2026-10-21'));
  assert.deepEqual(faq.mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),p.faqs.map(f=>[f.q,f.a]));
  for(const f of p.faqs){const escape=t=>renderToStaticMarkup(React.createElement('p',null,t)).slice(3,-4);assert.ok(html.includes(escape(f.q)),slug+' question');assert.ok(html.includes(escape(f.a)),slug+' answer');}
  assert.ok(!JSON.stringify(schema).includes('aggregateRating'));
 }
 assert.ok(!guideStructuredData(page('missed-calls'))['@graph'],'unchanged guides retain their existing metadata');
});

test('content dates cannot be invalid calendar dates',()=>{
 for(const date of ['2026-02-30','2026-99-01','today']) assert.ok(registryErrors([{...page('missed-calls'),editorialDate:date}]).some(e=>e.includes('editorialDate')));
});

test('cost scenarios identify assumptions and keep gross value separate from results',()=>{
 const p=page('cost-of-missed-calls');assert.equal(10*0.30*500,1500);assert.ok(p.intro.includes('$1,500'));assert.ok(p.intro.includes('not measured losses or Revo results'));
 assert.ok(p.calculator);assert.equal(p.pricingVariant,'worksheet');
 const comparison=page('compare/home-services-ai-receptionists');
 assert.deepEqual(comparison.overviewTable.rows.map(r=>r[0]),['Avoca','Goodcall','Revo','Sameday','Smith.ai','Ruby','Rosie']);
 assert.ok(comparison.overviewTable.rows.find(r=>r[0]==='Revo')[2].includes('require Crew/Fleet'));
 assert.ok(comparison.overviewTable.rows.find(r=>r[0]==='Rosie')[2].includes('direct booking/transfers on Scale'));
});

test('crawl configuration resolves the duplicate without blocking fragment retrieval',()=>{
 const config=JSON.parse(readFileSync(new URL('../../../vercel.json',import.meta.url),'utf8'));
 assert.ok(config.redirects.some(r=>r.source==='/index.html'&&r.destination==='https://www.revoapp.ai/'&&r.permanent===true));
 for(const path of ['/templates/:path*','/thank-you.html'])assert.ok(config.headers.some(r=>r.source===path&&r.headers.some(h=>h.key==='X-Robots-Tag'&&h.value==='noindex')));
});

test('provider comparisons keep existing intent owners and distinguish billing units',()=>{
 for(const slug of ['compare/revo-vs-sameday','compare/revo-vs-avoca','compare/revo-vs-smith-ai']){
  const p=page(slug);assert.equal(p.publicationStatus,'approved');
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page:p,mode:'public',acquisitionEnabled:false}));
  assert.equal(p.overviewTable.rows.length,5);assert.ok(html.includes('<caption>'));
  for(const s of p.overviewTable.sources)assert.ok(html.includes(publicUrl(s.href)));
  const schema=guideStructuredData(p);assert.equal(schema['@graph'][0].dateModified,p.editorialDate);
  assert.deepEqual(schema['@graph'][1].mainEntity.map(q=>q.name),p.faqs.map(f=>f.q));
 }
 const smith=JSON.stringify(page('compare/revo-vs-smith-ai').overviewTable);
 assert.ok(smith.includes('minutes')&&smith.includes('calls')&&smith.includes('$2.50')&&smith.includes('$2.17'));
 const avoca=page('compare/revo-vs-avoca').overviewTable.rows;
 assert.ok(avoca.every(r=>!r[2].includes('$')),'unknown competitor quote must not become an invented price');
 for(const slug of ['ruby-receptionist-pricing','goodcall-pricing','rosie-ai-pricing'])assert.equal(page(slug).publicationStatus,'approved');
 for(const slug of ['compare/revo-vs-ruby','compare/revo-vs-goodcall','compare/revo-vs-rosie'])assert.equal(page(slug),undefined,'do not duplicate an existing buying-intent owner');
});

test('articles without supplied FAQs do not publish an empty FAQ claim',()=>{
 for(const p of REVIEW_PAGES.filter(p=>p.markdownArticle)){
  assert.equal(p.faqs.length,0);const schema=guideStructuredData(p);
  assert.equal(schema['@type'],'WebPage');assert.ok(!JSON.stringify(schema).includes('FAQPage'));
  assert.equal(schema.url,'https://www.revoapp.ai/ai-answering-service/'+p.slug);
 }
});
