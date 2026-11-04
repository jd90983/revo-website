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

test('comparison tables are semantic, sourced and escaped',()=>{
 const table={caption:'Example',columns:['Option','Billing unit','Booking','Source'],rows:[['A','Minutes','Yes','Docs'],['B','Calls','No','Docs']],sources:[{label:'Docs',href:'https://www.revoapp.ai/pricing'}]};
 const html=renderToStaticMarkup(React.createElement(GuideTable,{table}));
 assert.equal((html.match(/scope="row"/g)||[]).length,2);
 assert.ok(html.includes('role="region"')&&html.includes('tabindex="0"')&&html.includes('<caption>'));
 assert.equal((html.match(/scope="col"/g)||[]).length,4);
 const p=page('missed-calls');
 const malformed={...p,overviewTable:{...table,rows:[['missing columns']]}};
 assert.ok(registryErrors([malformed]).some(e=>e.includes('complete text rows')));
 const unsafe={...p,overviewTable:{...table,sources:[{label:'Source',href:'javascript:alert(1)'}]}};
 assert.ok(registryErrors([unsafe]).some(e=>e.includes('HTTPS')));
 const escaped=renderToStaticMarkup(React.createElement(GuideTable,{table:{caption:'Example',columns:['Name','Value'],rows:[['A','<script>alert(1)</script>']]}}));
 assert.ok(escaped.includes('&lt;script&gt;'));assert.ok(!escaped.includes('<script>'));
});

test('dated guide FAQs in structured data are the same answers rendered without JS',()=>{
 for(const slug of ['cost-of-missed-calls','after-hours']){
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
 assert.equal(page('compare/home-services-ai-receptionists').overviewTable,undefined,'competitor price tables were removed (owner decision 2026-11-04)');
});

test('crawl configuration resolves the duplicate without blocking fragment retrieval',()=>{
 const config=JSON.parse(readFileSync(new URL('../../../vercel.json',import.meta.url),'utf8'));
 assert.ok(config.redirects.some(r=>r.source==='/index.html'&&r.destination==='https://www.revoapp.ai/'&&r.permanent===true));
 for(const path of ['/templates/:path*','/thank-you.html'])assert.ok(config.headers.some(r=>r.source===path&&r.headers.some(h=>h.key==='X-Robots-Tag'&&h.value==='noindex')));
});

test('provider comparisons keep existing intent owners and distinguish billing units',()=>{
 for(const slug of ['compare/revo-vs-avoca']){
  const p=page(slug);assert.equal(p.publicationStatus,'approved');
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page:p,mode:'public',acquisitionEnabled:false}));
  assert.equal(p.overviewTable.rows.length,5);assert.ok(html.includes('<caption>'));
  for(const s of p.overviewTable.sources)assert.ok(html.includes(publicUrl(s.href)));
  const schema=guideStructuredData(p);assert.equal(schema['@graph'][0].dateModified,p.editorialDate);
  assert.deepEqual(schema['@graph'][1].mainEntity.map(q=>q.name),p.faqs.map(f=>f.q));
 }
 for(const s of ['compare/revo-vs-sameday'])assert.ok(!/\$\d/.test(page(s).markdownArticle.content.replace(/\$(87\.50|175|350|700)\b/g,'')),s);
 assert.ok(!/\$\d/.test(page('compare/revo-vs-smith-ai').markdownArticle.content.replace(/\$(87\.50|175|350|700)\b/g,'')),'no competitor prices');
 const avoca=page('compare/revo-vs-avoca').overviewTable.rows;
 assert.ok(avoca.every(r=>!r[2].includes('$')),'unknown competitor quote must not become an invented price');
 for(const slug of ['ruby-receptionist-pricing','goodcall-pricing','rosie-ai-pricing'])assert.equal(page(slug).publicationStatus,'approved');
 for(const slug of ['compare/revo-vs-ruby','compare/revo-vs-goodcall','compare/revo-vs-rosie'])assert.equal(page(slug),undefined,'do not duplicate an existing buying-intent owner');
});

test('articles without supplied FAQs do not publish an empty FAQ claim',()=>{
 for(const p of REVIEW_PAGES.filter(p=>p.markdownArticle && p.faqs.length===0)){
  assert.equal(p.faqs.length,0);const schema=guideStructuredData(p);
  assert.equal(schema['@type'],'WebPage');assert.ok(!JSON.stringify(schema).includes('FAQPage'));
  assert.equal(schema.url,'https://www.revoapp.ai/ai-answering-service/'+p.slug);
 }
});
