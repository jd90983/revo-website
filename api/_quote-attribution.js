// Helper for api/submit-form.js (underscore prefix: not deployed as an endpoint).

/**
 * Attribution object stored with a new lead. Only non-empty marketing fields,
 * plus the referrer origin (never the full referrer URL) and the offer name.
 * Always returns an object, so every new lead is picked up by the engine sync.
 */
export function attributionForStorage(attribution) {
  const stored = { offer: 'quote_form' };
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'page_url']) {
    if (attribution && attribution[key]) stored[key] = attribution[key];
  }
  if (attribution && attribution.referrer) {
    try { stored.referrer_origin = new URL(attribution.referrer).origin; } catch { /* ignore bad referrer */ }
  }
  return stored;
}
