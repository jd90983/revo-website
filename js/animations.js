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

// ===== SMOOTH BACKGROUND TRANSITION: GET STARTED FORM TO CUSTOMER TRUST =====
// Transitions the get-started-form section background from black to gray as user scrolls
const initGetStartedFormTransition = () => {
  const getStartedFormSection = document.querySelector('.get-started-form-section');
  const customerTrustSection = document.querySelector('.customer-trust-section');
  
  if (!getStartedFormSection || !customerTrustSection) return;

  const updateBackgroundTransition = () => {
    const windowHeight = window.innerHeight;
    const getStartedFormRect = getStartedFormSection.getBoundingClientRect();
    
    // Get the bottom of get-started-form section relative to viewport
    const getStartedFormBottom = getStartedFormRect.bottom;
    
    // Calculate when transition should start (when section bottom is visible)
    // Transition starts when section bottom reaches viewport
    // Transition completes when section bottom is at 50% of viewport
    const transitionStart = windowHeight;
    const transitionEnd = windowHeight * 0.5;
    const transitionRange = transitionStart - transitionEnd;
    
    let opacity = 0;
    
    if (getStartedFormBottom <= transitionStart && getStartedFormBottom >= transitionEnd) {
      // Section is in the transition range
      opacity = (transitionStart - getStartedFormBottom) / transitionRange;
      opacity = Math.max(0, Math.min(1, opacity)); // Clamp between 0 and 1
    } else if (getStartedFormBottom < transitionEnd) {
      // Transition complete - fully gray
      opacity = 1;
    } else {
      // Before transition - fully black
      opacity = 0;
    }
    
    // Apply opacity to the ::after pseudo-element via CSS custom property
    getStartedFormSection.style.setProperty('--transition-opacity', opacity);
  };

  // Update CSS to use the custom property for opacity
  const style = document.createElement('style');
  style.textContent = `
    .get-started-form-section::after {
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
  document.addEventListener('DOMContentLoaded', initGetStartedFormTransition);
} else {
  initGetStartedFormTransition();
}

// ===== SCROLL-TRIGGERED COUNTER ANIMATION =====
// Counts up from 0 to target number when section comes into view
const initCounterAnimation = () => {
  const statNumbers = document.querySelectorAll('.performance-stat-number[data-target]');

  if (!statNumbers.length) {
    console.log('No stat numbers found');
    return;
  }

  console.log('Counter animation initialized, found', statNumbers.length, 'stat numbers');

  // Animation configuration
  const duration = 2000; // 2 seconds for the count animation
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);

  // Easing function for smooth animation (ease-out)
  const easeOutQuad = (t) => t * (2 - t);

  // Function to animate a single counter
  const animateCounter = (element) => {
    const target = parseInt(element.dataset.target, 10);
    console.log('Animating counter to', target);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentValue = Math.round(target * progress);

      element.textContent = currentValue + '%';

      if (frame === totalFrames) {
        clearInterval(counter);
        element.textContent = target + '%';
      }
    }, frameDuration);
  };

  // Create intersection observer for the stats row (more specific target)
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      console.log('Intersection observed:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
      if (entry.isIntersecting) {
        // Get all stat numbers within this section
        const statsInView = entry.target.querySelectorAll('.performance-stat-number[data-target]');
        console.log('Stats in view:', statsInView.length);

        // Start animation for each stat with a slight stagger
        statsInView.forEach((stat, index) => {
          setTimeout(() => {
            animateCounter(stat);
          }, index * 200); // 200ms delay between each counter
        });

        // Only animate once
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of section is visible
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe the performance stats section
  const statsSection = document.querySelector('.ai-performance-section');
  if (statsSection) {
    console.log('Observing ai-performance-section');
    counterObserver.observe(statsSection);
  } else {
    console.log('ai-performance-section not found');
  }
};

// Initialize counter animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCounterAnimation);
} else {
  initCounterAnimation();
}

// ===== MAIN TESTIMONIALS SLIDER =====
const initMainTestimonialsSlider = () => {
  const testimonialsGrid = document.querySelector('.main-testimonials-grid');
  const dots = document.querySelectorAll('.main-dot');
  const testimonials = document.querySelectorAll('.main-testimonial-column');
  const prevBtn = document.querySelector('.main-slider-btn-prev');
  const nextBtn = document.querySelector('.main-slider-btn-next');

  if (!testimonialsGrid || !dots.length || !testimonials.length) {
    return;
  }

  let currentIndex = 0;

  // Function to update active dot
  const updateDots = (index) => {
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('main-dot-active');
      } else {
        dot.classList.remove('main-dot-active');
      }
    });
  };

  // Function to scroll to testimonial
  const scrollToTestimonial = (index) => {
    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;
    
    currentIndex = index;
    const testimonial = testimonials[index];
    const scrollPosition = testimonial.offsetLeft - testimonialsGrid.offsetLeft;
    
    testimonialsGrid.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    updateDots(index);
  };

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      scrollToTestimonial(index);
    });
  });

  // Previous button handler
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToTestimonial(currentIndex - 1);
    });
  }

  // Next button handler
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToTestimonial(currentIndex + 1);
    });
  }

  // Update dots on scroll
  testimonialsGrid.addEventListener('scroll', () => {
    const scrollLeft = testimonialsGrid.scrollLeft;
    
    // Find which testimonial is most visible
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    testimonials.forEach((testimonial, index) => {
      const testimonialLeft = testimonial.offsetLeft - testimonialsGrid.offsetLeft;
      const distance = Math.abs(scrollLeft - testimonialLeft);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== currentIndex) {
      currentIndex = closestIndex;
      updateDots(closestIndex);
    }
  });
};

// Initialize main testimonials slider when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMainTestimonialsSlider);
} else {
  initMainTestimonialsSlider();
}