/* ============================================
   Industries Page - Tabs & Accordion
   ============================================ */

// Benefits Tabs (Left Image, Right Tabs)
const benefitsTabItems = document.querySelectorAll('.benefits-tabs-section .tab-item');
const benefitsImage = document.querySelector('.benefits-tabs-section .tabs-image-placeholder');

// Placeholder images for benefits tabs (replace with actual images later)
const benefitsImages = [
  'data:image/svg+xml,%3Csvg width="600" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="600" height="600" fill="%23222324"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%230f5ad7" font-size="24" font-family="Arial"%3E24/7 Availability%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg width="600" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="600" height="600" fill="%23222324"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%230f5ad7" font-size="24" font-family="Arial"%3ESmart Call Management%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg width="600" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="600" height="600" fill="%23222324"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%230f5ad7" font-size="24" font-family="Arial"%3EAI Caller Memory%3C/text%3E%3C/svg%3E'
];

if (benefitsTabItems.length > 0 && benefitsImage) {
  benefitsTabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      benefitsTabItems.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Change image with fade effect
      benefitsImage.style.opacity = '0';
      setTimeout(() => {
        benefitsImage.style.backgroundImage = `url('${benefitsImages[index]}')`;
        benefitsImage.style.backgroundSize = 'cover';
        benefitsImage.style.backgroundPosition = 'center';
        benefitsImage.style.opacity = '1';
      }, 150);
    });
  });

  // Set initial image
  if (benefitsImage) {
    benefitsImage.style.backgroundImage = `url('${benefitsImages[0]}')`;
    benefitsImage.style.backgroundSize = 'cover';
    benefitsImage.style.backgroundPosition = 'center';
  }
}

// Features Tabs (Left Tabs, Right Image)
const featuresTabItems = document.querySelectorAll('.features-tabs-section .tab-item');
const featuresImage = document.querySelector('.features-tabs-section .tabs-image-placeholder');

// Placeholder images for features tabs (replace with actual images later)
const featuresImages = [
  'data:image/svg+xml,%3Csvg width="584" height="584" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="584" height="584" fill="%23222324"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%230f5ad7" font-size="24" font-family="Arial"%3EPersonalized AI Reception%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg width="584" height="584" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="584" height="584" fill="%23222324"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%230f5ad7" font-size="24" font-family="Arial"%3ESmart Response Timing%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg width="584" height="584" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="584" height="584" fill="%23222324"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%230f5ad7" font-size="24" font-family="Arial"%3EDetailed Call Reports%3C/text%3E%3C/svg%3E'
];

if (featuresTabItems.length > 0 && featuresImage) {
  featuresTabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      featuresTabItems.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Change image with fade effect
      featuresImage.style.opacity = '0';
      setTimeout(() => {
        featuresImage.style.backgroundImage = `url('${featuresImages[index]}')`;
        featuresImage.style.backgroundSize = 'cover';
        featuresImage.style.backgroundPosition = 'center';
        featuresImage.style.opacity = '1';
      }, 150);
    });
  });

  // Set initial image
  if (featuresImage) {
    featuresImage.style.backgroundImage = `url('${featuresImages[0]}')`;
    featuresImage.style.backgroundSize = 'cover';
    featuresImage.style.backgroundPosition = 'center';
  }
}

// FAQ Accordion (Industries Page)
const faqItemsIndustries = document.querySelectorAll('.accordion-item-industries');

faqItemsIndustries.forEach(item => {
  const question = item.querySelector('.accordion-question-industries');

  if (question) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all accordion items (optional - remove if you want multiple open)
      faqItemsIndustries.forEach(i => i.classList.remove('open'));

      // Toggle current item
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

// Smooth scroll for all anchor links on Industries page
document.addEventListener('DOMContentLoaded', () => {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Ignore empty hash or just '#'
      if (href === '#' || href === '') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add fade-in animation on scroll for Industries page sections
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all major sections except hero
  const sections = document.querySelectorAll('.industry-grid-section, .success-stories-section, .numbered-feature, .tabs-section, .large-testimonial-section, .cta-section-industries, .faq-industries');

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
}

// Add scroll animation class
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);
