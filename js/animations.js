/* ============================================
   Animations - Scroll-based Animations
   ============================================ */

// Intersection Observer for Fade-in Animations on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      // Optionally unobserve after animating (animate only once)
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections except the first one (hero is already visible)
const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
  // Skip the first section (hero)
  if (index > 0) {
    observer.observe(section);
  }
});

// Optional: Add stagger effect to cards within sections
const addStaggerEffect = () => {
  const cardContainers = document.querySelectorAll('.features-grid, .how-it-works-grid, .stats-grid, .testimonials-grid');

  cardContainers.forEach(container => {
    const cards = container.querySelectorAll('.feature-card, .how-card, .stat-card, .testimonial-card');

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });

    // Observe the container
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.feature-card, .how-card, .stat-card, .testimonial-card');
          cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    cardObserver.observe(container);
  });
};

// Initialize stagger effect when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addStaggerEffect);
} else {
  addStaggerEffect();
}

// Parallax effect for hero background - REMOVED
// const hero = document.querySelector('.hero');
// const heroBackground = document.querySelector('.hero-background');

// if (hero && heroBackground) {
//   window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const heroHeight = hero.offsetHeight;

//     // Only apply parallax when hero is visible
//     if (scrolled < heroHeight) {
//       const parallaxSpeed = 0.5;
//       heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
//     }
//   });
// }

// ===== SCROLL-TRIGGERED TEXT REVEAL ANIMATION (WORD BY WORD) =====
// Word-by-word reveal animation controlled by scroll progress
const initTextReveal = () => {
  const heading = document.querySelector('.efficiency-heading');
  
  if (!heading) return;

  // Store original text
  const originalText = heading.textContent.trim();
  
  // Split text into words, preserving spaces and punctuation
  const words = originalText.split(/(\s+)/);
  
  // Clear existing content
  heading.innerHTML = '';
  
  const wordElements = [];
  let wordIndex = 0;
  
  // Create word wrappers for actual words (skip spaces)
  words.forEach((segment) => {
    if (segment.trim() === '') {
      // Preserve spaces
      heading.appendChild(document.createTextNode(segment));
    } else {
      // Create wrapper for each word
      const wordSpan = document.createElement('span');
      wordSpan.className = 'reveal-word';
      wordSpan.textContent = segment;
      wordSpan.dataset.wordIndex = wordIndex;
      
      heading.appendChild(wordSpan);
      wordElements.push(wordSpan);
      wordIndex++;
    }
  });

  // Store word elements for scroll handler
  heading._wordElements = wordElements;
  heading._totalWords = wordElements.length;

  // Function to update word visibility based on scroll progress
  const updateWordReveal = () => {
    const section = heading.closest('.efficiency-section');
    if (!section) return;

    const windowHeight = window.innerHeight;
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionBottom = sectionRect.bottom;

    // Calculate scroll progress through the section
    // Animation starts when section top is at 70% of viewport
    // Animation completes when section top is at 20% of viewport
    const startPoint = windowHeight * 0.7; // Animation starts here
    const endPoint = windowHeight * 0.2; // Animation ends here
    const range = startPoint - endPoint;

    let progress = 0;

    if (sectionTop <= startPoint && sectionTop >= endPoint) {
      // Section is in the animation range
      progress = (startPoint - sectionTop) / range;
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
    } else if (sectionTop < endPoint) {
      // Section has passed the end point - all words visible
      progress = 1;
    } else {
      // Section hasn't reached start point - no words visible
      progress = 0;
    }

    // Calculate how many words should be visible based on progress
    const wordsToShow = Math.floor(progress * wordElements.length);

    // Update each word's visibility
    wordElements.forEach((wordEl, index) => {
      if (index < wordsToShow) {
        wordEl.classList.add('revealed');
      } else {
        wordEl.classList.remove('revealed');
      }
    });
  };

  // Throttle scroll events for performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateWordReveal();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Initial check
  updateWordReveal();

  // Listen to scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
};

// Initialize text reveal animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextReveal);
} else {
  initTextReveal();
}

// ===== SMOOTH BACKGROUND TRANSITION ON SCROLL =====
// Transitions the efficiency section background from black to gray as user scrolls
const initBackgroundTransition = () => {
  const efficiencySection = document.querySelector('.efficiency-section');
  const customerTrustSection = document.querySelector('.customer-trust-section');
  
  if (!efficiencySection || !customerTrustSection) return;

  const updateBackgroundTransition = () => {
    const windowHeight = window.innerHeight;
    const efficiencyRect = efficiencySection.getBoundingClientRect();
    const customerTrustRect = customerTrustSection.getBoundingClientRect();
    
    // Get the bottom of efficiency section relative to viewport
    const efficiencyBottom = efficiencyRect.bottom;
    
    // Calculate when transition should start (when efficiency bottom is visible)
    // Transition starts when efficiency section bottom reaches viewport
    // Transition completes when efficiency section bottom is at 50% of viewport
    const transitionStart = windowHeight;
    const transitionEnd = windowHeight * 0.5;
    const transitionRange = transitionStart - transitionEnd;
    
    let opacity = 0;
    
    if (efficiencyBottom <= transitionStart && efficiencyBottom >= transitionEnd) {
      // Section is in the transition range
      opacity = (transitionStart - efficiencyBottom) / transitionRange;
      opacity = Math.max(0, Math.min(1, opacity)); // Clamp between 0 and 1
    } else if (efficiencyBottom < transitionEnd) {
      // Transition complete - fully gray
      opacity = 1;
    } else {
      // Before transition - fully black
      opacity = 0;
    }
    
    // Apply opacity to the ::after pseudo-element via CSS custom property
    efficiencySection.style.setProperty('--transition-opacity', opacity);
  };

  // Update CSS to use the custom property for opacity
  const style = document.createElement('style');
  style.textContent = `
    .efficiency-section::after {
      opacity: var(--transition-opacity, 0);
    }
  `;
  document.head.appendChild(style);

  // Throttle scroll events for performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBackgroundTransition();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Initial check
  updateBackgroundTransition();

  // Listen to scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
};

// Initialize background transition when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundTransition);
} else {
  initBackgroundTransition();
}
