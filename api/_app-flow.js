// Helpers for the no-card app signup flow (api/go.js, api/app-start.js).
// Underscore prefix: Vercel does not deploy this file as an endpoint.
import { createHash, randomUUID } from 'node:crypto';

export const APP_URL = 'https://web.revoapp.ai/';
export const APP_ROUTE = '#/auth';

// The eight query keys the app reads and saves on the account (checked in its
// public bundle, Nov 19 2026). Nothing else is passed to the app.
export const APP_KEYS = ['lead_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
export const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

export const TRADES = {
  hvac: { label: 'HVAC', word: 'HVAC', noun: 'HVAC company' },
  plumbing: { label: 'Plumbing', word: 'plumbing', noun: 'plumber' },
  locksmith: { label: 'Locksmith', word: 'locksmith', noun: 'locksmith' },
  electrical: { label: 'Electrical', word: 'electrical', noun: 'electrician' },
  'pressure-washing': { label: 'Pressure washing', word: 'pressure washing', noun: 'pressure washing company' },
  painting: { label: 'Painting', word: 'painting', noun: 'painter' },
  'garage-door': { label: 'Garage door', word: 'garage door', noun: 'garage door company' },
  'pest-control': { label: 'Pest control', word: 'pest control', noun: 'pest control company' },
  roofing: { label: 'Roofing', word: 'roofing', noun: 'roofer' },
  other: { label: 'Other', word: 'home service', noun: 'home service company' }
};

// Defaults used only when the link carries no utm_source / utm_medium.
export const CHANNELS = {
  meta: { utm_source: 'facebook', utm_medium: 'paid_social' },
  google: { utm_source: 'google', utm_medium: 'cpc' },
  apple: { utm_source: 'apple_search_ads', utm_medium: 'cpc' },
  tiktok: { utm_source: 'tiktok', utm_medium: 'paid_social' },
  email: { utm_source: 'email', utm_medium: 'outbound' },
  qr: { utm_source: 'print', utm_medium: 'offline' }
};

// Short plain values only: no URLs, emails, control characters, # or long digit runs.
export function safeValue(value) {
  if (typeof value !== 'string') return '';
  const v = value.trim();
  if (!v || v.length > 256) return '';
  if (/[@#\r\n\u0000-\u001f]|:\/\/|\d{7,}/.test(v)) return '';
  return v;
}

// Click ids are opaque tokens: letters, digits, _ and - only.
export function safeClickId(value) {
  if (typeof value !== 'string') return '';
  const v = value.trim();
  return v.length > 0 && v.length <= 256 && /^[A-Za-z0-9_-]+$/.test(v) ? v : '';
}

export function cleanAttribution(source) {
  const out = {};
  for (const key of ATTRIBUTION_KEYS) {
    const raw = source && source[key];
    const value = key === 'gclid' || key === 'fbclid' ? safeClickId(raw) : safeValue(raw);
    if (value) out[key] = value;
  }
  return out;
}

export function tradeSlug(value) {
  const v = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(TRADES, v) ? v : '';
}

// Landing path: a site-relative path only, never a full URL.
export function safeLandingPath(value) {
  const v = String(value || '').trim();
  return /^\/[a-z0-9\-\/]{0,80}$/.test(v) ? v : '';
}

export function isUsZip(value) {
  const v = String(value || '').trim();
  return /^\d{5}(-\d{4})?$/.test(v) && !v.startsWith('00000');
}

export function normalizeUsPhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (digits.length !== 10 || /^[01]/.test(digits)) return '';
  return '+1' + digits;
}

export function isEmail(value) {
  const v = String(value || '').trim();
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

// Same email always maps to the same lead_id, without storing anything.
// The salt keeps the id from being reversible to the email.
export function leadIdFor(email, salt) {
  if (!salt) return randomUUID();
  const h = createHash('sha256').update(salt + ':' + String(email).trim().toLowerCase()).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

export function isIcp(trade, zip) {
  return trade !== '' && trade !== 'other' && isUsZip(zip);
}

// The app URL contract: query before the #, only APP_KEYS, nothing after the route.
export function appUrl(params) {
  const url = new URL(APP_URL);
  for (const key of APP_KEYS) {
    const value = params && params[key];
    if (value) url.searchParams.set(key, value);
  }
  return url.origin + url.pathname + url.search + APP_ROUTE;
}

// /go/<channel>: where a link with no landing page should go.
export function goTarget(channel, query) {
  const ch = Object.prototype.hasOwnProperty.call(CHANNELS, channel) ? channel : '';
  const attribution = cleanAttribution(query);
  if (ch) {
    for (const [key, value] of Object.entries(CHANNELS[ch])) if (!attribution[key]) attribution[key] = value;
  }
  const trade = tradeSlug(query && query.trade);
  const path = trade && trade !== 'other' ? '/' + trade : '/start';
  const params = new URLSearchParams(attribution);
  if (trade && path === '/start') params.set('trade', trade);
  const search = params.toString();
  return path + (search ? '?' + search : '');
}
