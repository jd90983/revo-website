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
  <script>document.documentElement.className += ' js';</script>
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
  <link rel="stylesheet" href="/css/app-flow.css">
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

const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg>'
};

// Only the locksmith has its own illustration (the one /free-test uses); other trades get an icon tile.
const ART = { locksmith: 'https://revo-funnel-a3-vercel.vercel.app/images/locksmith_man.svg' };

const rail = (withBrand) => `
  <header class="af-rail"><div class="af-col">
    <div class="af-navrow af-brand-row">${withBrand ? `<div class="af-brand"><img src="/images/revo_logo_dark.png" alt="Revo" width="44" height="13"><span class="af-tagline">AI receptionist for home services</span></div>` : ''}</div>
    <div class="af-navrow af-progress-row"><button class="af-back" type="button" aria-label="Back" data-back>${ICON.back}</button><div class="af-track" aria-hidden="true"><div class="af-fill"></div></div></div>
  </div></header>`;

const footer = `
  <footer class="af-footer"><div class="af-col">
    <a href="/terms-of-service">Terms</a><a href="/privacy-policy">Privacy</a><a href="/sms-consent">SMS consent</a>
  </div></footer>`;

const gtmNoscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFJBFLVF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

export function landing(t) {
  const title = `Revo for ${t.plural}: Answer Every Call | 10 Free Calls`;
  const description = `Revo answers every call for your ${t.word} business, 24/7, books the job and texts the caller back. 10 free calls, no credit card.`;
  const art = ART[t.slug]
    ? `<img src="${ART[t.slug]}" alt="" width="104" height="104" decoding="async">`
    : `<div class="af-art-tile">${ICON.phone}</div>`;
  return `${head(title, description, '/' + t.slug)}
<body data-trade="${t.slug}">
${gtmNoscript}
<div class="af-shell">${rail(true)}
  <main class="af-main"><div class="af-col af-main">

    <section class="af-step af-step-center" data-step="0">
      <div class="af-hero">
        <div class="af-hero-copy">
          <h1 class="af-q">Missed calls are jobs for the next ${esc(t.noun)}.</h1>
          <p class="af-lede">Revo answers every call for your ${esc(t.word)} business, 24/7, books the job and texts the caller back.</p>
        </div>
        <div class="af-art">${art}</div>
      </div>
      <a class="af-cta" href="/start?trade=${t.slug}" data-app-cta="hero">Create my free account</a>
      <p class="af-fine">10 free calls. No credit card.</p>
      <button class="af-link" type="button" data-next>How Revo works &rsaquo;</button>
    </section>

    <section class="af-step af-step-dock" data-step="1" hidden>
      <h2 class="af-q">Revo answers, books and follows up. <em>Every call.</em></h2>
      <p class="af-lede">Built for ${esc(t.word)} calls.</p>
      <ul class="af-cards">
        <li class="af-card"><span class="af-ico">${ICON.phone}</span><div><b>Revo answers.</b><span>Any hour: nights, weekends and while you’re on a job.</span></div></li>
        <li class="af-card"><span class="af-ico">${ICON.calendar}</span><div><b>Revo books.</b><span>Appointments go on your calendar.</span></div></li>
        <li class="af-card"><span class="af-ico">${ICON.check}</span><div><b>Revo follows up.</b><span>Texts the caller after the call and shows you a summary.</span></div></li>
      </ul>
      <button class="af-link af-link-left" type="button" data-example-toggle aria-expanded="false" aria-controls="af-example">&#9654; See an example call</button>
      <div class="af-example" id="af-example" hidden>
        <p class="af-example-label">Example scenario</p>
        <p><b>Caller:</b> Hi, ${esc(t.issue)}. Can someone come out?</p>
        <p><b>Revo:</b> I can help with that. What’s the address, and when works for you?</p>
        <p><b>Caller:</b> Tomorrow morning.</p>
        <p><b>Revo:</b> You’re booked for tomorrow at 9 AM. I’ll text you the details now.</p>
        <p class="af-example-note">Acted example, not a real customer call. Details are illustrative.</p>
      </div>
      <div class="af-callout"><b>Set up for your business.</b><span>You set the greeting, your hours and your rules.</span></div>
      <div class="af-stats">
        <div class="af-stat"><span class="af-big">24/7</span><small>call answering</small></div>
        <div class="af-stat"><span class="af-big">10</span><small>free calls</small></div>
        <div class="af-stat"><span class="af-big">$0</span><small>due today</small></div>
      </div>
      <div class="af-faq">
        <details><summary>Do I need a credit card?</summary><p>No. Your first 10 calls are free. You add a card only if you keep Revo.</p></details>
        <details><summary>What happens after my 10 free calls?</summary><p>Solo is $87.50 USD/mo for your first 3 months, then $175 USD/mo. Cancel anytime.</p></details>
      </div>
      <div class="af-dock">
        <a class="af-cta" href="/start?trade=${t.slug}" data-app-cta="footer">Create my free account</a>
        <p class="af-fine">No credit card. Free trial: 10 calls. Prices in USD.</p>
      </div>
    </section>

  </div></main>
${footer}
</div>
  <script src="/js/app-flow.js" defer></script>
</body>
</html>
`;
}

export function start() {
  const options = TRADES.map(t => `<option value="${t.slug}">${esc(t.label)}</option>`).join('') + '<option value="other">Other</option>';
  return `${head('Create your Revo account | 10 Free Calls', 'Tell us about your business, then create your login and pick your Revo number. 10 free calls, no credit card.', '/start')}
<body class="af-on-step" data-progress="66">
${gtmNoscript}
<div class="af-shell">${rail(false)}
  <main class="af-main"><div class="af-col af-main">
    <form class="af-step af-step-dock" id="app-start-form" novalidate>
      <span class="af-qico" aria-hidden="true">${ICON.store}</span>
      <h1 class="af-q">Tell us about your business</h1>
      <p class="af-lede">10 free calls. No credit card. Next, you’ll create your login and pick your Revo number.</p>
      <div class="af-field"><label for="af-email">Business email</label><input id="af-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="254"></div>
      <div class="af-field"><label for="af-business">Business name</label><input id="af-business" name="business_name" type="text" autocomplete="organization" required maxlength="120"></div>
      <div class="af-field"><label for="af-trade">What’s your trade?</label><select id="af-trade" name="trade" required><option value="">Select your trade</option>${options}</select></div>
      <div class="af-field"><label for="af-zip">Business ZIP code</label><input id="af-zip" name="zip" type="text" autocomplete="postal-code" inputmode="numeric" required maxlength="10"></div>
      <div class="af-field"><label for="af-phone">Mobile phone</label><input id="af-phone" name="phone" type="tel" autocomplete="tel-national" inputmode="tel" required maxlength="20"><p class="af-help">We’ll use it to reach you about your account.</p></div>
      <div class="af-hp" aria-hidden="true"><label for="af-website">Website</label><input id="af-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <div class="af-dock">
        <p id="app-start-status" class="af-status" role="status" aria-live="polite"></p>
        <button class="af-cta" type="submit">Continue</button>
        <p class="af-terms">By continuing, you agree to the <a href="/terms-of-service">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>
      </div>
    </form>
  </div></main>
${footer}
</div>
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
