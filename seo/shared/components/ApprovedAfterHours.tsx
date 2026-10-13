"use client";
import {useRef} from "react";
import {clickAnalyticsPayload} from "@/lib/funnel-config";
import {clickRecorder, CONSENT_KEY} from "@/lib/funnel-navigation";
/* Approved illustrative design; only used on the after-hours public route. */
const approvedHtml=`<header class="nav">
<div class="wrap navinner">
<a href="/" rel="noopener">
<img class="logo" src="/images/revo-call-design/revo-logo.webp" alt="Revo">
</a>
<nav class="navlinks" aria-label="Main navigation">
<a href="/services.html">Services</a>
<a href="/industries.html">Industry</a>
<a href="/pricing.html">Pricing</a>
</nav>
<a class="btn light" href="/pricing.html" rel="noopener">Compare plans</a>
</div>
</header>
<main id="revo-main">
<section class="hero">
<div class="wrap">
<div class="breadcrumbs">Services &nbsp; / &nbsp; <span>After-hours answering</span>
</div>
<div class="hero-grid">
<div class="hero-copy">
<div class="eyebrow">Nights, weekends and holidays</div>
<h1>
<span class="orange">After-hours answering service</span> with a clear next step.</h1>
<p>Give callers a useful response when the office is closed. Revo captures their request using your script and rules, with expectations that match your service hours.</p>
<div class="actions">
<a class="btn" href="/pricing.html" rel="noopener">Compare plans</a>
<a class="textlink" href="#example">See the call flow</a>
</div>
<p class="hero-foot">Phone coverage does not establish technician availability.</p>
</div>
<div class="example flow" id="example">
<div class="sampletop">
<div>
<div class="tag">Illustrative workflow</div>
<div class="sampletitle">Office closed. Next step clear.</div>
</div>
<span class="call-symbol">☾</span>
</div>
<div class="flowstep">
<b>1</b>
<span>State the office hours</span>
</div>
<div class="connector">
</div>
<div class="flowstep">
<b>2</b>
<span>Collect the request + callback details</span>
</div>
<div class="connector">
</div>
<div class="branches">
<div class="branch">
<strong>Routine request</strong>
<span>Office review</span>
</div>
<div class="branch">
<strong>Caller reports urgency</strong>
<span>Approved escalation policy</span>
</div>
</div>
<div class="end">Explain the next step your team can support</div>
<p class="example-note">Illustrative workflow. Configure and test before use.</p>
</div>
</div>
</div>
</section>
<div class="signalbar">
<div class="wrap signals">
<span>Set the right expectation</span>
<span>Capture what matters</span>
<span>Follow your approved handoff</span>
</div>
</div>
<section class="section" id="read">
<div class="wrap">
<div class="section-top">
<div>
<div class="eyebrow">01 / Define the coverage</div>
<h2>Answer the call.<br>Be clear about the visit.</h2>
</div>
<p>These are three separate decisions. Confirm each with your team before forwarding calls.</p>
</div>
<div class="coverage">
<div>
<small>01 / Office hours</small>
<h3>When is the<br>office open?</h3>
<p>Say when your team reviews requests and returns calls.</p>
</div>
<div>
<small>02 / Field service</small>
<h3>When are technicians<br>available?</h3>
<p>Your business sets service availability. A visit is never assumed.</p>
</div>
<div>
<small>03 / Callback window</small>
<h3>What happens<br>next?</h3>
<p>Give the next step your team has approved, including any fallback.</p>
</div>
</div>
<p class="inline-note">A visit, response time or technician dispatch is never assumed.</p>
</div>
</section>
<section class="section editorial">
<div class="wrap">
<div class="section-top">
<div>
<div class="eyebrow">02 / Beyond the weekday</div>
<h2>Build a handoff<br>your team can maintain.</h2>
</div>
<p>Who owns follow-up, and what should the caller hear if that person is unavailable?</p>
</div>
<div class="wideflow">
<div>
<b>OVERNIGHT</b>
<h3>Office closed</h3>
<p>Use your closed-office greeting and approved callback expectation.</p>
</div>
<span>→</span>
<div>
<b>WEEKENDS</b>
<h3>Coverage changes</h3>
<p>Define who reviews routine requests and caller-reported urgency.</p>
</div>
<span>→</span>
<div>
<b>HOLIDAYS</b>
<h3>Plan the exception</h3>
<p>Review closures and the fallback before the schedule changes.</p>
</div>
</div>
<div class="boundary">
<strong>Choose the plan and handoff together.</strong>
<p>Review monthly minutes, whether team transfers are needed, and the fallback when nobody can answer. Confirm the supported setup before forwarding calls.</p>
</div>
</div>
</section>
<section class="section">
<div class="wrap faq-grid" id="faq">
<div>
<div class="eyebrow">03 / Before you choose</div>
<h2>What callers<br>should expect.</h2>
<p>Consistent information across your website, script and follow-up.</p>
</div>
<div class="faq">
<details open>
<summary>Does after-hours answering mean a technician is available?</summary>
<p>Your business sets field-service availability. The answering flow should communicate those limits clearly.</p>
</details>
<details >
<summary>What if the on-call contact cannot answer?</summary>
<p>Agree and test the fallback. Tell the caller the next step your team has approved rather than promising an immediate response.</p>
</details>
<details >
<summary>Is this the same as overflow answering?</summary>
<p>Overflow backs up an open office during busy periods. After-hours follows your closed-office policy.</p>
</details>
</div>
</div>
</section>
<section class="close" id="plans">
<span id="contact">
</span>
<div class="wrap">
<div class="close-inner">
<div>
<div class="eyebrow orange">Plan the next step</div>
<h2>Make the closed-office<br>experience clear.</h2>
<p>Compare plan features and the practical details of your after-hours handoff.</p>
</div>
<a class="btn" href="/pricing.html" rel="noopener">Compare plans</a>
</div>
<div class="related">
<span>Keep exploring</span>
<a href="/ai-answering-service/overflow-answering">Office-hours backup ↗</a>
<a href="/ai-answering-service/answering-service-cost">Budget and coverage ↗</a>
</div>
</div>
</section>
</main>
<footer class="footer">
<div class="wrap footer-inner">
<img class="logo" src="/images/revo-call-design/revo-logo.webp" alt="Revo">
<span>AI phone answering for home service businesses.</span>
<a href="/privacy-policy.html">Privacy</a>
<a href="/terms-of-service.html">Terms</a>
<button type="button" data-cookie-settings>Cookie settings</button>
</div>
</footer>
<div class="floating">
<a class="btn" href="/pricing.html" rel="noopener">Compare plans</a>
</div>`;
export function ApprovedAfterHours({availableSlugs}:{availableSlugs:string[]}){
 let html=approvedHtml;
 for(const slug of ["overflow-answering","answering-service-cost"]){if(!availableSlugs.includes(slug))html=html.replace("/ai-answering-service/"+slug,slug==="overflow-answering"?"/services.html":"/pricing.html");}

 const recorder=useRef(clickRecorder((event,payload)=>window.gtag?.(event,payload)));
 const handleClick=(event:React.MouseEvent<HTMLDivElement>)=>{
  const target=(event.target as Element).closest("a,button");
  if(target?.hasAttribute("data-cookie-settings")){window.dispatchEvent(new Event("revo-consent-open"));return;}
  if(target?.getAttribute("href")!=="/pricing.html")return;
  try{if(localStorage.getItem(CONSENT_KEY)!=="granted"||(navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl)return;}catch{return;}
  const placement=target.closest("header")?"after-hours-header":target.closest(".floating")?"after-hours-mobile":target.closest(".hero")?"after-hours-hero":"after-hours-footer";
  recorder.current(event.nativeEvent,placement,clickAnalyticsPayload(window.location.href,placement,"https://www.revoapp.ai/pricing.html"),Date.now());
 };
 return <><link rel="stylesheet" href="/css/revo-call-design.css"/><div className="revo-approved after" onClick={handleClick} dangerouslySetInnerHTML={{__html:html}}/></>;}
