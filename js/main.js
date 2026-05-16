/* ============================================
   Main JavaScript - Forms & Utilities
   ============================================ */

// Newsletter Form Validation
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  const emailInput = newsletterForm.querySelector('input[type="email"]');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove previous error state
    emailInput.classList.remove('error');

    if (!email) {
      showMessage('Please enter your email address', 'error');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    // Success - handle submission
    showMessage('Thank you for subscribing!', 'success');
    emailInput.value = '';
    emailInput.classList.remove('error');

    // Here you would typically send the data to your backend
    console.log('Email submitted:', email);
  });

  // Clear error state on input
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
  });
}

// Message Display Function
function showMessage(message, type) {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(messageEl);

  // Remove after 3 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(messageEl);
    }, 300);
  }, 3000);
}

// Lazy Loading Images (if not using native lazy loading)
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if ('IntersectionObserver' in window) {
  lazyLoadImages();
}

// Lazy load Rive animation when features section becomes visible
function initRiveAnimationLazyLoad() {
  const featuresSection = document.querySelector('#services.features');
  const riveIframe = document.querySelector('.dashboard-rive-animation');
  
  if (!featuresSection || !riveIframe) {
    return;
  }
  
  // Check if iframe has already been loaded
  if (riveIframe.src) {
    riveIframe.classList.add('loaded');
    return;
  }
  
  // Create Intersection Observer for the features section
  const riveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Section is visible - load the iframe
        const dataSrc = riveIframe.getAttribute('data-src');
        if (dataSrc && !riveIframe.src) {
          riveIframe.src = dataSrc;
          riveIframe.removeAttribute('data-src');
          riveIframe.classList.add('loaded');
        }
        // Stop observing after loading
        riveObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Start observing the features section
  riveObserver.observe(featuresSection);
}

// Initialize Rive animation lazy loading
if ('IntersectionObserver' in window) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRiveAnimationLazyLoad);
  } else {
    initRiveAnimationLazyLoad();
  }
}

// Prevent default for dummy links (links with href="#")
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

// Performance Monitoring (Optional - for development)
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    console.log('Page Load Time:', pageLoadTime + 'ms');

    // You can send this to analytics
  });
}

// Accessibility: Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
  body:not(.keyboard-nav) *:focus {
    outline: none;
  }

  body.keyboard-nav *:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;
document.head.appendChild(focusStyle);

// Allow scroll to pass through hero Spline viewer
function allowScrollThroughHeroSpline() {
  const heroSection = document.querySelector('.hero');
  const heroSplineViewer = heroSection ? heroSection.querySelector('.hero-spline-viewer') : null;

  if (heroSection && heroSplineViewer) {
    // Simply ensure pointer events don't block scroll
    // The browser's native scroll should work, we just need to make sure
    // Spline doesn't capture it exclusively
    
    // Wait for Spline viewer to be fully loaded
    heroSplineViewer.addEventListener('loaded', () => {
      console.log('Hero Spline viewer loaded');
    });

    // If already loaded (e.g., on page refresh), log it
    if (heroSplineViewer.hasAttribute('loaded')) {
      console.log('Hero Spline viewer already loaded');
    }
  }
}

