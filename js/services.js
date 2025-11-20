/* ============================================
   Services Page - Tabs & Accordion JavaScript
   ============================================ */

// Benefits Tabs
const benefitTabItems = document.querySelectorAll('.tab-item-benefit');

if (benefitTabItems.length > 0) {
  benefitTabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      benefitTabItems.forEach(t => t.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');
    });
  });
}

// Features Tabs
const featureTabItems = document.querySelectorAll('.tab-item-feature');

if (featureTabItems.length > 0) {
  featureTabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      featureTabItems.forEach(t => t.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');
    });
  });
}

// FAQ Accordion
const faqServiceItems = document.querySelectorAll('.accordion-item-service');

if (faqServiceItems.length > 0) {
  faqServiceItems.forEach(item => {
    const question = item.querySelector('.accordion-question-service');

    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all items
        faqServiceItems.forEach(i => i.classList.remove('open'));

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('open');
        }
      });

      // Keyboard accessibility
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    }
  });
}

// Smooth scroll animation on load
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach((section, index) => {
    if (index > 0) { // Skip hero
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    }
  });
});
