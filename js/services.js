/* ======================================
   SERVICES PAGE - Interactions & Animations
   ====================================== */

// ===== BENEFITS TABS =====
const benefitTabs = document.querySelectorAll('.tab-item-benefit');

if (benefitTabs.length > 0) {
  benefitTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active from all tabs
      benefitTabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      this.classList.add('active');
    });
  });
}

// ===== FEATURES TABS =====
const featureTabs = document.querySelectorAll('.tab-item-feature');

if (featureTabs.length > 0) {
  featureTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active from all tabs
      featureTabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      this.classList.add('active');
    });
  });
}

// ===== FAQ ACCORDION (Services Page) =====
const accordionItems = document.querySelectorAll('.accordion-item-service');

if (accordionItems.length > 0) {
  accordionItems.forEach(item => {
    const question = item.querySelector('.accordion-question-service');

    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all accordion items
        accordionItems.forEach(i => i.classList.remove('open'));

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
}

// ===== FAQ ACCORDION (Homepage) =====
// Toggle accordion function for onclick handler
function toggleAccordion(button) {
  const accordionItem = button.closest('.accordion-item');
  const isOpen = accordionItem.classList.contains('open');

  // Close all accordion items
  document.querySelectorAll('.accordion-item').forEach(item => {
    item.classList.remove('open');
  });

  // Open clicked item if it wasn't already open
  if (!isOpen) {
    accordionItem.classList.add('open');
  }
}

// Make toggleAccordion available globally
window.toggleAccordion = toggleAccordion;

// Open first FAQ item by default
document.addEventListener('DOMContentLoaded', () => {
  const firstFaqItem = document.querySelector('.faq-section .accordion-item');
  if (firstFaqItem) {
    firstFaqItem.classList.add('open');
  }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener('DOMContentLoaded', () => {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== SCROLL ANIMATIONS WITH INTERSECTION OBSERVER =====
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
  const sections = document.querySelectorAll(`
    .humanize-section,
    .smart-comm-section,
    .advanced-ai-section,
    .how-works-section,
    .benefits-section,
    .features-section-service,
    .testimonial-section-service,
    .security-section,
    .getting-started-section,
    .banner-cta-section,
    .final-cta-section,
    .faq-section-service
  `.trim().split(/\s*,\s*/));

  sections.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      sectionObserver.observe(section);
    });
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

// ===== CARD HOVER EFFECTS =====
const industryCards = document.querySelectorAll('.advanced-card');
industryCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// ===== HOW IT WORKS CARDS HOVER =====
const howCards = document.querySelectorAll('.how-card');
howCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// ===== TIMELINE ITEMS APPEAR ANIMATION =====
if ('IntersectionObserver' in window) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 150);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    timelineObserver.observe(item);
  });
}

// ===== SCROLL PROGRESS INDICATOR =====
const createScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: var(--nav-height, 72px);
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #0f5ad7 0%, #6b9dff 100%);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
};

// Initialize scroll progress
createScrollProgress();

// ===== ACCESSIBILITY: Focus visible for keyboard navigation =====
document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.body.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add focus styles
const focusStyle = document.createElement('style');
focusStyle.textContent = `
  .keyboard-nav *:focus {
    outline: 2px solid #0f5ad7;
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }
`;
document.head.appendChild(focusStyle);

console.log('Services page interactions loaded successfully');
