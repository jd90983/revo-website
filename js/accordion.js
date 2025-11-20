/* ============================================
   Accordion - FAQ Functionality
   ============================================ */

const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const question = item.querySelector('.accordion-question');
  const answer = item.querySelector('.accordion-answer');

  if (question && answer) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all accordion items
      accordionItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.accordion-question');
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