// Initialize hero Spline with lazy loading and performance optimization
function initHeroSplineOptimization() {
  const heroSection = document.querySelector('.hero');
  const heroSplineViewer = heroSection ? heroSection.querySelector('.hero-spline-viewer') : null;
  
  if (!heroSection || !heroSplineViewer) {
    console.warn('Hero section or Spline viewer not found');
    return;
  }

  // Protect mobile and data-saver users from heavy 3D runtime on first load.
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!isDesktop || reducedMotion || saveData) {
    heroSplineViewer.style.display = 'none';
    return;
  }

  let splineScriptLoaded = false;
  let splineViewerLoaded = false;

  // Function to load Spline viewer script lazily
  function loadSplineScript() {
    if (splineScriptLoaded) return;
    
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      const splineScript = document.createElement('script');
      splineScript.type = 'module';
      splineScript.src = 'https://unpkg.com/@splinetool/viewer@1.12.29/build/spline-viewer.js';
      splineScript.onload = () => {
        console.log('Hero Spline viewer script loaded');
        splineScriptLoaded = true;
        // Viewer is already visible via CSS, just enable it
        setTimeout(() => {
          // Wait for viewer to be ready
          if (heroSplineViewer.hasAttribute('loaded')) {
            enableSplineViewer();
          } else {
            heroSplineViewer.addEventListener('loaded', enableSplineViewer, { once: true });
          }
        }, 100);
      };
      document.head.appendChild(splineScript);
      console.log('Hero Spline viewer script loading...');
    } else {
      splineScriptLoaded = true;
    }
  }

  // Function to show/hide Spline viewer (hiding pauses rendering)
  function toggleSplineViewer(visible) {
    if (visible) {
      heroSection.classList.add('hero-spline-visible');
      heroSplineViewer.style.display = 'block';
    } else {
      heroSection.classList.remove('hero-spline-visible');
      heroSplineViewer.style.display = 'none';
    }
  }

  // Enable Spline viewer after it's loaded
  function enableSplineViewer() {
    splineViewerLoaded = true;
    allowScrollThroughHeroSpline();
    console.log('Hero Spline viewer enabled');
  }

  // Keep hero visible, but postpone heavy 3D runtime initialization.
  toggleSplineViewer(true);
  const scheduleSplineLoad = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadSplineScript, { timeout: 2500 });
    } else {
      setTimeout(loadSplineScript, 1500);
    }
  };
  scheduleSplineLoad();
  
  // Use IntersectionObserver to pause Spline when hero is not visible (for performance)
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px 0px 0px'
    };

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Hero is visible - show Spline
          toggleSplineViewer(true);
        } else {
          // Hero is not visible - hide and pause Spline to save resources
          toggleSplineViewer(false);
        }
      });
    }, observerOptions);

    // Start observing the hero section
    heroObserver.observe(heroSection);
  }
}

// Initialize hero Spline optimization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeroSplineOptimization, 100);
  });
} else {
  setTimeout(initHeroSplineOptimization, 100);
}

// How It Works — background `<video>` (class name kept for CSS). Older builds hid this on non-desktop for Spline.
function initHowItWorksSplineOptimization() {
  const howItWorksSection = document.querySelector('.how-it-works');
  const bg = howItWorksSection ? howItWorksSection.querySelector('.how-it-works-spline-viewer') : null;

  if (!howItWorksSection || !bg) return;

  if (bg.tagName !== 'VIDEO') return;

  const video = bg;
  video.style.removeProperty('display');

  const restartAndPlay = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    try {
      video.currentTime = 0;
    } catch (e) {
      /* ignore */
    }
    video.play().catch(() => {});
  };

  restartAndPlay();

  if (!('IntersectionObserver' in window)) return;

  const howItWorksObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) restartAndPlay();
        else video.pause();
      });
    },
    { threshold: 0.1, rootMargin: '50px 0px' }
  );

  howItWorksObserver.observe(howItWorksSection);
}

// Home hero background video — pause off-screen, restart from start when section returns
function initHeroBackgroundVideo() {
  const hero = document.querySelector('.hero');
  const video = hero ? hero.querySelector('video.hero-video') : null;
  if (!hero || !video || hero.hasAttribute('data-inview-video-bound')) return;
  hero.setAttribute('data-inview-video-bound', 'true');

  const restartAndPlay = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    try {
      video.currentTime = 0;
    } catch (e) {
      /* ignore */
    }
    video.play().catch(() => {});
  };

  restartAndPlay();

  if (!('IntersectionObserver' in window)) return;

  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) restartAndPlay();
        else video.pause();
      });
    },
    { threshold: 0.1, rootMargin: '0px' }
  ).observe(hero);
}

// Initialize How It Works background video when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHowItWorksSplineOptimization, 200);
    setTimeout(initHeroBackgroundVideo, 200);
  });
} else {
  setTimeout(initHowItWorksSplineOptimization, 200);
  setTimeout(initHeroBackgroundVideo, 200);
}

/**
 * Homepage — Revo Voice Technology: synchronized A/B playback (dual audio, single timeline).
 * Swap `data-rvt-src-generic` / `data-rvt-src-revo` on `#revo_voice_technology` for matched-length assets.
 */
