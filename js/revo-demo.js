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
const fallback = document.querySelector('.ads-calendar-fallback');
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
