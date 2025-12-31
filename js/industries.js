/* ============================================
   Industries Page - Interactions
   ============================================ */

// Tab Switching for Benefits Section
const benefitsTabItems = document.querySelectorAll('.benefits-tabbed-section .tab-item');
const benefitsImage = document.querySelector('#benefits-image');

const benefitsImages = [
  'linear-gradient(135deg, rgba(15, 90, 215, 0.2) 0%, rgba(107, 157, 255, 0.1) 100%)',
  'linear-gradient(135deg, rgba(15, 90, 215, 0.25) 0%, rgba(107, 157, 255, 0.15) 100%)',
  'linear-gradient(135deg, rgba(15, 90, 215, 0.3) 0%, rgba(107, 157, 255, 0.2) 100%)'
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
        benefitsImage.style.background = benefitsImages[index];
        benefitsImage.style.opacity = '1';
      }, 150);
    });
  });

  // Set initial image
  if (benefitsImage) {
    benefitsImage.style.background = benefitsImages[0];
  }
}

// Tab Switching for Features Section
const featuresTabItems = document.querySelectorAll('.features-tabbed-section .tab-item');
const featuresImage = document.querySelector('#features-image');

const featuresImages = [
  'linear-gradient(135deg, rgba(15, 90, 215, 0.2) 0%, rgba(107, 157, 255, 0.1) 100%)',
  'linear-gradient(135deg, rgba(15, 90, 215, 0.25) 0%, rgba(107, 157, 255, 0.15) 100%)',
  'linear-gradient(135deg, rgba(15, 90, 215, 0.3) 0%, rgba(107, 157, 255, 0.2) 100%)'
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
        featuresImage.style.background = featuresImages[index];
        featuresImage.style.opacity = '1';
      }, 150);
    });
  });

  // Set initial image
  if (featuresImage) {
    featuresImage.style.background = featuresImages[0];
  }
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-accordion-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  if (question) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all FAQ items
      faqItems.forEach(i => i.classList.remove('open'));

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

// Mega Menu - Open on hover for Industries dropdown
const dropdown = document.querySelector('.dropdown');
const megaMenu = document.querySelector('.mega-menu');

if (dropdown && megaMenu) {
  let hideTimeout;

  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    dropdown.classList.add('active');
  });

  dropdown.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => {
      dropdown.classList.remove('active');
    }, 200);
  });

  // Keep menu open when hovering over it
  megaMenu.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
  });

  megaMenu.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => {
      dropdown.classList.remove('active');
    }, 200);
  });
}

// Smooth scroll for anchor links
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

// Scroll animations with IntersectionObserver
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

  // Observe major sections
  const sections = document.querySelectorAll('.industry-section, .success-stories-section, .numbered-feature, .tabbed-section, .testimonial-large-section, .cta-dramatic, .faq-two-column');

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Card hover effects with subtle scale
const industryCards = document.querySelectorAll('.industry-card');
industryCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// Article card hover effects
const articleCards = document.querySelectorAll('.article-card');
articleCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// Sticky feature number bars - update active state on scroll
const featureNumbers = document.querySelectorAll('.feature-number-bar');
const numberedFeatures = document.querySelectorAll('.numbered-feature');

function updateActiveFeature() {
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  numberedFeatures.forEach((feature, index) => {
    const rect = feature.getBoundingClientRect();
    const featureTop = rect.top + window.scrollY;
    const featureBottom = featureTop + rect.height;

    if (scrollPosition >= featureTop && scrollPosition <= featureBottom) {
      featureNumbers[index]?.classList.add('active');
    } else {
      featureNumbers[index]?.classList.remove('active');
    }
  });
}

if (numberedFeatures.length > 0) {
  window.addEventListener('scroll', updateActiveFeature);
  updateActiveFeature(); // Initial call
}
