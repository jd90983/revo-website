/* ============================================
   SER Page JavaScript
   ============================================ */

// Benefits Accordion Functionality with Image Updates
document.addEventListener('DOMContentLoaded', () => {
  // Handle both original and duplicate sections
  const benefitsSections = document.querySelectorAll('.ser-benefits');
  
  benefitsSections.forEach((section) => {
    const benefitsAccordionItems = section.querySelectorAll('.ser-benefits-accordion-item');
    const benefitsImage = section.querySelector('[id^="ser-benefits-image"]');
    
    if (benefitsAccordionItems.length > 0) {
      // Set initial image based on active item
      const activeItem = section.querySelector('.ser-benefits-accordion-item.active');
      if (activeItem && benefitsImage) {
        const imagePath = activeItem.getAttribute('data-image');
        if (imagePath) {
          benefitsImage.src = imagePath;
        }
      }
      
      benefitsAccordionItems.forEach(item => {
      const header = item.querySelector('.ser-benefits-accordion-header');
      
      if (header) {
        // Make header focusable and accessible
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
        
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          const imagePath = item.getAttribute('data-image');
          
          // Close all accordion items in this section and update aria-expanded
          const sectionItems = section.querySelectorAll('.ser-benefits-accordion-item');
          sectionItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherHeader = otherItem.querySelector('.ser-benefits-accordion-header');
            const otherContent = otherItem.querySelector('.ser-benefits-accordion-content');
            
            if (otherHeader) {
              otherHeader.setAttribute('aria-expanded', 'false');
            }
            
            // Explicitly close the content
            if (otherContent) {
              otherContent.style.maxHeight = '0';
            }
          });
          
          // Open clicked item if it was closed
          if (!isActive) {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            
            const content = item.querySelector('.ser-benefits-accordion-content');
            if (content) {
              // Calculate height more smoothly to prevent layout shifts
              // First, temporarily set to auto to measure
              const currentMaxHeight = content.style.maxHeight;
              content.style.maxHeight = 'none';
              const height = content.scrollHeight;
              
              // Reset to 0 for smooth animation
              content.style.maxHeight = '0';
              
              // Force reflow
              void content.offsetHeight;
              
              // Now animate to the calculated height
              // Use a value that's large enough but not too large to prevent jumps
              const targetHeight = Math.max(height + 20, 300);
              content.style.maxHeight = targetHeight + 'px';
            }
            
            // Update image with slide and fade effect
            if (imagePath && benefitsImage) {
              // Determine slide direction based on item index
              const sectionItems = section.querySelectorAll('.ser-benefits-accordion-item');
              const currentIndex = Array.from(sectionItems).indexOf(item);
              const previousActiveIndex = Array.from(sectionItems).findIndex(i => i.classList.contains('active') && i !== item);
              const slideDirection = currentIndex > previousActiveIndex ? 1 : -1;
              
              // Start fade out with slide out
              benefitsImage.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              benefitsImage.style.opacity = '0';
              benefitsImage.style.transform = `translateX(${slideDirection * 30}px) translateY(10px)`;
              
              // Wait for fade out to complete, then change image and fade in from opposite side
              setTimeout(() => {
                // Preload the new image
                const newImage = new Image();
                newImage.onload = () => {
                  // Image loaded, now swap and fade in from opposite side
                  benefitsImage.src = imagePath;
                  // Start from opposite side
                  benefitsImage.style.transform = `translateX(${-slideDirection * 30}px) translateY(-10px)`;
                  // Small delay to ensure smooth transition
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      benefitsImage.style.opacity = '1';
                      benefitsImage.style.transform = 'translateX(0) translateY(0)';
                    });
                  });
                };
                newImage.onerror = () => {
                  // If image fails to load, still show it
                  benefitsImage.src = imagePath;
                  benefitsImage.style.opacity = '1';
                  benefitsImage.style.transform = 'translateX(0) translateY(0)';
                };
                newImage.src = imagePath;
              }, 300); // Wait for fade out to complete
            }
          } else {
            // If clicking the active item, close it
            item.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
            const content = item.querySelector('.ser-benefits-accordion-content');
            if (content) {
              content.style.maxHeight = '0';
            }
            // Keep image stable when closing
            if (benefitsImage) {
              benefitsImage.style.transition = 'none';
              benefitsImage.style.transform = 'scale(1)';
              setTimeout(() => {
                benefitsImage.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
              }, 10);
            }
          }
        });
        
        // Keyboard accessibility
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });
      }
    });
    
      // Initialize active item on load for this section
      const activeItemOnLoad = section.querySelector('.ser-benefits-accordion-item.active');
      if (activeItemOnLoad) {
        const content = activeItemOnLoad.querySelector('.ser-benefits-accordion-content');
        if (content) {
          content.style.maxHeight = 'none';
          const height = content.scrollHeight;
          content.style.maxHeight = height + 'px';
        }
        
        // Set initial image
        const imagePath = activeItemOnLoad.getAttribute('data-image');
        if (imagePath && benefitsImage) {
          benefitsImage.src = imagePath;
        }
      }
    }
  });
});

