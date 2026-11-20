/* Revo paid-traffic signup flow: trade landings (/hvac, /locksmith, ...) and /start.
   - Keeps the first touch (30 days) and the last click (UTMs, fbclid, gclid).
   - The form sits on the first screen of every landing: email, US mobile, business name.
     The trade comes from the landing (hidden field) or from the picker on /start.
   - On submit: POST /api/app-start, Meta Lead once per lead_id, signup_started for GA4,
     then web.revoapp.ai with the query before the #. */
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var NUMERIC_ID_KEYS = ['utm_content', 'utm_term'];
  var FIRST = 'revo_app_attr_v1';
  var LAST = 'revo_app_last_v1';

  function safe(v, key) {
    if (typeof v !== 'string' || v.length === 0 || v.length > 256) return false;
    if (/[@#\r\n\u0000-\u001f]|:\/\//.test(v)) return false;
    if (NUMERIC_ID_KEYS.indexOf(key) !== -1 && /^\d{1,20}$/.test(v)) return true;
    return !/\d{7,}/.test(v);
  }
  function safeId(v) { return typeof v === 'string' && /^[A-Za-z0-9_-]{1,256}$/.test(v); }

  function read(key) {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function write(key, obj) {
    try { window.localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { /* storage blocked */ }
  }

  function fromUrl() {
    var params = new URLSearchParams(window.location.search);
    var out = {};
    KEYS.forEach(function (k) {
      var all = params.getAll(k);
      if (all.length !== 1) return;
      var ok = (k === 'gclid' || k === 'fbclid') ? safeId(all[0]) : safe(all[0], k);
      if (ok) out[k] = all[0];
    });
    return out;
  }
  function hasAny(obj) { return KEYS.some(function (k) { return !!obj[k]; }); }

  var now = fromUrl();

  // First touch wins for 30 days: a later visit never replaces it inside that window.
  function firstTouch() {
    var stored = read(FIRST);
    var age = stored && stored.first_touch_at ? Date.now() - Date.parse(stored.first_touch_at) : Infinity;
    if (age >= 0 && age < 30 * 864e5) return stored;
    var first = {};
    KEYS.forEach(function (k) { if (now[k]) first[k] = now[k]; });
    var lp = new URLSearchParams(window.location.search).get('lp');
    first.lp = lp && /^\/[a-z0-9\-\/]{0,80}$/.test(lp) ? lp : window.location.pathname;
    first.first_touch_at = new Date().toISOString();
    write(FIRST, first);
    return first;
  }

  // Last click: any visit whose link carries attribution replaces it.
  function lastClick() {
    if (hasAny(now)) {
      var last = {};
      KEYS.forEach(function (k) { if (now[k]) last[k] = now[k]; });
      last.at = new Date().toISOString();
      write(LAST, last);
      return last;
    }
    return read(LAST) || {};
  }

  var first = firstTouch();
  var last = lastClick();

  function track(payload) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(payload); } catch (e) { /* never block */ }
  }

  // Example call on the landings.
  var toggle = document.querySelector('[data-example-toggle]');
  var example = document.getElementById('af-example');
  if (toggle && example) {
    toggle.addEventListener('click', function () {
      example.hidden = !example.hidden;
      toggle.setAttribute('aria-expanded', String(!example.hidden));
    });
  }

  var form = document.getElementById('app-start-form');
  if (!form) return;

  // /start: preselect the trade from ?trade= when it is one of the options.
  var select = form.querySelector('select[name="trade"]');
  var preset = (new URLSearchParams(window.location.search).get('trade') || '').toLowerCase().replace(/[^a-z-]/g, '');
  if (select && preset && select.querySelector('option[value="' + preset + '"]')) select.value = preset;

  var status = document.getElementById('app-start-status');
  var button = form.querySelector('button[type="submit"]');
  var sent = false;

  function showError(field, message) {
    status.textContent = message;
    var input = field && form.querySelector('[name="' + field + '"]');
    if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
  }

  form.addEventListener('input', function (e) { if (e.target && e.target.removeAttribute) e.target.removeAttribute('aria-invalid'); });

  function once(key) {
    var seen = false;
    try { seen = window.localStorage.getItem(key) === '1'; window.localStorage.setItem(key, '1'); } catch (e) { /* ignore */ }
    return !seen;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (sent) return;
    var data = new FormData(form);
    var body = {
      email: String(data.get('email') || ''),
      phone: String(data.get('phone') || ''),
      business_name: String(data.get('business_name') || ''),
      trade: String(data.get('trade') || ''),
      website: String(data.get('website') || ''),
      attribution: first,
      last: last,
      page: window.location.pathname
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email.trim())) return showError('email', 'Enter a valid email.');
    var digits = body.phone.replace(/\D/g, '');
    if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
    if (digits.length !== 10 || /^[01]/.test(digits)) return showError('phone', 'Enter a valid US mobile number.');
    if (!body.business_name.trim()) return showError('business_name', 'Enter your business name.');
    if (!body.trade) return showError('trade', 'Pick your trade.');

    button.disabled = true;
    status.textContent = 'Creating your account…';
    if (typeof window.revoLoadTags === 'function') window.revoLoadTags();

    fetch('/api/app-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json();
    }).then(function (j) {
      if (!j || !j.ok || typeof j.redirect !== 'string' || j.redirect.indexOf('https://web.revoapp.ai/') !== 0) {
        button.disabled = false;
        return showError(j && j.field, (j && j.message) || 'Something went wrong. Please try again.');
      }
      sent = true;
      var go = function () { window.location.assign(j.redirect); };
      if (!j.lead_id) return go(); // honeypot answer: nothing to track

      // Meta standard Lead, once per lead_id; the eventID lets Meta drop duplicates.
      if (once('revo_meta_lead_' + j.lead_id) && typeof window.fbq === 'function') {
        try { window.fbq('track', 'Lead', { trade: j.trade, icp: j.icp }, { eventID: 'lead:' + j.lead_id }); } catch (e) { /* never block */ }
      }

      // Leave once GTM has run signup_started and the Meta pixel script has loaded
      // (its queue is sent on load), and never hold the owner longer than 2 s.
      var done = false;
      var gtmDone = false;
      var go2 = function () { if (!done) { done = true; go(); } };
      var check = function () {
        var metaReady = typeof window.fbq !== 'function' || typeof window.fbq.callMethod === 'function';
        if (gtmDone && metaReady) setTimeout(go2, 250);
        else if (!done) setTimeout(check, 100);
      };
      var finish = function () { gtmDone = true; check(); };
      setTimeout(go2, 2000);

      if (!once('revo_signup_started_' + j.lead_id)) return finish();
      track({
        event: 'signup_started',
        event_id: 'signup_started:' + j.lead_id,
        lead_id: j.lead_id,
        trade: j.trade,
        icp: j.icp,
        utm_source: last.utm_source || first.utm_source || '',
        utm_medium: last.utm_medium || first.utm_medium || '',
        utm_campaign: last.utm_campaign || first.utm_campaign || '',
        eventCallback: finish,
        eventTimeout: 1500
      });
      setTimeout(finish, 1600);
    }).catch(function () {
      button.disabled = false;
      showError('', 'Something went wrong. Please try again.');
    });
  });
})();
