import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {REVIEW_PAGES} from '../lib/review-cohort.ts';
import {WorkflowGuideTemplate} from '../components/WorkflowGuideTemplate.tsx';
import {assertReleaseReview} from '../lib/release-review.mjs';
const read=path=>readFileSync(new URL('../../../'+path,import.meta.url),'utf8');
const selected=['zanus-ai-receptionist','broccoli-ai-pricing','rosie-ai-pricing'];
test('automated snippet review cannot become a production release approval',()=>{
 assert.doesNotThrow(()=>assertReleaseReview(REVIEW_PAGES,'preview'));
 assert.throws(()=>assertReleaseReview(REVIEW_PAGES,'production'),/Owner approval of the exact PR/);
 assert.doesNotThrow(()=>assertReleaseReview(REVIEW_PAGES.filter(p=>!selected.includes(p.slug)),'production'));
});
test('only the three selected guides switch to a demo hero; new guides retain the exact reviewed CTAs',()=>{
 for(const p of REVIEW_PAGES.filter(p=>p.template==='workflow')){
  const html=renderToStaticMarkup(React.createElement(WorkflowGuideTemplate,{page:p}));
  assert.equal(html.includes('data-seo-demo-cta="hero"'),selected.includes(p.slug),p.slug);
  if(selected.includes(p.slug))assert.ok(html.includes('href="/ai-receptionist-demo#book-demo"'));
  if(p.reviewedCtas){assert.ok(html.includes(p.reviewedCtas.primary.label));assert.ok(html.includes('href="/hear-a-sample-call"'));}
 }
});
test('the two static pages retain their canonicals and expose the same tracked demo destination',()=>{
 for(const path of ['pricing','industry_small_business']){
  const html=read(path+'.html');
  assert.equal((html.match(/data-seo-demo-cta="hero"/g)||[]).length,1);
  assert.ok(html.includes('href="/ai-receptionist-demo#book-demo" data-seo-demo-cta="hero"'));
  assert.ok(html.includes('rel="canonical" href="https://www.revoapp.ai/'+path+'"'));
  assert.equal((html.match(/src="\/js\/seo-demo-cta.js"/g)||[]).length,1);
  const description=html.match(/<meta name="description" content="([^"]+)"/)[1];
  for(const name of ['og:description','twitter:description'])assert.ok(html.includes('property="'+name+'" content="'+description+'"'));
 }
});
test('approved v0 copy, titles, descriptions and article paragraphs are retained',()=>{
 const source=read('evidence/2026-11-02/approved-copy-v0.txt');
 assert.equal(createHash('sha256').update(source).digest('hex'),'951e1127e8c0fa0c4b3d8900c7e104bf0d018032e306207d2f850ee68937962d');
 for(const part of source.split('TITLE / H1\n').slice(1)){
  const title=part.split('\n')[0],slug=part.split('PROPOSED URL\n')[1].split('\n')[0].split('/').at(-1),p=REVIEW_PAGES.find(x=>x.slug===slug);
  assert.equal(p.title,title);assert.equal(p.description,part.split('META DESCRIPTION\n')[1].split('\n')[0]);
  const blocks=part.split('EXACT PAGE COPY\n\n')[1].split('\nPRIMARY CTA')[0].trim().split('\n\n');
  const text=p.markdownArticle.content;
  for(const block of blocks){
   if(block.startsWith('Plan       Monthly base')){for(const cell of block.split(/\s{2,}|\n/))assert.ok(text.includes(cell),cell);}
   else assert.ok(text.includes(block),slug+': '+block.slice(0,50));
  }
  assert.equal(p.reviewedCtas.primary.label,part.split('PRIMARY CTA\n')[1].split('\n')[0]);
  assert.equal(p.reviewedCtas.secondary.label,part.split('SECONDARY CTA\n')[1].split('\n')[0]);
 }
});
const script=read('js/seo-demo-cta.js');
function run({path='/pricing',consent='granted',gpc=false,storageError=false,href='/ai-receptionist-demo#book-demo'}={}){
 const sent=[];let click;
 const context={location:{pathname:path,origin:'https://www.revoapp.ai',search:'?utm_source=original&email=private'},navigator:{globalPrivacyControl:gpc},localStorage:{getItem(){if(storageError)throw Error('blocked');return consent;}},document:{addEventListener(name,fn){click=fn;}},window:{gtag(...a){sent.push(a);}},Date};
 vm.runInNewContext(script,context);
 const event={target:{closest(){return {getAttribute(){return href;}};}}};
 return {sent,click:()=>click?.(event)};
}
test('demo clicks require consent, are deduplicated, and never replace campaigns or represent leads',()=>{
 const a=run();a.click();a.click();assert.equal(a.sent.length,1);assert.equal(a.sent[0][1],'seo_cta_click');
 assert.deepEqual(JSON.parse(JSON.stringify(a.sent[0][2])),{page_path:'/pricing',cta_location:'hero',destination:'/ai-receptionist-demo#book-demo',page_location:'https://www.revoapp.ai/pricing',page_referrer:''});
 for(const options of [{consent:'denied'},{consent:null},{gpc:true},{storageError:true},{path:'/services'},{href:'/free-trial'}]){const a=run(options);a.click();assert.equal(a.sent.length,0);}
 assert.ok(!/setItem|generate_lead|trial_started|utm_/.test(script));
});
test('sitemap additions exclude the five noindex destinations and unresolved industry overlaps',()=>{
 const sitemap=read('sitemap.xml');
 for(const path of ['ai-receptionist-demo','download','download-copy','revo-landing-page-campaign-1','thank-you','industry_construction','industry_building_construction_trades','industry_general_contracting','industry_franchises','industry_marketing_media_advertising','industry_real_estate_property_management'])assert.ok(!sitemap.includes('<loc>https://www.revoapp.ai/'+path+'</loc>'));
 for(const path of ['industry_tilling','industry_alarm_security','industry_window_cleaning'])assert.ok(sitemap.includes('<loc>https://www.revoapp.ai/'+path+'</loc>'));
 const tile=read('industry_tilling.html');assert.ok(tile.includes('Tiling'));assert.ok(!tile.includes('Tilling'));assert.ok(!tile.includes('home-service-testimonial-quote'));assert.ok(!tile.includes('data-target='));
 assert.equal(JSON.parse(read('seo/app/site.config.json')).acquisitionEnabled,false);
});
