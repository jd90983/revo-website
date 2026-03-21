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
  const sections = document.querySelectorAll('.ser-ai-receptionists, .ser-intelligent-communication, .ser-advanced-solutions, .ser-how-it-works, .ser-benefits, .ser-tailored, .ser-reliability, .ser-get-started, .ser-testimonial, .ser-transform-cta, .ser-faqs, .ser-experience-power, .ser-products-section, .ser-features-section');
  
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

// ===== LAZY LOAD SPLINE VIEWER FOR PERFORMANCE =====
// Shared script loader (only load once for all Spline viewers)
let splineScriptLoaded = false;
const loadSplineScript = () => {
  if (splineScriptLoaded) return Promise.resolve();
  splineScriptLoaded = true;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.29/build/spline-viewer.js';
    script.onload = () => {
      console.log('Spline script loaded');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Spline script');
      reject(new Error('Failed to load Spline script'));
    };
    document.head.appendChild(script);
  });
};

// Experience Power section — background video (WebM), no Spline
document.addEventListener('DOMContentLoaded', function() {
  const initExperienceVideo = (experienceSection) => {
    const video = experienceSection.querySelector('.ser-experience-video');
    if (!video) return;

    if (experienceSection.hasAttribute('data-inview-video-bound')) return;
    experienceSection.setAttribute('data-inview-video-bound', 'true');

    const restartAndPlay = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        return;
      }
      try {
        video.currentTime = 0;
      } catch (e) {
        /* ignore */
      }
      video.play().catch(() => {});
    };

    restartAndPlay();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) restartAndPlay();
            else video.pause();
          });
        },
        { rootMargin: '400px 0px', threshold: 0.01 }
      );
      io.observe(experienceSection);
    }
  };
  
  document.querySelectorAll('.ser-experience-power').forEach(initExperienceVideo);
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('ser-experience-power')) {
              initExperienceVideo(node);
            }
            const nestedSections = node.querySelectorAll && node.querySelectorAll('.ser-experience-power');
            if (nestedSections) {
              nestedSections.forEach(initExperienceVideo);
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

// Intelligent banner — background video (WebM), no Spline
document.addEventListener('DOMContentLoaded', function() {
  const initIntelligentBannerVideo = (intelligentBanner) => {
    const video = intelligentBanner.querySelector('.ser-intelligent-banner-video');
    if (!video) return;

    if (intelligentBanner.hasAttribute('data-inview-video-bound')) return;
    intelligentBanner.setAttribute('data-inview-video-bound', 'true');

    const restartAndPlay = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        return;
      }
      try {
        video.currentTime = 0;
      } catch (e) {
        /* ignore */
      }
      video.play().catch(() => {});
    };

    restartAndPlay();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) restartAndPlay();
            else video.pause();
          });
        },
        { rootMargin: '400px 0px', threshold: 0.01 }
      );
      io.observe(intelligentBanner);
    }
  };
  
  document.querySelectorAll('.ser-intelligent-banner').forEach(initIntelligentBannerVideo);
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('ser-intelligent-banner')) {
              initIntelligentBannerVideo(node);
            }
            const nestedSections = node.querySelectorAll && node.querySelectorAll('.ser-intelligent-banner');
            if (nestedSections) {
              nestedSections.forEach(initIntelligentBannerVideo);
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

// AI Receptionists — promo videos (replaces Spline)
document.addEventListener('DOMContentLoaded', function() {
  const initAiReceptionistsVideos = (section) => {
    const videos = section.querySelectorAll('video.ser-ai-spline-viewer');
    if (!videos.length) return;

    if (section.hasAttribute('data-inview-video-bound')) return;
    section.setAttribute('data-inview-video-bound', 'true');

    const restartVisible = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        videos.forEach((v) => v.pause());
        return;
      }
      videos.forEach((v) => {
        const st = window.getComputedStyle(v);
        if (st.display === 'none' || st.visibility === 'hidden') {
          v.pause();
          return;
        }
        try {
          v.currentTime = 0;
        } catch (e) {
          /* ignore */
        }
        v.play().catch(() => {});
      });
    };

    const pauseAll = () => videos.forEach((v) => v.pause());

    restartVisible();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) restartVisible();
            else pauseAll();
          });
        },
        { rootMargin: '400px 0px', threshold: 0.01 }
      );
      io.observe(section);
    }
  };

  document.querySelectorAll('.ser-ai-receptionists').forEach(initAiReceptionistsVideos);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('ser-ai-receptionists')) {
              initAiReceptionistsVideos(node);
            }
            const nested = node.querySelectorAll && node.querySelectorAll('.ser-ai-receptionists');
            if (nested) nested.forEach(initAiReceptionistsVideos);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
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

