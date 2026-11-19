// Generates the no-card app signup flow pages: one landing per trade + start.html.
// Run: node scripts/build-app-flow-pages.mjs   (writes <trade>.html and start.html at the repo root)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const TRADES = [
  { slug: 'hvac', label: 'HVAC', word: 'HVAC', noun: 'HVAC company', plural: 'HVAC Companies', issue: 'my AC stopped cooling' },
  { slug: 'plumbing', label: 'Plumbing', word: 'plumbing', noun: 'plumber', plural: 'Plumbers', issue: 'there’s a leak under my kitchen sink' },
  { slug: 'locksmith', label: 'Locksmith', word: 'locksmith', noun: 'locksmith', plural: 'Locksmiths', issue: 'I’m locked out of my house' },
  { slug: 'electrical', label: 'Electrical', word: 'electrical', noun: 'electrician', plural: 'Electricians', issue: 'half the outlets in my kitchen stopped working' },
  { slug: 'pressure-washing', label: 'Pressure washing', word: 'pressure washing', noun: 'pressure washing company', plural: 'Pressure Washing Companies', issue: 'I need a quote to clean my driveway' },
  { slug: 'painting', label: 'Painting', word: 'painting', noun: 'painter', plural: 'Painters', issue: 'I need a quote to paint two bedrooms' },
  { slug: 'garage-door', label: 'Garage door', word: 'garage door', noun: 'garage door company', plural: 'Garage Door Companies', issue: 'my garage door won’t open' },
  { slug: 'pest-control', label: 'Pest control', word: 'pest control', noun: 'pest control company', plural: 'Pest Control Companies', issue: 'there are ants all over my kitchen' },
  { slug: 'roofing', label: 'Roofing', word: 'roofing', noun: 'roofer', plural: 'Roofers', issue: 'my roof started leaking after the rain' }
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Same deferred GTM + Meta loader as aloa.html (PageSpeed mobile 97 on Nov 11, 2026).
const head = (title, description, path) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google Tag Manager, Meta Pixel: events queue at once; the tag scripts
     load on the first tap, scroll or key press, or 3.5 s after the page loads. -->
<script>
(function (w, d) {
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var loaded = false;
  function add(src) {
    var j = d.createElement('script'); j.async = true; j.src = src;
    d.head.appendChild(j);
  }
  function loadTags() {
    if (loaded) return;
    loaded = true;
    add('https://www.googletagmanager.com/gtm.js?id=GTM-PFJBFLVF');
    add('https://connect.facebook.net/en_US/fbevents.js');
  }
  ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(function (e) {
    w.addEventListener(e, loadTags, { once: true, passive: true });
  });
  w.addEventListener('load', function () { setTimeout(loadTags, 3500); });
  w.revoLoadTags = loadTags;
})(window, document);
</script>
<!-- End Google Tag Manager -->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/css/app-flow.css">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"></noscript>
<!-- Meta Pixel Code (stub; fbevents.js is loaded by revoLoadTags above) -->
<script>
!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window);
fbq('init', '2435811520564771');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
</head>`;

const header = `
  <header class="af-header"><div class="af-wrap"><img src="/images/logo.webp" alt="Revo" width="82" height="21"></div></header>`;

const footer = `
  <footer class="af-footer"><div class="af-wrap">
    <a href="/terms-of-service">Terms</a><a href="/privacy-policy">Privacy</a><a href="/sms-consent">SMS consent</a>
  </div></footer>`;

const gtmNoscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFJBFLVF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

export function landing(t) {
  const title = `Revo for ${t.plural}: Answer Every Call | 10 Free Calls`;
  const description = `Revo answers every call for your ${t.word} business, 24/7, books the job and texts the caller back. 10 free calls, no credit card.`;
  return `${head(title, description, '/' + t.slug)}
