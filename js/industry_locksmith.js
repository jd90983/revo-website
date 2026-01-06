// Industry Locksmith Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // ===== SCROLL ANIMATIONS FOR SECTIONS =====
  // Intersection Observer for Fade-in Animations on Scroll
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Optionally unobserve after animating (animate only once)
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Function to initialize animations for sections
    const initSectionAnimations = () => {
      // Observe all sections except the first one (hero is already visible)
      const sections = document.querySelectorAll('main section');
      sections.forEach((section, index) => {
        // Skip the first section (hero) and sections that are already observed
        if (index > 0 && !section.classList.contains('animate-in') && !section.hasAttribute('data-animation-initialized')) {
          // Ensure initial state for animation
          section.style.opacity = '0';
          section.style.transform = 'translateY(30px)';
          section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          section.setAttribute('data-animation-initialized', 'true');
          sectionObserver.observe(section);
        }
      });
    };

    // Initialize animations immediately
    initSectionAnimations();

    // Re-initialize animations after templates are loaded (with a delay to ensure DOM is updated)
    setTimeout(() => {
      initSectionAnimations();
    }, 500);

    // ===== STAGGER EFFECT FOR CARDS AND GRIDS =====
    // Add stagger effect to cards within sections
    const addStaggerEffect = () => {
      // Select all card containers specific to locksmith page
      const cardContainers = document.querySelectorAll(
        '.locksmith-features-grid, ' +
        '.locksmith-elevate-grid, ' +
        '.locksmith-stats-grid, ' +
        '.locksmith-testimonials-grid, ' +
        '.locksmith-feature-list, ' +
        '.locksmith-smart-evolution-list, ' +
        '.locksmith-bullet-list, ' +
        '.locksmith-timeline'
      );

      cardContainers.forEach(container => {
        const cards = container.querySelectorAll(
          '.locksmith-feature-card, ' +
          '.locksmith-elevate-card, ' +
          '.locksmith-stat, ' +
          '.locksmith-testimonial-card, ' +
          '.locksmith-feature-item, ' +
          '.locksmith-smart-evolution-item, ' +
          '.locksmith-smart-evolution-list li, ' +
          '.locksmith-bullet-list li, ' +
          '.locksmith-timeline-item'
        );

        if (cards.length > 0) {
          cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
          });

          // Observe the container
          const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll(
                  '.locksmith-feature-card, ' +
                  '.locksmith-elevate-card, ' +
                  '.locksmith-stat, ' +
                  '.locksmith-testimonial-card, ' +
                  '.locksmith-feature-item, ' +
                  '.locksmith-smart-evolution-item, ' +
                  '.locksmith-smart-evolution-list li, ' +
                  '.locksmith-bullet-list li, ' +
                  '.locksmith-timeline-item'
                );
                cards.forEach(card => {
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
                });
                cardObserver.unobserve(entry.target);
              }
            });
          }, observerOptions);

          cardObserver.observe(container);
        }
      });
    };

    // Initialize stagger effect
    addStaggerEffect();
  }

  // ===== COUNTER ANIMATION FOR STATS =====
  // Counts up from 0 to target number when section comes into view
  const initLocksmithCounterAnimation = () => {
    const statNumbers = document.querySelectorAll('.locksmith-stat-number[data-target]');

    if (!statNumbers.length) {
      console.log('No locksmith stat numbers found');
      return;
    }

    console.log('Locksmith counter animation initialized, found', statNumbers.length, 'stat numbers');

    // Animation configuration
    const duration = 2000; // 2 seconds for the count animation
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    // Easing function for smooth animation (ease-out)
    const easeOutQuad = (t) => t * (2 - t);

    // Function to animate a single counter
    const animateCounter = (element) => {
      const target = parseInt(element.dataset.target, 10);
      console.log('Animating locksmith counter to', target);
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

    // Create intersection observer for the stats section
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        console.log('Locksmith stats intersection observed:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
        if (entry.isIntersecting) {
          // Get all stat numbers within this section
          const statsInView = entry.target.querySelectorAll('.locksmith-stat-number[data-target]');
          console.log('Locksmith stats in view:', statsInView.length);

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

    // Observe the impact section (where stats are located)
    const statsSection = document.querySelector('.locksmith-impact-section');
    if (statsSection) {
      console.log('Observing locksmith-impact-section');
      counterObserver.observe(statsSection);
    } else {
      console.log('locksmith-impact-section not found');
    }
  };

  // Initialize counter animation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocksmithCounterAnimation);
  } else {
    initLocksmithCounterAnimation();
  }

  // ===== TESTIMONIALS DOTS INDICATOR =====
  const initTestimonialsDots = () => {
    const testimonialsGrid = document.querySelector('.locksmith-testimonials-grid');
    const dots = document.querySelectorAll('.locksmith-dot');
    const testimonials = document.querySelectorAll('.locksmith-testimonial-column');
    const prevBtn = document.querySelector('.locksmith-slider-btn-prev');
    const nextBtn = document.querySelector('.locksmith-slider-btn-next');

    if (!testimonialsGrid || !dots.length || !testimonials.length) {
      return;
    }

    let currentIndex = 0;

    // Function to update active dot
    const updateDots = (index) => {
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('locksmith-dot-active');
        } else {
          dot.classList.remove('locksmith-dot-active');
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

  // Initialize testimonials dots
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialsDots);
  } else {
    initTestimonialsDots();
  }
});

