/* ============================================
   Accordion - FAQ Functionality
   Works with all FAQ sections
   ============================================ */

// Select all accordion items from different FAQ sections
const accordionItems = document.querySelectorAll(
  '.accordion-item, .ind-faq-item, .locksmith-faq-item, .service-faq-item, .ser-faq-item'
);

accordionItems.forEach(item => {
  // Find question element (different selectors for different sections)
  const question = item.querySelector('.accordion-question') || 
                   item.querySelector('.ind-faq-question') || 
                   item.querySelector('.locksmith-faq-question') || 
                   item.querySelector('.service-faq-question') ||
                   item.querySelector('.ser-faq-question');
  
  // Find answer element (different selectors for different sections)
  const answer = item.querySelector('.accordion-answer') || 
                 item.querySelector('.ind-faq-answer') || 
                 item.querySelector('.locksmith-faq-answer') || 
                 item.querySelector('.service-faq-answer') ||
                 item.querySelector('.ser-faq-answer');

  if (question && answer) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all accordion items in the same section
      const section = item.closest('.faq-section, .ind-faq-section, .locksmith-section, .service-faq, .ser-faqs');
      const sectionItems = section ? section.querySelectorAll(
        '.accordion-item, .ind-faq-item, .locksmith-faq-item, .service-faq-item, .ser-faq-item'
      ) : accordionItems;

      sectionItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.accordion-question') || 
                    i.querySelector('.ind-faq-question') || 
                    i.querySelector('.locksmith-faq-question') || 
                    i.querySelector('.service-faq-question') ||
                    i.querySelector('.ser-faq-question');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessibility - Enter and Space keys
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  }
});
