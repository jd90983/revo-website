import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readPreferences,mountConsentForm} from '../js/sms-consent.js';
const html=readFileSync(new URL('../sms-consent.html',import.meta.url),'utf8');
test('two optional unchecked categories and existing policy links',()=>{
 const boxes=html.match(/<input type="checkbox"[^>]*>/g);
 assert.equal(boxes.length,2);
 boxes.forEach(box=>assert.doesNotMatch(box,/\b(checked|required)\b/));
 for(const page of ['privacy-policy','terms-of-service']) {
  assert.ok(html.includes(`href="/${page}"`));
  assert.ok(readFileSync(new URL(`../${page}.html`,import.meta.url),'utf8').includes('<main'));
 }
});
// The fake DOM and transport never submit to a real lead or SMS service.
function fixture(values={},valid=true){
 const result={textContent:'',focus(){this.focused=true;}};
 const button={disabled:false};let submit;
 const form={values,querySelector:s=>s==='#sms-result'?result:button,reportValidity:()=>valid,addEventListener:(_,fn)=>submit=fn};
 return {form,result,button,submit:()=>submit({preventDefault(){}})};
}
globalThis.FormData=class {constructor(form){this.values=form.values;}get(k){return this.values[k]??null;}};
for(const [transactional,marketing] of [[false,false],[true,false],[false,true],[true,true]]){
 test(`independent choices ${transactional}/${marketing}`,async()=>{
  const f=fixture({transactionalConsent:transactional?'on':null,marketingConsent:marketing?'on':null});let saved;
  mountConsentForm(f.form,async data=>{saved=data;return {saved:true,receiptId:'mock-only'};});
  await f.submit();assert.equal(saved.transactionalConsent,transactional);assert.equal(saved.marketingConsent,marketing);assert.match(f.result.textContent,/have been saved/);assert.equal(f.button.disabled,false);
 });
}
test('unavailable, rejected, or ambiguous transport never reports success',async()=>{
 for(const transport of [undefined,async()=>{throw Error('offline');},async()=>({success:true})]){
  const f=fixture();mountConsentForm(f.form,transport);await f.submit();assert.match(f.result.textContent,/have not been saved/);assert.equal(f.result.focused,true);
 }
});
test('invalid form does not call persistence',async()=>{
 const f=fixture({},false);let calls=0;mountConsentForm(f.form,async()=>calls++);await f.submit();assert.equal(calls,0);
});

test('inactive controls fail closed without JS and no ad trackers load',()=>{assert.match(html,/<fieldset id="sms-controls" disabled>/);assert.doesNotMatch(html,/googletagmanager|connect.facebook.net|analytics.tiktok.com/);});
