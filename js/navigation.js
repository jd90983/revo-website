/* ============================================
   Navigation - Mobile Menu & Smooth Scroll
   ============================================ */

// Mobile Menu Toggle - Full Screen Overlay
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  // Function to open mobile menu
  function openMobileMenu() {
    if (mobileMenuOverlay) {
      // Force display with inline styles to override any CSS - DARK THEME
      mobileMenuOverlay.style.cssText = `
        display: flex !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: #0a0b0c !important;
        z-index: 999999 !important;
        flex-direction: column !important;
        overflow-y: auto !important;
      `;
      mobileMenuOverlay.classList.add('active');
      document.body.classList.add('mobile-menu-open');
      document.body.style.overflow = 'hidden';
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.classList.add('active');
      }
    }
  }

  // Function to close mobile menu
  function closeMobileMenu() {
    if (mobileMenuOverlay) {
      // Reset inline styles
      mobileMenuOverlay.style.cssText = '';
      mobileMenuOverlay.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
      document.body.style.overflow = '';
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
      }
    }
  }

  // Toggle menu on hamburger click
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close menu on X button click
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  // Close menu when clicking a nav link (but not dropdown toggles)
  if (mobileMenuOverlay) {
    const menuLinks = mobileMenuOverlay.querySelectorAll('.mobile-menu-nav a:not(.mobile-menu-view-all)');
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Handle dropdown toggles
    const dropdownToggles = mobileMenuOverlay.querySelectorAll('.mobile-menu-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.mobile-menu-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('active');
          toggle.setAttribute('aria-expanded', dropdown.classList.contains('active'));
        }
      });
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });
});

// Sticky Navbar with Shadow on Scroll & Hide/Show on Scroll Direction
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Add shadow when scrolled
          if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
            // Always show navbar at the top
            navbar.classList.remove('navbar-hidden');
          }

          // Hide/show navbar based on scroll direction (only after scrolling past 100px)
          if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
              // Scrolling down - hide navbar (with threshold to avoid flickering)
              navbar.classList.add('navbar-hidden');
            } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
              // Scrolling up - show navbar (with threshold to avoid flickering)
              navbar.classList.remove('navbar-hidden');
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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
        behavior: 'smooth',
      });
    }
  });
});

// "Get Started" buttons - scroll to form section (using event delegation)
document.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  
  // Check if it's a "Get Started" button
  if (button && button.textContent.trim() === 'Get Started') {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the form section
    const formSection = document.querySelector('.get-started-form-section') || 
                       document.getElementById('get-started-form-template-container');
    
    if (formSection) {
      // Calculate offset for sticky navbar + scroll past form top to center it
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const extraOffset = 100;  // Scroll 100px past form top to center it better
      const targetPosition = formSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight + extraOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Focus on first input after scrolling
      setTimeout(() => {
        const firstInput = formSection.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 800);
    }
  }
});

// Megamenu with delay on close - Optimized for desktop, tablet, and mobile
document.addEventListener('DOMContentLoaded', () => {
  const megaMenuItems = document.querySelectorAll('.navbar-menu-item-with-mega');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Helper function to open megamenu
  function openMegamenu(megamenu, closeTimeoutRef) {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    megamenu.style.opacity = '1';
    megamenu.style.visibility = 'visible';
    megamenu.style.pointerEvents = 'all';
  }

  // Helper function to close megamenu
  function closeMegamenu(megamenu, closeTimeoutRef, delay = 300) {
    closeTimeoutRef.current = setTimeout(() => {
      megamenu.style.opacity = '0';
      megamenu.style.visibility = 'hidden';
      megamenu.style.pointerEvents = 'none';
      closeTimeoutRef.current = null;
    }, delay);
  }
  
  // Track open state for each megamenu (for touch devices)
  const megamenuStates = new Map();

  megaMenuItems.forEach(item => {
    const menuLink = item.querySelector('a');
    const megamenu = item.querySelector('.megamenu');
    const closeTimeout = { current: null };

    if (menuLink && megamenu) {
      // Desktop: Hover interactions
      if (!isTouchDevice) {
        // Open megamenu on hover over link
        menuLink.addEventListener('mouseenter', () => {
          openMegamenu(megamenu, closeTimeout);
        });

        // Close megamenu with delay when leaving link
        menuLink.addEventListener('mouseleave', () => {
          closeMegamenu(megamenu, closeTimeout, 300);
        });

        // Keep megamenu open when hovering over it
        megamenu.addEventListener('mouseenter', () => {
          openMegamenu(megamenu, closeTimeout);
        });

        // Close megamenu with delay when leaving megamenu
        megamenu.addEventListener('mouseleave', () => {
          closeMegamenu(megamenu, closeTimeout, 500);
        });
      } else {
        // Tablet/Touch: Click/tap interactions
        megamenuStates.set(item, false);

        menuLink.addEventListener('click', (e) => {
          // Only prevent default if we're on a touch device and menu is not a direct link
          if (isTouchDevice && window.innerWidth > 767) {
            e.preventDefault();
            const isOpen = megamenuStates.get(item);
            const newState = !isOpen;
            megamenuStates.set(item, newState);
            
            if (newState) {
              openMegamenu(megamenu, closeTimeout);
            } else {
              closeMegamenu(megamenu, closeTimeout, 0);
            }
          }
        });

        // Close when clicking outside (using event delegation)
        item.addEventListener('click', (e) => {
          if (e.target === menuLink || menuLink.contains(e.target)) {
            return; // Let the click handler above handle it
          }
        });
      }
    }
  });

  // Global click handler to close megamenu when clicking outside (for touch devices)
  if (isTouchDevice) {
    document.addEventListener('click', (e) => {
      megaMenuItems.forEach(item => {
        if (!item.contains(e.target) && megamenuStates.get(item)) {
          const megamenu = item.querySelector('.megamenu');
          const closeTimeout = { current: null };
          megamenuStates.set(item, false);
          closeMegamenu(megamenu, closeTimeout, 0);
        }
      });
    }, true);
  }

  // Footer Dropdowns for Mobile/Tablet
  const footerDropdowns = document.querySelectorAll('.footer-dropdown-toggle');
  footerDropdowns.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const dropdown = toggle.closest('.footer-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('active');
        const isExpanded = dropdown.classList.contains('active');
        toggle.setAttribute('aria-expanded', isExpanded);
      }
    });
  });
});