// ===== BENEFITS: SCROLL-TRIGGERED AUTO-SWITCHING (Mobile & Tablet Only) =====
document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile and tablet
  const isMobileOrTablet = () => window.innerWidth <= 1023;
  
  if (!isMobileOrTablet()) return;

  const benefitsSections = document.querySelectorAll('.ser-benefits');
  
  benefitsSections.forEach((section) => {
    const benefitsContent = section.querySelector('.ser-benefits-content');
    const benefitsAccordionItems = section.querySelectorAll('.ser-benefits-accordion-item');
    const benefitsImage = section.querySelector('[id^="ser-benefits-image"]');
    
    if (!benefitsContent || benefitsAccordionItems.length === 0 || !benefitsImage) return;

    // In mobile/tablet, set background images for cards using data-image attribute
    if (isMobileOrTablet()) {
      benefitsAccordionItems.forEach((item) => {
        const imagePath = item.getAttribute('data-image');
        if (imagePath) {
          // Set background image using CSS custom property
          item.style.setProperty('--card-image', `url('${imagePath}')`);
          // Also set it directly on the pseudo-element via inline style
          const style = document.createElement('style');
          style.textContent = `
            .ser-benefits-accordion-item[data-image="${imagePath}"]::after {
              background-image: url('${imagePath}') !important;
            }
          `;
          document.head.appendChild(style);
        }
      });
    }

    const totalItems = benefitsAccordionItems.length;
    let currentActiveIndex = -1;
    let isUserInteracting = false;
    let interactionTimeout;
    let sectionStartScroll = null; // Track when section enters viewport

    // Function to activate an accordion item
    const activateItem = (index) => {
      if (index === currentActiveIndex || index < 0 || index >= totalItems) return;
      if (isUserInteracting) return; // Don't auto-switch if user is interacting

      const item = benefitsAccordionItems[index];
      const imagePath = item.getAttribute('data-image');
      
      // Remove active class from all items
      benefitsAccordionItems.forEach((otherItem, i) => {
        if (i !== index) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.ser-benefits-accordion-header');
          const otherContent = otherItem.querySelector('.ser-benefits-accordion-content');
          
          if (otherHeader) {
            otherHeader.setAttribute('aria-expanded', 'false');
          }
          
          // Only manage maxHeight for desktop (accordion behavior)
          if (!isMobileOrTablet() && otherContent) {
            otherContent.style.maxHeight = '0';
          }
        }
      });

      // Activate the target item
      item.classList.add('active');
      const header = item.querySelector('.ser-benefits-accordion-header');
      const content = item.querySelector('.ser-benefits-accordion-content');
      
      if (header) {
        header.setAttribute('aria-expanded', 'true');
      }
      
      // Only manage maxHeight for desktop (accordion behavior)
      // In mobile/tablet, content is always visible
      if (!isMobileOrTablet() && content) {
        content.style.maxHeight = 'none';
        const height = content.scrollHeight;
        const targetHeight = Math.max(height + 20, 300);
        content.style.maxHeight = targetHeight + 'px';
      }

      // Update image with smooth transition (only for desktop)
      if (!isMobileOrTablet() && imagePath && benefitsImage) {
        const previousActiveIndex = currentActiveIndex;
        currentActiveIndex = index;
        const slideDirection = index > previousActiveIndex ? 1 : -1;
        
        // Fade out current image
        benefitsImage.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        benefitsImage.style.opacity = '0';
        benefitsImage.style.transform = `translateX(${slideDirection * 30}px) translateY(10px)`;
        
        // After fade out, change image and fade in
        setTimeout(() => {
          const newImage = new Image();
          newImage.onload = () => {
            benefitsImage.src = imagePath;
            benefitsImage.style.transform = `translateX(${-slideDirection * 30}px) translateY(-10px)`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                benefitsImage.style.opacity = '1';
                benefitsImage.style.transform = 'translateX(0) translateY(0)';
              });
            });
          };
          newImage.onerror = () => {
            benefitsImage.src = imagePath;
            benefitsImage.style.opacity = '1';
            benefitsImage.style.transform = 'translateX(0) translateY(0)';
          };
          newImage.src = imagePath;
        }, 250);
      } else {
        currentActiveIndex = index;
      }
    };

    // Track user interactions (click/touch) to prevent auto-switching temporarily
    // In mobile/tablet, make all content visible (card style, not accordion)
    if (isMobileOrTablet()) {
      benefitsAccordionItems.forEach((item) => {
        const content = item.querySelector('.ser-benefits-accordion-content');
        if (content) {
          // Make content always visible in mobile/tablet
          content.style.maxHeight = 'none';
          content.style.opacity = '1';
          content.style.display = 'block';
        }
      });
    }

    benefitsAccordionItems.forEach((item) => {
      const header = item.querySelector('.ser-benefits-accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          // In mobile/tablet, clicking just changes active state (visual only)
          // In desktop, it toggles accordion
          if (isMobileOrTablet()) {
            const clickedIndex = Array.from(benefitsAccordionItems).indexOf(item);
            if (clickedIndex !== -1) {
              activateItem(clickedIndex);
            }
          }
          
          isUserInteracting = true;
          if (interactionTimeout) clearTimeout(interactionTimeout);
          // Re-enable auto-switching after 2 seconds of no interaction
          interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
          }, 2000);
        });
      }
    });

    // Function to check scroll position and determine which item should be active
    // Disabled for mobile/tablet card view - cards are always visible
    const checkScrollProgress = () => {
      // Disable auto-scroll switching in mobile/tablet card view
      // Cards are always visible, no need for scroll-based switching
      if (isMobileOrTablet()) return;
      if (isUserInteracting) return;

      const contentRect = benefitsContent.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const navbarHeight = 72;
      const currentScrollY = window.scrollY || window.pageYOffset;
      
      // Calculate when the content is in viewport and user is reading it
      const contentTop = contentRect.top;
      const contentBottom = contentRect.bottom;
      const contentHeight = contentRect.height;
      
      // Start tracking when content is visible and user can read it
      // Content should be in the viewport (top is above bottom of viewport, bottom is below top of viewport)
      if (contentBottom < navbarHeight || contentTop > viewportHeight) {
        sectionStartScroll = null; // Reset when content is out of viewport
        return; // Content not in viewport
      }

      // Initialize scroll position when content enters the readable area
      // Consider content "readable" when its top is below navbar and visible in viewport
      const readableThreshold = navbarHeight + 50; // Start when content is 50px below navbar
      
      if (sectionStartScroll === null && contentTop <= readableThreshold && contentTop >= navbarHeight - 100) {
        // Content is now readable - start tracking scroll
        sectionStartScroll = currentScrollY;
      }

      // If content hasn't entered readable area yet, don't do anything
      if (sectionStartScroll === null) {
        return;
      }

      // Calculate how much the user has scrolled since content became readable
      const scrolledDistance = currentScrollY - sectionStartScroll;
      
      // Change item every 200px of scroll
      const scrollThreshold = 200;
      
      // Determine which item should be active based on scroll distance
      let itemIndex = 0;
      
      if (scrolledDistance <= 0) {
        // At the start, show first item
        itemIndex = 0;
      } else if (scrolledDistance >= (totalItems - 1) * scrollThreshold) {
        // At the end, show last item
        itemIndex = totalItems - 1;
      } else {
        // Calculate which item based on scroll distance
        // Each item triggers after scrollThreshold pixels
        itemIndex = Math.min(totalItems - 1, Math.max(0, Math.floor(scrolledDistance / scrollThreshold)));
      }

      // Activate the appropriate item
      if (itemIndex !== currentActiveIndex) {
        activateItem(itemIndex);
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check after a small delay to ensure DOM is ready
    setTimeout(() => {
      checkScrollProgress();
    }, 100);
    
    // Also check on resize (in case user rotates device)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMobileOrTablet()) {
          sectionStartScroll = null; // Reset on resize
          checkScrollProgress();
        }
      }, 250);
    }, { passive: true });
  });
});

