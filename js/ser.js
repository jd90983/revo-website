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

// Smooth scroll animations for sections
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Remove inline styles to allow CSS animations to work smoothly
        entry.target.style.opacity = '';
        entry.target.style.transform = '';
      }
    });
  }, observerOptions);

  // Observe all sections except hero and intelligent banner (handled separately)
  const sections = document.querySelectorAll('.ser-ai-receptionists, .ser-intelligent-communication, .ser-advanced-solutions, .ser-how-it-works, .ser-benefits, .ser-tailored, .ser-reliability, .ser-get-started, .ser-testimonial, .ser-transform-cta, .ser-faqs, .ser-experience-power');
  
  sections.forEach(section => {
    // Skip sections that are initialized by template loader
    if (section.hasAttribute('data-template-initialized')) {
      return;
    }
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Handle get-started-form-section animation
  const getStartedFormSection = document.querySelector('.get-started-form-section');
  if (getStartedFormSection) {
    // Ensure initial state is set for wrapper and inner elements
    const wrapper = getStartedFormSection.querySelector('.get-started-form-wrapper');
    const left = getStartedFormSection.querySelector('.get-started-form-left');
    const right = getStartedFormSection.querySelector('.get-started-form-right');
    
    // Set initial state if not already animated
    if (wrapper && !getStartedFormSection.classList.contains('animate-in')) {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(40px) scale(0.96)';
      wrapper.style.filter = 'blur(8px)';
    }
    
    if (left && !getStartedFormSection.classList.contains('animate-in')) {
      left.style.opacity = '0';
      left.style.transform = 'translateX(-30px)';
    }
    
    if (right && !getStartedFormSection.classList.contains('animate-in')) {
      right.style.opacity = '0';
      right.style.transform = 'translateX(30px)';
    }
    
    const formObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Clear inline styles to allow CSS animations to work
          if (wrapper) {
            wrapper.style.opacity = '';
            wrapper.style.transform = '';
            wrapper.style.filter = '';
          }
          
          if (left) {
            left.style.opacity = '';
            left.style.transform = '';
          }
          
          if (right) {
            right.style.opacity = '';
            right.style.transform = '';
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    formObserver.observe(getStartedFormSection);
    
    // If section already has animate-in class (e.g., from template loader), ensure visibility
    if (getStartedFormSection.classList.contains('animate-in')) {
      if (wrapper) {
        wrapper.style.opacity = '';
        wrapper.style.transform = '';
        wrapper.style.filter = '';
      }
      if (left) {
        left.style.opacity = '';
        left.style.transform = '';
      }
      if (right) {
        right.style.opacity = '';
        right.style.transform = '';
      }
    }
  }
});

// Scroll-triggered text animation for intelligent banner (slide in from sides based on scroll progress)
document.addEventListener('DOMContentLoaded', () => {
  const intelligentBanner = document.querySelector('.ser-intelligent-banner');
  const line1 = document.querySelector('.ser-intelligent-banner-line1');
  const line2 = document.querySelector('.ser-intelligent-banner-line2');
  
  if (!intelligentBanner || !line1 || !line2) return;

  // Set initial state for section
  intelligentBanner.style.opacity = '0';
  intelligentBanner.style.transform = 'translateY(30px)';
  intelligentBanner.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  // Function to update text position based on scroll progress
  const updateTextAnimation = () => {
    const windowHeight = window.innerHeight;
    const bannerRect = intelligentBanner.getBoundingClientRect();
    const bannerTop = bannerRect.top;
    const bannerHeight = bannerRect.height;
    const bannerBottom = bannerRect.bottom;

    // Calculate scroll progress through the banner section
    // Animation starts when banner top is at 80% of viewport
    // Animation continues until banner bottom is at 0% of viewport (fully scrolled past)
    const startPoint = windowHeight * 0.8; // Animation starts here
    const endPoint = -bannerHeight; // Animation ends when banner is fully scrolled past
    const range = startPoint - endPoint;

    let progress = 0;

    if (bannerTop <= startPoint && bannerTop >= endPoint) {
      // Banner is in the animation range
      progress = (startPoint - bannerTop) / range;
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
    } else if (bannerTop < endPoint) {
      // Banner has passed the end point - animation complete
      progress = 1;
    } else {
      // Banner hasn't reached start point - no animation
      progress = 0;
    }

    // Calculate horizontal offset range based on screen size
    // Desktop: full sweep (-100vw to +100vw)
    // Tablet/Mobile: subtle movement (e.g. -30vw to +30vw) to avoid getting cut off
    const hRange = window.innerWidth <= 1023 ? 60 : 200; 
    const line1Offset = -(hRange/2) + (progress * hRange); 
    const line2Offset = (hRange/2) - (progress * hRange); 

    // Calculate vertical offset based on screen size (smaller on mobile/tablet)
    const vOffset = window.innerWidth <= 767 ? 15 : (window.innerWidth <= 1023 ? 20 : 60);

    // Update line1 (slides from left to right, passing through center)
    const line1Transform = `translate(calc(-50% + ${line1Offset}vw), calc(-50% - ${vOffset}px))`;
    line1.style.transform = line1Transform;
    // Opacity: visible when in viewport range (0.2 to 0.8 progress)
    line1.style.opacity = progress >= 0.2 && progress <= 0.8 ? 1 : Math.max(0, 1 - Math.abs(progress - 0.5) * 2);

    // Update line2 (slides from right to left, passing through center)
    const line2Transform = `translate(calc(-50% + ${line2Offset}vw), calc(-50% + ${vOffset}px))`;
    line2.style.transform = line2Transform;
    // Opacity: visible when in viewport range (0.2 to 0.8 progress)
    line2.style.opacity = progress >= 0.2 && progress <= 0.8 ? 1 : Math.max(0, 1 - Math.abs(progress - 0.5) * 2);

    // Also handle the section fade-in
    if (bannerTop < windowHeight && bannerTop > -bannerHeight) {
      intelligentBanner.style.opacity = '1';
      intelligentBanner.style.transform = 'translateY(0)';
    }
  };

  // Throttle scroll events for performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateTextAnimation();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Initial check
  updateTextAnimation();

  // Listen to scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Also listen to resize events to recalculate on window size change
  window.addEventListener('resize', handleScroll, { passive: true });
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

// ===== HOW IT WORKS: SEQUENTIAL CARD ANIMATION (One by one on scroll) =====
document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.ser-how-it-works-wrapper');
  const howSection = document.querySelector('.ser-how-it-works');
  const cards = document.querySelectorAll('.ser-how-card');

  if (!wrapper || !howSection || cards.length === 0) return;

  const totalCards = cards.length;
  let currentActiveIndex = -1;

  // Set initial state for all cards - all hidden
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    card.style.zIndex = '1';
    card.classList.remove('active');
  });

  // Function to show a specific card and hide others
  const showCard = (index) => {
    if (index === currentActiveIndex) return; // Already showing this card
    if (index < 0 || index >= totalCards) return;

    // Hide all cards first
    cards.forEach((card, i) => {
      if (i !== index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.zIndex = '1';
        card.classList.remove('active');
      }
    });

    // Show the target card
    const targetCard = cards[index];
    if (targetCard) {
      targetCard.style.opacity = '1';
      targetCard.style.transform = 'translateY(0)';
      targetCard.style.zIndex = '10';
      targetCard.classList.add('active');
      currentActiveIndex = index;
    }
  };

  // Function to check scroll position and determine which card to show
  const checkCardsOnScroll = () => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTop = wrapperRect.top;
    const wrapperHeight = wrapperRect.height;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the wrapper
    // When wrapper top is at viewport top (0), progress = 0
    // When wrapper bottom is at viewport top, progress = 1
    const scrollableDistance = wrapperHeight;
    let scrollProgress = 0;

    if (wrapperTop <= viewportHeight && wrapperTop >= -wrapperHeight) {
      // Wrapper is in viewport range
      const scrolled = viewportHeight - wrapperTop;
      scrollProgress = Math.max(0, Math.min(1, scrolled / (scrollableDistance + viewportHeight)));
    } else if (wrapperTop < -wrapperHeight) {
      // Wrapper is fully scrolled past
      scrollProgress = 1;
    } else {
      // Wrapper hasn't entered viewport yet
      scrollProgress = 0;
    }

    // Determine which card should be active based on scroll progress
    // Divide progress into equal segments for each card
    const cardIndex = Math.min(
      totalCards - 1,
      Math.max(0, Math.floor(scrollProgress * totalCards))
    );

    // Show the appropriate card
    showCard(cardIndex);
  };

  // Check on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkCardsOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  checkCardsOnScroll();
});

