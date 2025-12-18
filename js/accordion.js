/* ============================================
   Accordion - FAQ Functionality
   Works with all FAQ sections
   ============================================ */

// Typewriter effect with fade-in per character (ChatGPT/Gemini style) for mobile
function typewriterEffect(element, text) {
  if (!text) return;
  
  element.innerHTML = '';
  element.style.opacity = '1';
  
  let index = 0;
  const speed = 15; // milliseconds per character
  
  function type() {
    if (index < text.length) {
      const char = text.charAt(index);
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.transition = 'opacity 0.3s ease';
      element.appendChild(span);
      
      // Trigger fade-in
      requestAnimationFrame(() => {
        span.style.opacity = '1';
      });
      
      index++;
      setTimeout(type, speed);
    }
  }
  
  // Small delay before starting
  setTimeout(type, 150);
}

// Select all accordion items from different FAQ sections
function initAccordions() {
  const accordionItems = document.querySelectorAll(
    '.accordion-item, .ind-faq-item, .locksmith-faq-item, .service-faq-item, .ser-faq-item, .home-service-faq-item'
  );

  accordionItems.forEach(item => {
    // Find question element (different selectors for different sections)
    const question = item.querySelector('.accordion-question') || 
                     item.querySelector('.ind-faq-question') || 
                     item.querySelector('.locksmith-faq-question') || 
                     item.querySelector('.service-faq-question') ||
                     item.querySelector('.ser-faq-question') ||
                     item.querySelector('.home-service-faq-question');
    
    // Find answer element (different selectors for different sections)
    const answer = item.querySelector('.accordion-answer') || 
                   item.querySelector('.ind-faq-answer') || 
                   item.querySelector('.locksmith-faq-answer') || 
                   item.querySelector('.service-faq-answer') ||
                   item.querySelector('.ser-faq-answer') ||
                   item.querySelector('.home-service-faq-answer');

    if (question && answer && !question.dataset.accordionBound) {
      question.dataset.accordionBound = 'true';
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all accordion items in the same section
        const section = item.closest('.faq-section, .ind-faq-section, .locksmith-section, .service-faq, .ser-faqs, .home-service-section');
        const sectionItems = section ? section.querySelectorAll(
          '.accordion-item, .ind-faq-item, .locksmith-faq-item, .service-faq-item, .ser-faq-item, .home-service-faq-item'
        ) : accordionItems;

        sectionItems.forEach(i => {
          i.classList.remove('active');
          const btn = i.querySelector('.accordion-question') || 
                      i.querySelector('.ind-faq-question') || 
                      i.querySelector('.locksmith-faq-question') || 
                      i.querySelector('.service-faq-question') ||
                      i.querySelector('.ser-faq-question') ||
                      i.querySelector('.home-service-faq-question');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
          }
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          
          // Typewriter effect for all views (mobile & desktop)
          const answerText = answer.querySelector('.answer-text, .ser-faq-answer-text, .ind-faq-answer p, .ser-faq-answer p, .home-service-faq-answer p, .locksmith-faq-answer p, p');
          if (answerText) {
            if (!answerText.dataset.originalText) {
              answerText.dataset.originalText = answerText.textContent;
            }
            typewriterEffect(answerText, answerText.dataset.originalText);
          }
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
}

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}

// Also export initAccordions for manual trigger if needed (e.g. after template load)
window.initAccordions = initAccordions;
