/* ============================================
   Navigation - Mobile Menu & Smooth Scroll
   ============================================ */

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');
const navbar = document.querySelector('.navbar');

if (mobileMenuToggle && navbarMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Update aria-expanded for accessibility
    const isExpanded = navbarMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when clicking on a link
  const menuLinks = navbarMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
      navbarMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

      // Calculate offset for sticky navbar
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Megamenu with delay on close
document.addEventListener('DOMContentLoaded', () => {
  const megaMenuItems = document.querySelectorAll('.navbar-menu-item-with-mega');
  
  megaMenuItems.forEach(item => {
    const menuLink = item.querySelector('a');
    const megamenu = item.querySelector('.megamenu');
    let closeTimeout = null;

    if (menuLink && megamenu) {
      // Open megamenu on hover over link
      menuLink.addEventListener('mouseenter', () => {
        // Clear any pending close timeout
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        // Open immediately
        megamenu.style.opacity = '1';
        megamenu.style.visibility = 'visible';
        megamenu.style.pointerEvents = 'all';
      });

      // Close megamenu with delay when leaving link
      menuLink.addEventListener('mouseleave', () => {
        // Set timeout to close after 0.3 seconds
        closeTimeout = setTimeout(() => {
          megamenu.style.opacity = '0';
          megamenu.style.visibility = 'hidden';
          megamenu.style.pointerEvents = 'none';
          closeTimeout = null;
        }, 300);
      });

      // Keep megamenu open when hovering over it
      megamenu.addEventListener('mouseenter', () => {
        // Clear any pending close timeout
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        // Keep it open
        megamenu.style.opacity = '1';
        megamenu.style.visibility = 'visible';
        megamenu.style.pointerEvents = 'all';
      });

      // Close megamenu with delay when leaving megamenu
      megamenu.addEventListener('mouseleave', () => {
        // Set timeout to close after 0.5 seconds
        closeTimeout = setTimeout(() => {
          megamenu.style.opacity = '0';
          megamenu.style.visibility = 'hidden';
          megamenu.style.pointerEvents = 'none';
          closeTimeout = null;
        }, 500);
      });
    }
  });
});
