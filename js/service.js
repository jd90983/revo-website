/* ======================================
   SERVICE PAGE - Interactive Features
   Created from scratch
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== BENEFITS ACCORDION WITH IMAGE UPDATES =====
  const benefitsAccordionItems = document.querySelectorAll('.service-benefits-accordion-item');
  const benefitsAccordionButtons = document.querySelectorAll('.service-benefits-accordion-button');
  const benefitsImage = document.getElementById('service-benefits-image');

  if (benefitsAccordionItems.length > 0 && benefitsImage) {
    // Set initial image based on active item
    const activeItem = document.querySelector('.service-benefits-accordion-item.active');
    if (activeItem) {
      const imagePath = activeItem.getAttribute('data-image');
      if (imagePath) {
        benefitsImage.src = imagePath;
      }
    }

    // Handle accordion clicks
    benefitsAccordionButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const item = benefitsAccordionItems[index];
        const isActive = item.classList.contains('active');
        const imagePath = item.getAttribute('data-image');

        // Close all accordion items
        benefitsAccordionItems.forEach(i => {
          i.classList.remove('active');
          const content = i.querySelector('.service-benefits-accordion-content');
          const title = i.querySelector('.service-benefits-accordion-title');
          
          if (content) {
            content.style.maxHeight = '0';
          }
          if (title) {
            title.style.color = 'rgba(10, 11, 12, 0.3)';
          }
        });

        // If the clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.service-benefits-accordion-content');
          const title = item.querySelector('.service-benefits-accordion-title');
          
          if (content) {
            // Get accurate height
            content.style.maxHeight = 'none';
            const height = content.scrollHeight;
            content.style.maxHeight = '0';
            
            // Force reflow
            void content.offsetHeight;
            
            // Animate to full height
            content.style.maxHeight = height + 'px';
          }
          if (title) {
            title.style.color = '#0a0b0c';
          }

          // Update image with fade effect
          if (imagePath) {
            benefitsImage.style.opacity = '0';
            setTimeout(() => {
              benefitsImage.src = imagePath;
              benefitsImage.style.opacity = '1';
            }, 150);
          }
        }
      });
    });

    // Initialize active item on load
    const activeItemOnLoad = document.querySelector('.service-benefits-accordion-item.active');
    if (activeItemOnLoad) {
      const content = activeItemOnLoad.querySelector('.service-benefits-accordion-content');
      const title = activeItemOnLoad.querySelector('.service-benefits-accordion-title');
      
      if (content) {
        content.style.maxHeight = 'none';
        const height = content.scrollHeight;
        content.style.maxHeight = height + 'px';
      }
      if (title) {
        title.style.color = '#0a0b0c';
      }
    }
  }

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.service-faq-item');
  const faqQuestions = document.querySelectorAll('.service-faq-question');

  if (faqQuestions.length > 0) {
    faqQuestions.forEach((question, index) => {
      question.addEventListener('click', () => {
        const item = faqItems[index];
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
    });
  }

  // ===== FEATURES TABS =====
  const featuresTabs = document.querySelectorAll('.service-features-tab');

  if (featuresTabs.length > 0) {
    // For now, only show the first active tab
    // Can be extended to handle tab switching if needed
    featuresTabs.forEach(tab => {
      if (!tab.classList.contains('active')) {
        tab.style.display = 'none';
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

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

  // ===== HOW IT WORKS: SCROLL-TRIGGERED CARD STACK =====
  // This uses the same approach as the original stacked cards implementation
  const howSection = document.querySelector('.how-works-section');
  const howCards = document.querySelectorAll('.card-how');

  if (!howSection || howCards.length === 0) {
    // Fallback to old service-how-cards if new structure not found
    const howCardsContainer = document.querySelector('.service-how-cards');
    const oldHowCards = document.querySelectorAll('.service-how-card');
    
    if (howCardsContainer && oldHowCards.length > 0) {
      // Use old implementation
      const totalCards = oldHowCards.length;
      let currentActiveIndex = 0;
      
      const updateStackedCards = () => {
        const viewportHeight = window.innerHeight;
        const stickyTop = 120;
        
        oldHowCards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const cardTop = rect.top;
          const isAtStickyPosition = Math.abs(cardTop - stickyTop) < 50;
          
          if (isAtStickyPosition) {
            card.classList.add('active');
            card.classList.remove('behind', 'upcoming');
            
            for (let i = 0; i < index; i++) {
              oldHowCards[i].classList.remove('active', 'upcoming');
              oldHowCards[i].classList.add('behind');
            }
            
            for (let i = index + 1; i < totalCards; i++) {
              oldHowCards[i].classList.remove('active', 'behind');
              oldHowCards[i].classList.add('upcoming');
            }
            
            currentActiveIndex = index;
          }
        });
      };

      if (oldHowCards[0]) {
        oldHowCards[0].classList.add('active');
        for (let i = 1; i < totalCards; i++) {
          oldHowCards[i].classList.add('upcoming');
        }
      }

      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateStackedCards();
            ticking = false;
          });
          ticking = true;
        }
      };

      updateStackedCards();
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
    }
    return;
  }

  const totalCards = howCards.length;
  let currentCardIndex = 0;

  // Calculate which card should be active based on scroll position
  const updateCardStack = () => {
    const sectionRect = howSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = sectionRect.height;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the section (0 to 1)
    // When section top is at viewport top, progress = 0
    // When section bottom reaches viewport top, progress = 1
    const scrollProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - viewportHeight)));

    // Determine active card index based on scroll progress
    // Divide progress into equal segments for each card
    const newCardIndex = Math.min(
      totalCards - 1,
      Math.floor(scrollProgress * totalCards)
    );

    // Only update if card changed
    if (newCardIndex !== currentCardIndex) {
      // Remove active/exiting from all cards
      howCards.forEach(card => {
        card.classList.remove('active', 'exiting');
      });

      // Mark previous card as exiting (slides up)
      if (currentCardIndex >= 0 && howCards[currentCardIndex]) {
        howCards[currentCardIndex].classList.add('exiting');
      }

      // Mark new card as active (slides in)
      if (howCards[newCardIndex]) {
        howCards[newCardIndex].classList.add('active');
      }

      currentCardIndex = newCardIndex;
    }
  };

  // Initialize first card as active
  if (howCards[0]) {
    howCards[0].classList.add('active');
  }

  // Update on scroll with throttling for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateCardStack();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateCardStack();

  console.log('Service page interactions loaded successfully');
});
