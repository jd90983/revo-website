/* Home v3 draft: hero "Try it" audio, Hear the difference (trade + robot/Revo voice), trade showcase,
   sample-call player (reuses HEAR_SAMPLE_CONFIG from js/hear-sample-config.js) and the card info tips. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); }

  // One audio element at a time across the page
  var current = null;
  function claim(audio, stopFn) { if (current && current.audio !== audio) current.stop(); current = { audio: audio, stop: stopFn }; }

  /* ---------- Hero "Try it" ---------- */
  var tryBtn = $('.hv3-try');
  if (tryBtn) {
    var tryAudio = new Audio(); tryAudio.preload = 'none'; tryAudio.src = tryBtn.getAttribute('data-audio');
    var tryTime = $('.hv3-try__time', tryBtn);
    var stopTry = function () { tryAudio.pause(); tryBtn.classList.remove('is-playing'); };
    tryBtn.addEventListener('click', function () {
      if (tryAudio.paused) { claim(tryAudio, stopTry); tryAudio.play(); tryBtn.classList.add('is-playing'); tryTime.hidden = false; }
      else stopTry();
    });
    tryAudio.addEventListener('timeupdate', function () { tryTime.textContent = fmt(tryAudio.currentTime) + ' / ' + fmt(tryAudio.duration); });
    tryAudio.addEventListener('ended', function () { stopTry(); tryAudio.currentTime = 0; });
  }

  /* ---------- Hear the difference ---------- */
  var voice = $('.hv3-voice');
  if (voice) {
    var vAudio = new Audio(); vAudio.preload = 'metadata';
    var which = 'revo';
    vAudio.src = voice.getAttribute('data-revo');
    var fill = $('.hv3-progress__fill', voice), knob = $('.hv3-progress__knob', voice), bar = $('.hv3-progress', voice);
    var cur = $('.cur', voice), dur = $('.dur', voice);
    var stopV = function () { vAudio.pause(); voice.classList.remove('is-playing'); };
    var draw = function () {
      var p = vAudio.duration ? vAudio.currentTime / vAudio.duration * 100 : 0;
      fill.style.width = p + '%'; knob.style.left = p + '%'; bar.setAttribute('aria-valuenow', Math.round(p));
      cur.textContent = fmt(vAudio.currentTime);
    };
    vAudio.addEventListener('loadedmetadata', function () { dur.textContent = fmt(vAudio.duration); draw(); });
    vAudio.addEventListener('timeupdate', draw);
    vAudio.addEventListener('ended', function () { stopV(); vAudio.currentTime = 0; draw(); });
    $('.hv3-voice__play', voice).addEventListener('click', function () {
      if (vAudio.paused) { claim(vAudio, stopV); vAudio.play(); voice.classList.add('is-playing'); } else stopV();
    });
    $$('[data-skip]', voice).forEach(function (b) {
      b.addEventListener('click', function () { vAudio.currentTime = Math.max(0, Math.min((vAudio.duration || 0), vAudio.currentTime + Number(b.getAttribute('data-skip')))); });
    });
    var seek = function (e) { var r = bar.getBoundingClientRect(); if (vAudio.duration) vAudio.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * vAudio.duration; };
    bar.addEventListener('click', seek);
    bar.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') vAudio.currentTime += 5; if (e.key === 'ArrowLeft') vAudio.currentTime -= 5; });
    var toggle = $('.hv3-voice__toggle', voice);
    toggle.addEventListener('click', function () {
      var playing = !vAudio.paused, t = vAudio.currentTime;
      which = which === 'revo' ? 'robot' : 'revo';
      voice.setAttribute('data-voice', which);
      toggle.setAttribute('aria-pressed', which === 'revo' ? 'true' : 'false');
      toggle.setAttribute('aria-label', which === 'revo' ? 'Revo voice on. Switch to the robot voice' : 'Robot voice on. Switch to the Revo voice');
      vAudio.src = voice.getAttribute('data-' + which);
      vAudio.addEventListener('loadedmetadata', function once() { vAudio.removeEventListener('loadedmetadata', once); vAudio.currentTime = Math.min(t, vAudio.duration || t); if (playing) vAudio.play(); });
    });
    var banner = $('.hv3-voice__banner img.bg', voice), title = $('.hv3-voice__title', voice);
    $$('.hv3-hear__menu .hv3-trade-btn').forEach(function (b, i, all) {
      b.addEventListener('click', function () {
        all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        banner.src = b.getAttribute('data-banner'); title.textContent = b.getAttribute('data-name');
      });
    });
  }

  /* ---------- Built for home services: trade showcase ---------- */
  var show = $('.hv3-showcase');
  if (show) {
    var photo = $('.hv3-showcase__photo img.bg', show), quote = $('[data-quote]', show), steps = $('[data-steps]', show);
    $$('.hv3-pick__btn', show).forEach(function (b, i, all) {
      b.addEventListener('click', function () {
        all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        photo.src = b.getAttribute('data-photo');
        quote.textContent = b.getAttribute('data-quote');
        steps.innerHTML = JSON.parse(b.getAttribute('data-steps')).map(function (s, n) { return '<li><b>' + (n + 1) + '</b>' + s.replace(/</g, '&lt;') + '</li>'; }).join('');
      });
    });
  }

  /* ---------- Hear a sample call ---------- */
  var sample = $('.hv3-sample');
  var cfg = (typeof HEAR_SAMPLE_CONFIG !== 'undefined') ? HEAR_SAMPLE_CONFIG : null;
  if (sample && cfg) {
    var sAudio = new Audio(); sAudio.preload = 'metadata'; sAudio.volume = 0.7;
    var list = $('.hv3-transcript', sample), titleEl = $('[data-title]', sample), photoEl = $('.hv3-sample__photo img', sample);
    var sCur = $('.hv3-player .cur', sample), sDur = $('.hv3-player .dur', sample), track = $('.hv3-player__track', sample), trackFill = $('i', track);
    var defaultPhoto = photoEl.getAttribute('src');
    var msgs = [];
    var stopS = function () { sAudio.pause(); sample.classList.remove('is-playing'); };
    var render = function (key) {
      var c = cfg[key]; if (!c) return;
      stopS();
      titleEl.textContent = c.title;
      photoEl.src = key === 'home' ? defaultPhoto : c.image;
      list.innerHTML = '';
      msgs = c.messages.map(function (m) {
        var el = document.createElement('div');
        var agent = m.type === 'agent';
        el.className = 'hv3-msg ' + (agent ? 'hv3-msg--agent' : 'hv3-msg--client');
        el.innerHTML = '<div class="hv3-msg__who"><img src="/images/home-v3/sample-avatar-' + (agent ? 'agent' : 'customer') + '.png" alt="">' + (agent ? 'Revo Agent' : 'Customer') + '</div><div class="hv3-msg__text"></div>';
        el.querySelector('.hv3-msg__text').textContent = m.text;
        list.appendChild(el);
        return { t: m.time, el: el };
      });
      sAudio.src = c.audio.replace(/^\.\//, '/');
      sync();
    };
    var sync = function () {
      var t = sAudio.currentTime, started = t > 0 || !sAudio.paused, last = null;
      msgs.forEach(function (m, i) {
        var show = !started ? i < 3 : m.t <= t + 0.2;
        m.el.classList.toggle('is-future', !show);
        if (show) last = m.el;
      });
      if (started && last) list.scrollTop = last.offsetTop - list.offsetTop - 40;
      sCur.textContent = fmt(t);
      trackFill.style.width = (sAudio.duration ? t / sAudio.duration * 100 : 0) + '%';
    };
    sAudio.addEventListener('loadedmetadata', function () { sDur.textContent = fmt(sAudio.duration); });
    sAudio.addEventListener('timeupdate', sync);
    sAudio.addEventListener('ended', function () { stopS(); });
    sAudio.addEventListener('error', function () { sDur.textContent = 'audio not available'; });
    $('.hv3-player__play', sample).addEventListener('click', function () {
      if (sAudio.paused) { claim(sAudio, stopS); sAudio.play(); sample.classList.add('is-playing'); } else stopS();
    });
    track.addEventListener('click', function (e) { var r = track.getBoundingClientRect(); if (sAudio.duration) { sAudio.currentTime = (e.clientX - r.left) / r.width * sAudio.duration; sync(); } });
    $('.hv3-player__vol input', sample).addEventListener('input', function (e) { sAudio.volume = Number(e.target.value); });
    var tabs = $$('.hv3-sample__tab', sample);
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        render(b.getAttribute('data-key'));
      });
    });
    render('home');
  }

  /* ---------- Info tips on the app cards (tap on touch screens) ---------- */
  $$('.hv3-info').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); });
    b.addEventListener('blur', function () { b.setAttribute('aria-expanded', 'false'); });
  });
})();
