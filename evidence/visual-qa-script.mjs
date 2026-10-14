import {chromium} from '/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const out='/Users/mac/Documents/Codex/2026-10-14/task/revo-website/evidence/visual-qa';mkdirSync(out,{recursive:true});
const pages=JSON.parse(readFileSync('/Users/mac/Documents/Codex/2026-10-14/task/revo-website/evidence/selection-20.json'));
const browser=await chromium.launch({headless:true,executablePath:'/Users/mac/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell'});const results=[];
for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
 const context=await browser.newContext({viewport});
 // Preview is GET-only and loopback-only; block outbound telemetry and external fetches.
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'&&route.request().method()==='GET'?route.continue():route.abort());
 const page=await context.newPage();
 for(const entry of pages){
  const errors=[];page.removeAllListeners('pageerror');page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto('http://127.0.0.1:8765'+entry.new_url,{waitUntil:'networkidle'});
  if(await page.getByRole('button',{name:'Decline',exact:true}).isVisible())await page.getByRole('button',{name:'Decline',exact:true}).click();
  await page.getByRole('button',{name:'Cookie settings',exact:true}).click();
  const consentReopened=await page.getByRole('button',{name:'Decline',exact:true}).isVisible();
  if(consentReopened)await page.getByRole('button',{name:'Decline',exact:true}).click();
  const check=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,forms:document.querySelectorAll('form').length,overflow:document.documentElement.scrollWidth>innerWidth,canonical:document.querySelector('link[rel="canonical"]')?.href,bodyFont:getComputedStyle(document.querySelector('.workflow-guide')).fontFamily}));
  await page.locator('details').first().locator('summary').click();const faq=await page.locator('details').first().getAttribute('open');
  results.push({path:entry.new_url,width:viewport.width,status:response.status(),...check,faqOpened:faq!==null,consentReopened,errors});
  if(['pricing-models','calendar-booking-checklist','plumbing-on-call-policy'].some(s=>entry.new_url.endsWith('/'+s)))await page.screenshot({path:out+'/'+entry.new_url.split('/').at(-1)+'-'+viewport.width+'.png',fullPage:true});
 }
 await page.goto('http://127.0.0.1:8765/ai-answering-service/after-hours',{waitUntil:'networkidle'});await page.screenshot({path:out+'/current-after-hours-'+viewport.width+'.png',fullPage:true});
 await context.close();
}
writeFileSync(out+'/results.json',JSON.stringify(results,null,2));
await browser.close();const failures=results.filter(r=>r.status!==200||r.h1!==1||r.main!==1||r.forms!==0||r.overflow||!r.faqOpened||!r.consentReopened||r.errors.length||r.canonical!=='https://www.revoapp.ai'+r.path);console.log(JSON.stringify({tested:results.length,failures},null,2));if(failures.length)process.exitCode=1;
