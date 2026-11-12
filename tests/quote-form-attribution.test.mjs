import test from 'node:test';
import assert from 'node:assert/strict';
import { attributionForStorage } from '../api/_quote-attribution.js';

test('stores only filled marketing fields plus the offer', () => {
  const stored = attributionForStorage({
    utm_source: 'google', utm_medium: 'cpc', utm_campaign: '123', utm_term: '', utm_content: '',
    gclid: 'abc', fbclid: '', page_url: 'https://www.revoapp.ai/industry_painting',
    referrer: 'https://www.google.com/search?q=answering+service', industryLabel: 'Painting'
  });
  assert.deepEqual(stored, {
    offer: 'quote_form', utm_source: 'google', utm_medium: 'cpc', utm_campaign: '123', gclid: 'abc',
    page_url: 'https://www.revoapp.ai/industry_painting', referrer_origin: 'https://www.google.com'
  });
});

test('direct visit still returns an object so the lead is synced', () => {
  assert.deepEqual(attributionForStorage({ referrer: '' }), { offer: 'quote_form' });
  assert.deepEqual(attributionForStorage(undefined), { offer: 'quote_form' });
});

test('a malformed referrer is ignored', () => {
  assert.deepEqual(attributionForStorage({ referrer: 'not a url' }), { offer: 'quote_form' });
});