// ===== HOW IT WORKS: MOBILE CAROUSEL WITH DOTS =====
document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile and tablet
  const isMobile = () => window.innerWidth <= 1023;

  if (!isMobile()) return;

  const cardsContainer = document.querySelector('.ser-how-cards-container');
  const cards = document.querySelectorAll('.ser-how-card');
  const howSection = document.querySelector('.ser-how-it-works');

  if (!cardsContainer || cards.length === 0 || !howSection) return;

  // Create dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'ser-how-carousel-dots';

  // Create a dot for each card
  cards.forEach((card, index) => {
    const dot = document.createElement('button');
    dot.className = 'ser-how-carousel-dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to card ${index + 1}`);
    dot.addEventListener('click', () => {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsContainer.appendChild(dot);
  });

  // Insert dots after cards container
  cardsContainer.parentNode.insertBefore(dotsContainer, cardsContainer.nextSibling);

  // Update active dot and card animation on scroll
  const updateCarousel = () => {
    const containerRect = cardsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestCard = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = index;
      }
    });

    // Update card animations - add/remove carousel-active class
    cards.forEach((card, index) => {
      if (index === closestCard) {
        card.classList.add('carousel-active');
      } else {
        card.classList.remove('carousel-active');
      }
    });

    // Update dots
    const dots = dotsContainer.querySelectorAll('.ser-how-carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === closestCard);
    });
  };

  // Set first card as active initially
  if (cards[0]) {
    cards[0].classList.add('carousel-active');
  }

  // Throttled scroll handler
  let scrollTimeout;
  cardsContainer.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateCarousel, 50);
  }, { passive: true });

  // Initial update
  updateCarousel();

  // Handle resize - remove dots on desktop
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!isMobile() && dotsContainer.parentNode) {
        dotsContainer.remove();
      }
    }, 250);
  });
});

