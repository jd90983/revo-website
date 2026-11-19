/* No-card app signup flow: trade landings (/hvac, /locksmith, ...) and /start.
   - Keeps the first-touch attribution (UTMs, fbclid, gclid, landing page).
   - Carries it, plus the trade, on every "Create my account" link.
   - On /start, sends the form to /api/app-start, fires signup_started once,
     then opens web.revoapp.ai with the query before the #. */
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var STORE = 'revo_app_attr_v1';

  function safe(v) {
    return typeof v === 'string' && v.length > 0 && v.length <= 256 &&
      !/[@#\r\n\u0000-\u001f]|:\/\/|\d{7,}/.test(v);
  }
  function safeId(v) { return typeof v === 'string' && /^[A-Za-z0-9_-]{1,256}$/.test(v); }

  function read() {
    try { return JSON.parse(window.localStorage.getItem(STORE) || 'null'); } catch (e) { return null; }
  }
  function write(obj) {
    try { window.localStorage.setItem(STORE, JSON.stringify(obj)); } catch (e) { /* storage blocked: URL still carries it */ }
  }

  function fromUrl() {
    var params = new URLSearchParams(window.location.search);
    var out = {};
    KEYS.forEach(function (k) {
      var all = params.getAll(k);
      if (all.length !== 1) return;
      var ok = (k === 'gclid' || k === 'fbclid') ? safeId(all[0]) : safe(all[0]);
      if (ok) out[k] = all[0];
    });
    var lp = params.get('lp');
    if (lp && /^\/[a-z0-9\-\/]{0,80}$/.test(lp)) out.lp = lp;
    return out;
  }

  // First touch wins for 30 days: a later visit never replaces it inside that window.
  function attribution() {
    var stored = read();
    var age = stored && stored.first_touch_at ? Date.now() - Date.parse(stored.first_touch_at) : Infinity;
    if (age >= 0 && age < 30 * 864e5) return stored;
    var now = fromUrl();
    if (!now.lp) now.lp = window.location.pathname;
    now.first_touch_at = new Date().toISOString();
    write(now);
    return now;
  }

  function track(name, params) {
    var payload = { event: name };
    for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k];
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(payload); } catch (e) { /* never block */ }
  }

  var attr = attribution();
  var trade = (document.body && document.body.getAttribute('data-trade')) || '';

  // Landing pages: every CTA goes to /start with the trade and the attribution.
  Array.prototype.forEach.call(document.querySelectorAll('[data-app-cta]'), function (link) {
    var url = new URL('/start', window.location.origin);
    if (trade) url.searchParams.set('trade', trade);
    KEYS.forEach(function (k) { if (attr[k]) url.searchParams.set(k, attr[k]); });
    if (attr.lp) url.searchParams.set('lp', attr.lp);
    link.setAttribute('href', url.pathname + url.search);
  });

  // Progress rail: logo on the first screen, back arrow + progress after it.
  var fill = document.querySelector('.af-fill');
  function setProgress(pct) { if (fill) fill.style.width = pct + '%'; }

  // Trade landings: two screens (hero, what Revo does), like /free-test.
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-step]'));
  function show(n, push) {
    steps.forEach(function (s) { s.hidden = Number(s.getAttribute('data-step')) !== n; });
    document.body.classList.toggle('af-on-step', n > 0);
    setProgress(n > 0 ? 33 : 0);
    if (push) { try { history.pushState({ afStep: n }, ''); } catch (e) { /* ignore */ } }
    window.scrollTo(0, 0);
  }
  if (steps.length) {
    show(0, false);
    Array.prototype.forEach.call(document.querySelectorAll('[data-next]'), function (b) {
      b.addEventListener('click', function () { show(1, true); });
    });
    window.addEventListener('popstate', function (e) { show(e.state && e.state.afStep ? e.state.afStep : 0, false); });
  }
  var toggle = document.querySelector('[data-example-toggle]');
  var example = document.getElementById('af-example');
  if (toggle && example) {
    toggle.addEventListener('click', function () {
      example.hidden = !example.hidden;
      toggle.setAttribute('aria-expanded', String(!example.hidden));
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-back]'), function (b) {
    b.addEventListener('click', function () {
      if (steps.length) return history.back();
      var back = trade ? '/' + trade : (attr.lp && attr.lp !== '/start' ? attr.lp : '/');
      if (document.referrer && document.referrer.indexOf(window.location.origin) === 0) return history.back();
      window.location.href = back;
    });
  });
  var bodyProgress = document.body.getAttribute('data-progress');
  if (bodyProgress) setProgress(Number(bodyProgress));

  // Start page.
  var form = document.getElementById('app-start-form');
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var preset = (params.get('trade') || '').toLowerCase();
  var select = form.querySelector('[name="trade"]');
  if (select && preset && select.querySelector('option[value="' + preset.replace(/[^a-z-]/g, '') + '"]')) select.value = preset;

  var status = document.getElementById('app-start-status');
  var button = form.querySelector('button[type="submit"]');
  var sent = false;

  function showError(field, message) {
    status.textContent = message;
    var input = field && form.querySelector('[name="' + field + '"]');
    if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
  }

  form.addEventListener('input', function (e) { if (e.target && e.target.removeAttribute) e.target.removeAttribute('aria-invalid'); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (sent) return;
    var data = new FormData(form);
    var body = {
      email: String(data.get('email') || ''),
      business_name: String(data.get('business_name') || ''),
      trade: String(data.get('trade') || ''),
      zip: String(data.get('zip') || ''),
      phone: String(data.get('phone') || ''),
      website: String(data.get('website') || ''),
      attribution: attr
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email.trim())) return showError('email', 'Enter a valid email.');
    if (!body.business_name.trim()) return showError('business_name', 'Enter your business name.');
    if (!body.trade) return showError('trade', 'Pick your trade.');
    if (!body.zip.trim()) return showError('zip', 'Enter your ZIP code.');
    var digits = body.phone.replace(/\D/g, '');
    if (!(digits.length === 10 || (digits.length === 11 && digits.charAt(0) === '1'))) return showError('phone', 'Enter a valid mobile number.');

    button.disabled = true;
    status.textContent = 'Setting up your account…';
    if (typeof window.revoLoadTags === 'function') window.revoLoadTags();

    fetch('/api/app-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) { return { status: r.status, json: j }; });
    }).then(function (res) {
      if (!res.json || !res.json.ok || typeof res.json.redirect !== 'string' || res.json.redirect.indexOf('https://web.revoapp.ai/') !== 0) {
        button.disabled = false;
        return showError(res.json && res.json.field, (res.json && res.json.message) || 'Something went wrong. Please try again.');
      }
      sent = true;
      var go = function () { window.location.assign(res.json.redirect); };
      var once = 'revo_signup_started_' + res.json.lead_id;
      var already = false;
      try { already = window.sessionStorage.getItem(once) === '1'; window.sessionStorage.setItem(once, '1'); } catch (e) { /* ignore */ }
      if (already) return go();
      var done = false;
      var finish = function () { if (!done) { done = true; go(); } };
      track('signup_started', {
        event_id: 'signup_started:' + res.json.lead_id,
        lead_id: res.json.lead_id,
        trade: res.json.trade,
        icp: res.json.icp,
        utm_source: attr.utm_source || '',
        utm_medium: attr.utm_medium || '',
        utm_campaign: attr.utm_campaign || '',
        eventCallback: finish,
        eventTimeout: 1500
      });
      // GTM may still be loading; never hold the owner longer than 1.5 s.
      setTimeout(finish, 1600);
    }).catch(function () {
      button.disabled = false;
      showError('', 'Something went wrong. Please try again.');
    });
  });
})();
