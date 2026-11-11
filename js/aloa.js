/* /aloa campaign page (Keynotes, ALOA magazine QR code).
   - Reads utm_source, utm_medium and utm_campaign from the URL, falls back to
     the print defaults, and carries them on every free-trial link so the
     trial and the CRM lead keep the Keynotes ALOA source.
   - Sends aloa_page_view, aloa_trial_click (with plan) and aloa_call_click
     to Google Tag Manager / GA4. No personal data is sent. */
(function () {
  'use strict';

  var DEFAULTS = {
    utm_source: 'keynotes',
    utm_medium: 'print',
    utm_campaign: 'aloa_jan_feb_2027'
  };
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  // Same safety rules as the site's funnel attribution: short plain values only.
  function safe(value) {
    return typeof value === 'string' && value.length > 0 && value.length <= 256 &&
      !/[@\r\n\u0000-\u001f]|:\/\/|\d{7,}/.test(value);
  }

  function campaign() {
    var params = new URLSearchParams(window.location.search);
    var result = {};
    KEYS.forEach(function (key) {
      var values = params.getAll(key);
      if (values.length === 1 && safe(values[0])) result[key] = values[0];
    });
    Object.keys(DEFAULTS).forEach(function (key) {
      if (!result[key]) result[key] = DEFAULTS[key];
    });
    return result;
  }

  function track(name, params) {
    var payload = Object.assign({ event: name }, params || {});
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (e) { /* analytics must never block navigation */ }
  }

  var utm = campaign();

  // Carry the campaign on every free-trial link; keep the plan for the checkout.
  var trialLinks = document.querySelectorAll('[data-aloa-trial]');
  Array.prototype.forEach.call(trialLinks, function (link) {
    var url = new URL(link.getAttribute('href'), window.location.origin);
    Object.keys(utm).forEach(function (key) { url.searchParams.set(key, utm[key]); });
    link.setAttribute('href', url.pathname + url.search);
    link.addEventListener('click', function () {
      track('aloa_trial_click', {
        plan: url.searchParams.get('plan') || 'not_selected',
        cta_placement: link.getAttribute('data-aloa-trial'),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign
      });
    });
  });

  var callLinks = document.querySelectorAll('[data-aloa-call]');
  Array.prototype.forEach.call(callLinks, function (link) {
    link.addEventListener('click', function () {
      track('aloa_call_click', {
        cta_placement: link.getAttribute('data-aloa-call'),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign
      });
    });
  });

  track('aloa_page_view', {
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign
  });
})();