function initRevoVoiceTechnology() {
  const root = document.getElementById('revo_voice_technology');
  if (!root) return;

  const audioGeneric = root.querySelector('audio[data-rvt-audio="generic"]');
  const audioRevo = root.querySelector('audio[data-rvt-audio="revo"]');
  const playBtn = root.querySelector('[data-rvt-play]');
  const progressTrack = root.querySelector('[data-rvt-progress]');
  const progressFill = root.querySelector('[data-rvt-fill]');
  const elCurrent = root.querySelector('[data-rvt-current]');
  const elDuration = root.querySelector('[data-rvt-duration]');
  const toggleBtn = root.querySelector('[data-rvt-switch]');
  const labelGeneric = root.querySelector('[data-rvt-label-generic]');
  const labelRevo = root.querySelector('[data-rvt-label-revo]');
  const playerCard = root.querySelector('[data-rvt-player]');

  if (!audioGeneric || !audioRevo || !playBtn || !progressTrack || !progressFill || !elCurrent || !elDuration || !toggleBtn || !labelGeneric || !labelRevo || !playerCard) {
    return;
  }

  const srcGeneric = root.dataset.rvtSrcGeneric || '';
  const srcRevo = root.dataset.rvtSrcRevo || '';
  if (srcGeneric) audioGeneric.src = srcGeneric;
  if (srcRevo) audioRevo.src = srcRevo;
  try {
    audioGeneric.load();
    audioRevo.load();
  } catch (e) {
    /* ignore */
  }

  let activeKey = 'generic';
  let isPlaying = false;
  let rafId = 0;
  let scrubPointerId = null;
  let pendingSeekRatio = null;
  let durationWaitersAttached = false;

  function getActiveAudio() {
    return activeKey === 'revo' ? audioRevo : audioGeneric;
  }

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getSyncDuration() {
    const dG = audioGeneric.duration;
    const dR = audioRevo.duration;
    const gOk = Number.isFinite(dG) && dG > 0;
    const rOk = Number.isFinite(dR) && dR > 0;
    if (gOk && rOk) return Math.min(dG, dR);
    if (rOk) return dR;
    if (gOk) return dG;
    return 0;
  }

  /** Duración usable para seek (fallbacks si un MP3 aún no expone duration tras cold load / Ctrl+F5). */
  function getSeekDuration() {
    let d = getSyncDuration();
    if (d > 0) return d;
    const a = audioGeneric.duration;
    const b = audioRevo.duration;
    if (Number.isFinite(a) && a > 0 && Number.isFinite(b) && b > 0) {
      return Math.max(a, b);
    }
    if (Number.isFinite(a) && a > 0) return a;
    if (Number.isFinite(b) && b > 0) return b;
    const m = getActiveAudio().duration;
    return Number.isFinite(m) && m > 0 ? m : 0;
  }

  function syncInactiveToActive() {
    const master = getActiveAudio();
    const slave = activeKey === 'revo' ? audioGeneric : audioRevo;
    const dt = Math.abs(slave.currentTime - master.currentTime);
    if (dt > 0.06) {
      try {
        slave.currentTime = master.currentTime;
      } catch (e) {
        /* ignore */
      }
    }
  }

  function applyOutputRouting() {
    audioGeneric.muted = activeKey !== 'generic';
    audioRevo.muted = activeKey !== 'revo';
    syncInactiveToActive();
  }

  function updateToggleUI() {
    const isRevo = activeKey === 'revo';
    toggleBtn.setAttribute('aria-checked', String(isRevo));
    root.classList.toggle('rvt-revo-active', isRevo);
    labelGeneric.classList.toggle('rvt-toggle-label--active', !isRevo);
    labelRevo.classList.toggle('rvt-toggle-label--active', isRevo);
  }

  function updateProgressUI() {
    const master = getActiveAudio();
    const dur = getSyncDuration();
    const t = Number.isFinite(master.currentTime) ? master.currentTime : 0;
    const end = dur > 0 ? dur : (Number.isFinite(master.duration) && master.duration > 0 ? master.duration : 0);
    const shownT = end > 0 ? Math.min(t, end) : t;
    elCurrent.textContent = formatTime(shownT);
    if (end > 0) {
      elDuration.textContent = formatTime(end);
    }
    const pct = end > 0 ? Math.min(100, (shownT / end) * 100) : 0;
    progressFill.style.width = `${pct}%`;
    progressTrack.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function tick() {
    if (!isPlaying) return;
    const dur = getSyncDuration();
    const master = getActiveAudio();
    if (dur > 0 && master.currentTime >= dur - 0.06) {
      try {
        audioGeneric.currentTime = dur;
        audioRevo.currentTime = dur;
      } catch (e) {
        /* ignore */
      }
      audioGeneric.pause();
      audioRevo.pause();
      setPlaying(false);
      updateProgressUI();
      return;
    }
    syncInactiveToActive();
    updateProgressUI();
    rafId = requestAnimationFrame(tick);
  }

  function setPlaying(next) {
    isPlaying = next;
    playerCard.classList.toggle('rvt-is-playing', next);
    playBtn.setAttribute('aria-label', next ? 'Pause audio comparison' : 'Play audio comparison');
    cancelAnimationFrame(rafId);
    if (next) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function playBoth() {
    applyOutputRouting();
    return Promise.allSettled([audioGeneric.play(), audioRevo.play()]);
  }

  function pauseBoth() {
    audioGeneric.pause();
    audioRevo.pause();
  }

  function removeDurationSeekWaiters(bump) {
    ['loadedmetadata', 'durationchange', 'canplay'].forEach((evt) => {
      audioGeneric.removeEventListener(evt, bump);
      audioRevo.removeEventListener(evt, bump);
    });
    durationWaitersAttached = false;
  }

  function applySeekRatio(ratio) {
    const dur = getSeekDuration();
    if (!(dur > 0)) return false;
    const r = Math.min(1, Math.max(0, ratio));
    const t = r * dur;
    if (!Number.isFinite(t) || t < 0) return false;
    try {
      audioGeneric.currentTime = t;
      audioRevo.currentTime = t;
    } catch (e) {
      /* ignore */
    }
    updateProgressUI();
    return true;
  }

  function seekFromClientX(clientX) {
    if (!Number.isFinite(clientX)) return;
    const rect = progressTrack.getBoundingClientRect();
    const w = rect.width;
    if (!(w > 0)) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / w));

    pendingSeekRatio = ratio;
    if (applySeekRatio(ratio)) {
      pendingSeekRatio = null;
      return;
    }

    if (durationWaitersAttached) return;
    durationWaitersAttached = true;
    const bump = () => {
      if (pendingSeekRatio == null) {
        removeDurationSeekWaiters(bump);
        return;
      }
      if (applySeekRatio(pendingSeekRatio)) {
        pendingSeekRatio = null;
        removeDurationSeekWaiters(bump);
      }
    };
    ['loadedmetadata', 'durationchange', 'canplay'].forEach((evt) => {
      audioGeneric.addEventListener(evt, bump);
      audioRevo.addEventListener(evt, bump);
    });
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseBoth();
      setPlaying(false);
      return;
    }
    const dur = getSyncDuration();
    if (dur > 0 && getActiveAudio().currentTime >= dur - 0.2) {
      try {
        audioGeneric.currentTime = 0;
        audioRevo.currentTime = 0;
      } catch (e) {
        /* ignore */
      }
    }
    playBoth().then((results) => {
      const blocked = results.some((r) => r.status === 'rejected');
      if (blocked) {
        setPlaying(false);
        return;
      }
      setPlaying(true);
    });
  });

  toggleBtn.addEventListener('click', () => {
    activeKey = activeKey === 'revo' ? 'generic' : 'revo';
    applyOutputRouting();
    updateToggleUI();
  });

  function onLoadedMeta() {
    updateProgressUI();
  }
  audioGeneric.addEventListener('loadedmetadata', onLoadedMeta);
  audioRevo.addEventListener('loadedmetadata', onLoadedMeta);

  progressTrack.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    scrubPointerId = e.pointerId;
    try {
      progressTrack.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
    seekFromClientX(e.clientX);
  });

  progressTrack.addEventListener('pointermove', (e) => {
    if (scrubPointerId !== e.pointerId) return;
    seekFromClientX(e.clientX);
  });

  function endScrub(e) {
    if (scrubPointerId !== e.pointerId) return;
    scrubPointerId = null;
    try {
      progressTrack.releasePointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  }
  progressTrack.addEventListener('pointerup', endScrub);
  progressTrack.addEventListener('pointercancel', endScrub);

  progressTrack.addEventListener('keydown', (e) => {
    const dur = getSeekDuration();
    if (dur <= 0) return;
    const step = 5;
    let t = getActiveAudio().currentTime;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      t = Math.max(0, t - step);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      t = Math.min(dur, t + step);
    } else {
      return;
    }
    try {
      audioGeneric.currentTime = t;
      audioRevo.currentTime = t;
    } catch (err) {
      /* ignore */
    }
    updateProgressUI();
  });

  applyOutputRouting();
  updateToggleUI();
  updateProgressUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRevoVoiceTechnology);
} else {
  initRevoVoiceTechnology();
}