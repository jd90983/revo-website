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
});

