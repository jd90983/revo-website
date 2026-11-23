/*
 * Revo web chat (AGENT-26 v1). One self-contained file: a launcher button and a chat panel inside a shadow root,
 * so the page's styles are untouched. Opt-in: nothing is sent until the visitor types a message.
 * Answers come from approved Revo facts only; anything else is handed to the team. English only.
 * Remove the <script> tag to roll back; nothing else on the page depends on it.
 */
(function () {
  'use strict';
  if (window.__revoChatLoaded) return;
  window.__revoChatLoaded = true;

  var ENDPOINT = 'https://frzihlwxnidzsnpimvid.supabase.co/functions/v1/revo-chat';
  var SIGNUP = 'https://web.revoapp.ai/';
  var ALLOWED_HOSTS = ['web.revoapp.ai', 'www.revoapp.ai', 'revoapp.ai', 'apps.apple.com', 'play.google.com'];
  var GREETING = 'Hi! I can answer questions about Revo and help you start free — your next 10 calls answered free, no card needed.';

  function store(kind) { try { return window[kind]; } catch (e) { return null; } }
  function get(kind, k) { try { var s = store(kind); return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function set(kind, k, v) { try { var s = store(kind); if (s) s.setItem(k, v); } catch (e) { /* storage blocked */ } }

  function newId() {
    var a = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.floor(Math.random() * 256); });
    return 'rc' + Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  var sessionId = get('sessionStorage', 'revo_chat_sid') || newId();
  set('sessionStorage', 'revo_chat_sid', sessionId);

  // Campaign of the visit (kept for attribution and passed on to the free-account link)
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var utm = {};
  try {
    var saved = JSON.parse(get('sessionStorage', 'revo_chat_utm') || '{}');
    var q = new URLSearchParams(window.location.search);
    KEYS.forEach(function (k) { var v = q.get(k) || saved[k]; if (v) utm[k] = String(v).slice(0, 200); });
    set('sessionStorage', 'revo_chat_utm', JSON.stringify(utm));
  } catch (e) { /* ignore */ }

  function signupUrl() {
    try {
      var u = new URL(SIGNUP);
      var p = utm.utm_source ? utm : { utm_source: 'revoapp.ai', utm_medium: 'website_chat', utm_campaign: 'revo_chat' };
      Object.keys(p).forEach(function (k) { u.searchParams.set(k, p[k]); });
      return u.toString();
    } catch (e) { return SIGNUP; }
  }

  var CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}',
    '.launch{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:8px;background:#0f5ad7;color:#fff;border:0;border-radius:999px;padding:12px 18px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(15,90,215,.35)}',
    '.launch:hover{background:#0054ef}',
    '.launch:focus-visible,.send:focus-visible,.close:focus-visible,.cta:focus-visible{outline:3px solid #6b9dff;outline-offset:2px}',
    '.panel{position:fixed;right:20px;bottom:20px;z-index:2147483001;width:370px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 40px);background:#fff;color:#0a0b0c;border-radius:16px;box-shadow:0 16px 48px rgba(10,11,12,.28);display:none;flex-direction:column;overflow:hidden}',
    '.panel.open{display:flex}',
    '.head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#0a0b0c;color:#fff}',
    '.title{font-family:"Lexend Deca",Inter,sans-serif;font-size:16px;font-weight:600}',
    '.sub{font-size:12px;color:#a8a8a8;margin-top:2px}',
    '.close{background:transparent;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:8px}',
    '.log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f5f4f0}',
    '.msg{max-width:85%;padding:10px 12px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}',
    '.bot{background:#fff;border:1px solid #deded9;align-self:flex-start;border-bottom-left-radius:4px}',
    '.me{background:#0f5ad7;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}',
    '.bot a{color:#0f5ad7}',
    '.cta{align-self:flex-start;display:inline-block;background:#0f5ad7;color:#fff !important;text-decoration:none;font-weight:600;font-size:14px;padding:9px 14px;border-radius:10px}',
    '.typing{align-self:flex-start;font-size:13px;color:#636361}',
    '.form{display:flex;gap:8px;padding:12px;border-top:1px solid #deded9;background:#fff}',
    '.in{flex:1;border:1px solid #deded9;border-radius:10px;padding:10px 12px;font-size:16px;color:#0a0b0c;background:#fff}',
    '.in:focus{outline:2px solid #6b9dff;border-color:#6b9dff}',
    '.send{background:#0f5ad7;color:#fff;border:0;border-radius:10px;padding:0 14px;font-size:14px;font-weight:600;cursor:pointer}',
    '.send:disabled{opacity:.5;cursor:default}',
    '.note{font-size:11px;color:#636361;padding:0 12px 10px;background:#fff;line-height:1.4}',
    '.note a{color:#636361}',
    '@media (max-width:480px){.panel{right:0;bottom:0;width:100vw;max-width:100vw;height:100vh;max-height:100vh;border-radius:0}.launch{right:16px;bottom:16px}}',
    '@media (prefers-reduced-motion:no-preference){.panel.open{animation:rcIn .18s ease-out}@keyframes rcIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}'
  ].join('');

  var host = document.createElement('div');
  host.id = 'revo-chat';
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
  root.innerHTML = '<style>' + CSS + '</style>' +
    '<button class="launch" type="button" aria-haspopup="dialog" aria-expanded="false">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>' +
    '<span>Questions? Ask Revo</span></button>' +
    '<div class="panel" role="dialog" aria-modal="false" aria-label="Revo assistant">' +
    '<div class="head"><div><div class="title">Revo assistant</div><div class="sub">AI assistant · replies in English</div></div>' +
    '<button class="close" type="button" aria-label="Close chat">×</button></div>' +
    '<div class="log" role="log" aria-live="polite"></div>' +
    '<form class="form"><label style="position:absolute;left:-9999px" for="rc-in">Your message</label>' +
    '<input class="in" id="rc-in" type="text" maxlength="1000" autocomplete="off" placeholder="Ask about Revo…">' +
    '<button class="send" type="submit">Send</button></form>' +
    '<div class="note">AI assistant: answers come from Revo’s published info; anything else goes to our team. Don’t share payment details. ' +
    '<a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></div></div>';

  var $ = function (s) { return root.querySelector(s); };
  var launch = $('.launch'), panel = $('.panel'), log = $('.log'), form = $('.form'), input = $('.in'), send = $('.send');
  var busy = false, greeted = false;

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function linkify(t) {
    return esc(t).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g, function (u) {
      try { var h = new URL(u.replace(/&amp;/g, '&')).hostname; if (ALLOWED_HOSTS.indexOf(h) < 0) return u; } catch (e) { return u; }
      var href = u.indexOf('web.revoapp.ai') >= 0 ? esc(signupUrl()) : u;
      return '<a href="' + href + '" target="_blank" rel="noopener" data-rc-cta="link">' + u + '</a>';
    });
  }
  function add(text, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
    if (who === 'me') d.textContent = text; else d.innerHTML = linkify(text);
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function addCta() {
    var a = document.createElement('a');
    a.className = 'cta'; a.href = signupUrl(); a.target = '_blank'; a.rel = 'noopener';
    a.textContent = 'Start free — no card needed';
    a.setAttribute('data-rc-cta', 'button');
    log.appendChild(a); log.scrollTop = log.scrollHeight;
  }
  function track(target) {
    try {
      fetch(ENDPOINT + '?kind=event', { method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true,
        body: JSON.stringify({ session_id: sessionId, event_name: 'cta_clicked', target: target }) });
    } catch (e) { /* ignore */ }
  }
  log.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-rc-cta]') : null;
    if (a && a.href.indexOf('web.revoapp.ai') >= 0) track(a.getAttribute('data-rc-cta') === 'button' ? 'signup_button' : 'signup_link');
  });

  function open() {
    panel.classList.add('open'); launch.style.display = 'none'; launch.setAttribute('aria-expanded', 'true');
    if (!greeted) { add(GREETING, 'bot'); greeted = true; }
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() { panel.classList.remove('open'); launch.style.display = ''; launch.setAttribute('aria-expanded', 'false'); launch.focus(); }
  launch.addEventListener('click', open);
  $('.close').addEventListener('click', close);
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true; send.disabled = true; input.value = '';
    add(text, 'me');
    var typing = document.createElement('div'); typing.className = 'typing'; typing.textContent = 'Revo assistant is typing…';
    log.appendChild(typing); log.scrollTop = log.scrollHeight;
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message: text.slice(0, 1000), page_url: window.location.href.split('#')[0].slice(0, 500),
        referrer: document.referrer.slice(0, 300), utm: utm })
    }).then(function (r) { return r.json(); }).then(function (d) {
      typing.remove();
      add((d && d.reply) || 'Sorry, something went wrong. You can start free here: ' + SIGNUP, 'bot');
      if (d && d.cta === 'signup') addCta();
    }).catch(function () {
      typing.remove();
      add('Sorry, I could not connect. You can start free here — your next 10 calls answered free, no card needed: ' + SIGNUP, 'bot');
    }).then(function () { busy = false; send.disabled = false; input.focus(); });
  });

  function mount() { document.body.appendChild(host); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
