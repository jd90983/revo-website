// Existing approved calendar. Only load the third-party frame on visitor request.
const calendarURL = 'https://api.leadconnectorhq.com/widget/bookings/revo-free-calls-10-minutes';
const current = new URLSearchParams(location.search);
const calendar = new URL(calendarURL);
// Pass only standard campaign fields; never forward arbitrary URL parameters or PII.
for (const key of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']) {
  const value = current.get(key);
  if (value && value.length <= 200) calendar.searchParams.set(key, value);
}
const opener = document.getElementById('load-calendar');
const fallback = document.querySelector('.rd-calendar-fallback');
opener.href = calendar.href;
fallback.href = calendar.href;
opener.addEventListener('click', event => {
  event.preventDefault();
  const frame = document.createElement('iframe');
  frame.title = 'Book your Revo session with Jorge';
  frame.src = calendar.href;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  document.getElementById('calendar-holder').append(frame);
  document.getElementById('calendar-intro').hidden = true;
  frame.focus();
}, {once:true});

// Keep the HOME player's accessible name synchronized with its existing play/pause icon.
const homePlayButton = document.querySelector('.hear-sample-play-button');
if (homePlayButton) {
  const syncPlayerLabel = () => homePlayButton.setAttribute('aria-label', homePlayButton.querySelector('img')?.alt === 'Pause' ? 'Pause audio' : 'Play audio');
  syncPlayerLabel();
  new MutationObserver(syncPlayerLabel).observe(homePlayButton, {childList:true});
}
// Adapt the HOME player's end-of-sample prompt to this landing's demo conversion.
const sampleChat = document.querySelector('.hear-sample-chat');
if (sampleChat) {
  new MutationObserver(() => {
    const prompt = sampleChat.querySelector('.hear-sample-revo-notification');
    if (!prompt || prompt.dataset.demoAdapted) return;
    prompt.dataset.demoAdapted = 'true';
    prompt.querySelector('.hear-sample-notification-description').textContent = 'See how Revo fits your home service business.';
    const button = prompt.querySelector('.hear-sample-notification-btn-primary');
    button.textContent = 'Book a demo';
    button.addEventListener('click', () => document.getElementById('book-demo').scrollIntoView({behavior:'smooth',block:'start'}));
  }).observe(sampleChat, {childList:true,subtree:true});
}
