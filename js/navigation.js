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

// Sticky Navbar with Shadow on Scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
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
