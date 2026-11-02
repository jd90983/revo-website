// Measures navigation intent only. A click is never a lead or a booked demo.
(function () {
  'use strict';
  const pages = new Set(['/pricing', '/industry_small_business', '/ai-answering-service/zanus-ai-receptionist', '/ai-answering-service/broccoli-ai-pricing', '/ai-answering-service/rosie-ai-pricing']);
  const destination = '/ai-receptionist-demo#book-demo';
  if (!pages.has(location.pathname)) return;
  if (window.revoDemoCtaInstalled) return;
  window.revoDemoCtaInstalled = true;
  let last = -Infinity;
  document.addEventListener('click', function (event) {
    const anchor = event.target?.closest?.('a[data-seo-demo-cta="hero"]');
    if (!anchor || anchor.getAttribute('href') !== destination) return;
    try {
      if (navigator.globalPrivacyControl === true || localStorage.getItem('revo-consent') !== 'granted') return;
      const now = Date.now();
      if (now - last < 800) return;
      last = now;
      const payload = {page_path: location.pathname, cta_location: 'hero', destination,
        page_location: location.origin + location.pathname, page_referrer: ''};
      if (typeof window.gtag === 'function') window.gtag('event', 'seo_cta_click', payload);
      else if (Array.isArray(window.dataLayer)) window.dataLayer.push({event: 'seo_cta_click', ...payload});
    } catch (_) { /* Navigation works when storage or analytics is unavailable. */ }
  });
}());
