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

// Parallax effect for hero background (optional, subtle)
const hero = document.querySelector('.hero');
const heroBackground = document.querySelector('.hero-background');

if (hero && heroBackground) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    // Only apply parallax when hero is visible
    if (scrolled < heroHeight) {
      const parallaxSpeed = 0.5;
      heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}
