// POST /api/app-start: the Start step of the no-card app signup flow.
// Validates the form, mints the lead_id, sends the lead to GoHighLevel and
// returns the web.revoapp.ai URL. A CRM failure never blocks the signup.
import {
  TRADES, cleanAttribution, tradeSlug, safeLandingPath, isUsZip, normalizeUsPhone,
  isEmail, leadIdFor, isIcp, appUrl
} from './_app-flow.js';

const MAX_BODY = 8192;

function bad(res, field, message) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: false, field, message }));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error('too large');
  }
  return raw ? JSON.parse(raw) : {};
}

export function validate(body) {
  const email = String(body.email || '').trim();
  const businessName = String(body.business_name || '').trim().replace(/\s+/g, ' ');
  const trade = tradeSlug(body.trade);
  const zip = String(body.zip || '').trim().toUpperCase().slice(0, 10);
  const phone = normalizeUsPhone(body.phone);
  if (!isEmail(email)) return { error: ['email', 'Enter a valid email.'] };
  if (!businessName || businessName.length > 120) return { error: ['business_name', 'Enter your business name.'] };
  if (!trade) return { error: ['trade', 'Pick your trade.'] };
  if (!zip || !/^[A-Z0-9 -]{3,10}$/.test(zip)) return { error: ['zip', 'Enter your ZIP code.'] };
  if (!phone) return { error: ['phone', 'Enter a valid mobile number.'] };
  return { email, businessName, trade, zip, phone };
}

export function crmPayload({ email, businessName, trade, zip, phone }, leadId, attribution, landingPath, firstTouchAt, now) {
  const icp = isIcp(trade, zip);
  return {
    email,
    phone,
    business_name: businessName,
    trade: TRADES[trade].label,
    zip,
    postal_code_is_us: isUsZip(zip) ? 'true' : 'false',
    icp: icp ? 'icp' : 'not-icp',
    trade_tag: 'trade-' + trade,
    // "revo-app" and "revo-app-<event>" tags belong to the app's own CRM sync; this flow uses revo-app-start.
    tags: ['revo-app-start', 'trade-' + trade, icp ? 'icp' : 'not-icp'].join(','),
    lead_id: leadId,
    utm_source: attribution.utm_source || '',
    utm_medium: attribution.utm_medium || '',
    utm_campaign: attribution.utm_campaign || '',
    utm_content: attribution.utm_content || '',
    utm_term: attribution.utm_term || '',
    gclid: attribution.gclid || '',
    fbclid: attribution.fbclid || '',
    landing_page: landingPath || '',
    first_touch_at: firstTouchAt || '',
    submitted_at: now,
    page_url: 'https://www.revoapp.ai/start',
    offer: '10_free_calls_app'
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end();
  }
  let body;
  try {
    body = await readBody(req);
  } catch {
    return bad(res, '', 'Something went wrong. Please try again.');
  }
  if (body && body.website) {
    // Honeypot filled: answer like a success, send nothing.
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: true, redirect: appUrl({}) }));
  }
  const v = validate(body || {});
  if (v.error) return bad(res, v.error[0], v.error[1]);

  const attribution = cleanAttribution(body.attribution || {});
  const landingPath = safeLandingPath(body.attribution && body.attribution.lp);
  const firstTouch = String((body.attribution && body.attribution.first_touch_at) || '');
  const firstTouchAt = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(firstTouch) ? firstTouch : '';
  const leadId = leadIdFor(v.email, process.env.APP_LEAD_SALT);
  const now = new Date().toISOString();
  const payload = crmPayload(v, leadId, attribution, landingPath, firstTouchAt, now);

  const webhook = process.env.GHL_APP_START_WEBHOOK_URL;
  if (webhook) {
    try {
      const url = new URL(webhook);
      if (url.protocol !== 'https:') throw new Error('bad webhook');
      const r = await fetch(url.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000),
        redirect: 'error'
      });
      if (!r.ok) console.error('app-start: GHL webhook rejected', r.status, 'lead', leadId);
    } catch (error) {
      console.error('app-start: GHL webhook failed', error && error.name, 'lead', leadId);
    }
  } else {
    console.warn('app-start: GHL_APP_START_WEBHOOK_URL not set; lead', leadId);
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    ok: true,
    lead_id: leadId,
    icp: payload.icp,
    trade: v.trade,
    redirect: appUrl({ lead_id: leadId, ...attribution })
  }));
}