<body data-trade="${t.slug}">
${gtmNoscript}${header}
  <main>
    <section class="af-hero"><div class="af-wrap">
      <h1>Missed calls are jobs for the next ${esc(t.noun)}.</h1>
      <p class="af-lead">Revo answers every call for your ${esc(t.word)} business, 24/7, books the job and texts the caller back.</p>
      <a class="af-cta" href="/start?trade=${t.slug}" data-app-cta="hero">Create my account</a>
      <p class="af-under">10 free calls. No credit card.</p>
    </div></section>

    <section class="af-section"><div class="af-wrap">
      <h2>How it works</h2>
      <ol class="af-steps">
        <li>Tell us about your business.</li>
        <li>Create your login and pick a local number.</li>
        <li>Call it and hear Revo answer.</li>
      </ol>
    </div></section>

    <section class="af-section"><div class="af-wrap">
      <h2>What Revo does on every call</h2>
      <ul class="af-does">
        <li>Answers 24/7, including nights and weekends</li>
        <li>Books appointments on your calendar</li>
        <li>Texts the caller after the call</li>
        <li>Shows a summary of every call</li>
      </ul>
    </div></section>

    <section class="af-section"><div class="af-wrap">
      <h2>Example scenario</h2>
      <div class="af-example">
        <p class="af-example-label">Example scenario</p>
        <p><b>Caller:</b> Hi, ${esc(t.issue)}. Can someone come out?</p>
        <p><b>Revo:</b> I can help with that. What’s the address, and when works for you?</p>
        <p><b>Caller:</b> Tomorrow morning.</p>
        <p><b>Revo:</b> You’re booked for tomorrow at 9 AM. I’ll text you the details now.</p>
        <p class="af-example-note">Acted example, not a real customer call. Details are illustrative.</p>
      </div>
    </div></section>

    <section class="af-section af-faq"><div class="af-wrap">
      <h2>Questions</h2>
      <details><summary>Do I need a credit card?</summary><p>No. Your first 10 calls are free. You add a card only if you keep Revo.</p></details>
      <details><summary>Will it sound like my business?</summary><p>Yes. You set the greeting, your hours and your rules.</p></details>
      <details><summary>What happens after my 10 free calls?</summary><p>Solo is $87.50 USD/mo for your first 3 months, then $175 USD/mo. Cancel anytime.</p></details>
    </div></section>

    <section class="af-final"><div class="af-wrap">
      <a class="af-cta" href="/start?trade=${t.slug}" data-app-cta="footer">Create my account</a>
      <p class="af-fine">Free trial: 10 calls. Prices in USD.</p>
    </div></section>
  </main>
${footer}
  <script src="/js/app-flow.js" defer></script>
</body>
</html>
`;
}

export function start() {
  const options = TRADES.map(t => `<option value="${t.slug}">${esc(t.label)}</option>`).join('') + '<option value="other">Other</option>';
  return `${head('Create your Revo account | 10 Free Calls', 'Tell us about your business, then create your login and pick your Revo number. 10 free calls, no credit card.', '/start')}
<body>
${gtmNoscript}${header}
  <main class="af-start"><div class="af-wrap"><div class="af-card">
    <p class="af-progress">Step 1 of 2</p>
    <h1>Tell us about your business</h1>
    <p class="af-sub">10 free calls. No credit card.</p>
    <form id="app-start-form" novalidate>
      <div class="af-field"><label for="af-email">Business email</label><input id="af-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="254"></div>
      <div class="af-field"><label for="af-business">Business name</label><input id="af-business" name="business_name" type="text" autocomplete="organization" required maxlength="120"></div>
      <div class="af-field"><label for="af-trade">What’s your trade?</label><select id="af-trade" name="trade" required><option value="">Select your trade</option>${options}</select></div>
      <div class="af-field"><label for="af-zip">Business ZIP code</label><input id="af-zip" name="zip" type="text" autocomplete="postal-code" inputmode="numeric" required maxlength="10"></div>
      <div class="af-field"><label for="af-phone">Mobile phone</label><input id="af-phone" name="phone" type="tel" autocomplete="tel-national" inputmode="tel" required maxlength="20"><p class="af-help">We’ll use it to reach you about your account.</p></div>
      <div class="af-hp" aria-hidden="true"><label for="af-website">Website</label><input id="af-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <button class="af-cta" type="submit">Continue</button>
      <p id="app-start-status" class="af-status" role="status" aria-live="polite"></p>
      <p class="af-next">Next: create your login and pick your Revo number.</p>
      <p class="af-terms">By continuing, you agree to the <a href="/terms-of-service">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>
    </form>
  </div></div></main>
${footer}
  <script src="/js/app-flow.js" defer></script>
</body>
</html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const t of TRADES) writeFileSync(join(root, t.slug + '.html'), landing(t));
  writeFileSync(join(root, 'start.html'), start());
  console.log('Wrote', TRADES.length, 'trade landings + start.html');
}
