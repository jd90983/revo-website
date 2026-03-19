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

// Initialize How It Works Spline optimization for performance
function initHowItWorksSplineOptimization() {
  const howItWorksSection = document.querySelector('.how-it-works');
  const howItWorksSplineViewer = howItWorksSection ? howItWorksSection.querySelector('.how-it-works-spline-viewer') : null;
  
  if (!howItWorksSection || !howItWorksSplineViewer) {
    return;
  }

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!isDesktop || reducedMotion || saveData) {
    howItWorksSplineViewer.style.display = 'none';
    return;
  }

  // Load Spline viewer script if not already loaded (hero no longer uses Spline, so we load it here for How It Works)
  if (!document.querySelector('script[src*="spline-viewer"]')) {
    const splineScript = document.createElement('script');
    splineScript.type = 'module';
    splineScript.src = 'https://unpkg.com/@splinetool/viewer@1.12.29/build/spline-viewer.js';
    document.head.appendChild(splineScript);
  }

  // Function to show/hide Spline viewer (hiding pauses rendering)
  function toggleHowItWorksSplineViewer(visible) {
    if (visible) {
      howItWorksSplineViewer.style.display = 'block';
    } else {
      howItWorksSplineViewer.style.display = 'none';
    }
  }

  // Use IntersectionObserver to pause Spline when section is not visible (for performance)
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px 0px 50px 0px' // Start loading slightly before section is visible
    };

    const howItWorksObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Section is visible - show Spline
          toggleHowItWorksSplineViewer(true);
        } else {
          // Section is not visible - hide and pause Spline to save resources
          toggleHowItWorksSplineViewer(false);
        }
      });
    }, observerOptions);

    // Start observing the how-it-works section
    howItWorksObserver.observe(howItWorksSection);
    
    // Initially hide if not visible
    const rect = howItWorksSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) {
      toggleHowItWorksSplineViewer(false);
    }
  }
}

// Initialize How It Works Spline optimization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHowItWorksSplineOptimization, 200);
  });
} else {
  setTimeout(initHowItWorksSplineOptimization, 200);
}