// No production transport is connected until identity, disclosures, retention,
// consent persistence and SMS suppression/HELP behavior have been verified.
export const DISCLOSURE_VERSION = 'revo-sms-draft-2026-10-29';
export function readPreferences(form) {
  const data = new FormData(form);
  return {
    firstName: String(data.get('firstName') || '').trim(),
    lastName: String(data.get('lastName') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    email: String(data.get('email') || '').trim(),
    transactionalConsent: data.get('transactionalConsent') === 'on',
    marketingConsent: data.get('marketingConsent') === 'on',
    disclosureVersion: DISCLOSURE_VERSION
  };
}
export async function unavailableTransport() {
  throw new Error('SMS enrollment is not available yet. Your preferences have not been saved. No messages have been sent.');
}
export function mountConsentForm(form, transport = unavailableTransport) {
  const result = form.querySelector('#sms-result');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    result.textContent = 'Saving preferences…';
    try {
      const receipt = await transport(readPreferences(form));
      // Require a durable receipt, never infer persistence from a generic HTTP 200.
      if (receipt?.saved !== true || typeof receipt.receiptId !== 'string' || !receipt.receiptId) throw new Error('No saved preference receipt.');
      result.textContent = 'Your SMS preferences have been saved.';
    } catch {
      result.textContent = 'SMS enrollment is not available yet. Your preferences have not been saved. No messages have been sent.';
    } finally {
      button.disabled = false;
      result.focus();
    }
  });
  // Enable inputs only after the handler prevents native navigation with PII.
  form.querySelector('#sms-controls').disabled = false;
}
if (typeof document !== 'undefined') {
  const form = document.querySelector('#sms-consent-form');
  if (form) mountConsentForm(form);
}