// FAQ Accordion Functionality
function toggleSerFaq(button) {
  const faqItem = button.closest('.ser-faq-item');
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.ser-faq-item').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current FAQ item
  if (isActive) {
    faqItem.classList.remove('active');
  } else {
    faqItem.classList.add('active');
  }
}

// Initialize FAQ items on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add click handlers to all FAQ questions
  const faqQuestions = document.querySelectorAll('.ser-faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      toggleSerFaq(this);
    });
  });
});

// Smooth scroll animations for sections
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections except hero
  const sections = document.querySelectorAll('.ser-ai-receptionists, .ser-intelligent-communication, .ser-advanced-solutions, .ser-how-it-works, .ser-benefits, .ser-tailored, .ser-reliability, .ser-get-started, .ser-testimonial, .ser-transform-cta, .ser-faqs');
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});


// Add hover effects to feature cards
document.addEventListener('DOMContentLoaded', () => {
  const featureCards = document.querySelectorAll('.ser-feature-item, .ser-solution-item, .ser-process-card');
  
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });
});

// Animate numbers in steps section (if needed in future)
function animateNumber(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Handle button clicks for analytics (placeholder)
document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('.btn-primary-large, .btn-secondary-large');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const buttonText = this.textContent.trim();
      // Add analytics tracking here if needed
      console.log('CTA clicked:', buttonText);
    });
  });
});

// Lazy load images (if images are added later)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Mobile menu toggle (if navigation.js doesn't handle it)
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (mobileMenuToggle && navbarMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      const isExpanded = navbarMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }
});

// Add smooth scroll to anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
});

// Add active state to navigation links based on scroll position
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');
  
  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }
});

// ===== HOW IT WORKS: SCROLL-TRIGGERED CARD STACK (Figma Sticky Behavior) =====
document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.ser-how-it-works-wrapper');
  const howSection = document.querySelector('.ser-how-it-works');
  const cards = document.querySelectorAll('.ser-how-card');

  if (!wrapper || !howSection || cards.length === 0) return;

  const totalCards = cards.length;
  let currentCardIndex = 0;

  // Calculate which card should be active based on scroll position (matching Figma sticky behavior)
  const updateCardStack = () => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTop = wrapperRect.top;
    const wrapperHeight = wrapperRect.height;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the wrapper (0 to 1)
    // When wrapper top is at viewport top, progress = 0
    // When wrapper bottom reaches viewport top, progress = 1
    // The scrollable distance is wrapperHeight - viewportHeight
    const scrollableDistance = wrapperHeight - viewportHeight;
    
    // Calculate progress: when wrapperTop is 0 (at top), progress = 0
    // When wrapperTop is -scrollableDistance (bottom at top), progress = 1
    let scrollProgress = 0;
    if (scrollableDistance > 0) {
      // When wrapper is above viewport (wrapperTop < 0), we're scrolling through it
      if (wrapperTop <= 0 && wrapperTop >= -scrollableDistance) {
        scrollProgress = Math.abs(wrapperTop) / scrollableDistance;
      } else if (wrapperTop < -scrollableDistance) {
        scrollProgress = 1; // Fully scrolled
      } else {
        scrollProgress = 0; // Not yet scrolled
      }
    }

    // Determine active card index based on scroll progress
    // Divide progress into equal segments for each card
    const newCardIndex = Math.min(
      totalCards - 1,
      Math.max(0, Math.floor(scrollProgress * totalCards))
    );

    // Only update if card changed
    if (newCardIndex !== currentCardIndex) {
      // Remove active/exiting from all cards
      cards.forEach(card => {
        card.classList.remove('active', 'exiting');
      });

      // Mark previous card as exiting (slides up)
      if (currentCardIndex >= 0 && cards[currentCardIndex]) {
        cards[currentCardIndex].classList.add('exiting');
      }

      // Mark new card as active (slides in)
      if (cards[newCardIndex]) {
        cards[newCardIndex].classList.add('active');
      }

      currentCardIndex = newCardIndex;
    }
  };

  // Initialize first card as active (01. Call Reception)
  if (cards[0]) {
    cards[0].classList.add('active');
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
});

