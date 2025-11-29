// Industry Locksmith Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.locksmith-faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.locksmith-faq-question');
    
    question.addEventListener('click', function() {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

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

    // Observe all sections except the first one (hero is already visible)
    const sections = document.querySelectorAll('main section');
    sections.forEach((section, index) => {
      // Skip the first section (hero)
      if (index > 0) {
        // Ensure initial state for animation
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
      }
    });

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

