/* ============================================
   Navigation - Mobile Menu & Smooth Scroll
   ============================================ */

// Mobile Menu Toggle - Full Screen Overlay
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  let resetMobileMenuSearch = () => {};
  let focusMobileMenuSearch = () => {};

  function openMobileMenu() {
    if (!mobileMenuOverlay) return;

    // inset:0 + width:auto keeps the overlay inside the visual viewport
    mobileMenuOverlay.style.cssText = `
      display: flex !important;
      position: fixed !important;
      inset: 0 !important;
      width: auto !important;
      max-width: 100% !important;
      height: auto !important;
      max-height: 100dvh !important;
      box-sizing: border-box !important;
      background-color: #0a0b0c !important;
      z-index: 999999 !important;
      flex-direction: column !important;
      overflow: hidden !important;
    `;
    mobileMenuOverlay.classList.add('active');
    document.documentElement.classList.add('mobile-menu-open');
    document.body.classList.add('mobile-menu-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenuToggle.classList.add('active');
    }
    window.setTimeout(focusMobileMenuSearch, 50);
  }

  function closeMobileMenu() {
    if (!mobileMenuOverlay) return;

    resetMobileMenuSearch();
    mobileMenuOverlay.style.cssText = '';
    mobileMenuOverlay.classList.remove('active');
    document.documentElement.classList.remove('mobile-menu-open');
    document.body.classList.remove('mobile-menu-open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.classList.remove('active');
    }
  }

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

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  if (mobileMenuOverlay) {
    const menuLinks = mobileMenuOverlay.querySelectorAll('.mobile-menu-nav a:not(.mobile-menu-view-all)');
    menuLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    const dropdownToggles = mobileMenuOverlay.querySelectorAll('.mobile-menu-dropdown-toggle');
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.mobile-menu-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('active');
          toggle.setAttribute('aria-expanded', dropdown.classList.contains('active'));
        }
      });
    });

    const searchApi = initMobileMenuSearch(mobileMenuOverlay);
    if (searchApi) {
      resetMobileMenuSearch = searchApi.reset;
      focusMobileMenuSearch = searchApi.focus;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  function initMobileMenuSearch(overlay) {
    const nav = overlay.querySelector('.mobile-menu-nav');
    if (!nav || nav.querySelector('.mobile-menu-search')) return null;

    // Full industry catalog (includes pages not listed in the short mobile menu)
    const ALL_INDUSTRIES = [
      { href: 'industry_home_service', label: 'Home Services', icon: 'images/icons/solar_home-2-broken.svg', group: 'Home Service Pros' },
      { href: 'industry_air_duct_cleaning', label: 'Air Duct Cleaning', icon: 'images/icons/fa6-solid_wind.svg', group: 'Home Service Pros' },
      { href: 'industry_locksmith', label: 'Locksmith', icon: 'images/icons/fa7-solid_key_.svg', group: 'Home Service Pros' },
      { href: 'industry_hvac', label: 'HVAC', icon: 'images/icons/fa6-solid_fan.svg', group: 'Home Service Pros' },
      { href: 'industry_plumbing', label: 'Plumbing', icon: 'images/icons/plumbing_.svg', group: 'Home Service Pros' },
      { href: 'industry_chimney_sweep', label: 'Chimney Sweep', icon: 'images/icons/fa6-solid_fire-burner.svg', group: 'Home Service Pros' },
      { href: 'industry_lawn_care', label: 'Lawn Care', icon: 'images/icons/fa6-solid_leaf.svg', group: 'Home Service Pros' },
      { href: 'industry_restoration', label: 'Restoration', icon: 'images/icons/fa6-solid_house-chimney-crack.svg', group: 'Home Service Pros' },
      { href: 'industry_junk_removal', label: 'Junk Removal', icon: 'images/icons/fa6-solid_dumpster.svg', group: 'Home Service Pros' },
      { href: 'industry_pressure_washing', label: 'Pressure Washing', icon: 'images/icons/fa6-solid_faucet-drip.svg', group: 'Home Service Pros' },
      { href: 'industry_carpet_cleaning', label: 'Carpet Cleaning', icon: 'images/icons/fa6-solid_rug.svg', group: 'Home Service Pros' },
      { href: 'industry_pest_control', label: 'Pest Control', icon: 'images/icons/fa7-solid_bug.svg', group: 'Home Service Pros' },
      { href: 'industry_snow_removal', label: 'Snow Removal', icon: 'images/icons/fa7-solid_snowplow.svg', group: 'Home Service Pros' },
      { href: 'industry_roofing', label: 'Roofing', icon: 'images/icons/fa6-solid_house_.svg', group: 'Home Service Pros' },
      { href: 'industry_landscape', label: 'Landscape', icon: 'images/icons/fa6-solid_tree.svg', group: 'Home Service Pros' },
      { href: 'industry_construction', label: 'Construction', icon: 'images/icons/fa6-solid_trowel-bricks.svg', group: 'Home Service Pros' },
      { href: 'industry_maid_cleaning', label: 'Maid & Cleaning', icon: 'images/icons/fa6-solid_broom.svg', group: 'Home Service Pros' },
      { href: 'industry_electrical', label: 'Electrical', icon: 'images/icons/fa6-solid_plug.svg', group: 'Home Service Pros' },
      { href: 'industry_property_maintenance', label: 'Property Maintenance', icon: 'images/icons/fa6-solid_screwdriver.svg', group: 'Home Service Pros' },
      { href: 'industry_general_contracting', label: 'General Contracting', icon: 'images/icons/fa6-solid_clipboard.svg', group: 'Home Service Pros' },
      { href: 'industry_towing', label: 'Towing', icon: 'images/icons/fa6-solid_truck-pickup.svg', group: 'Home Service Pros' },
      { href: 'industry_moving', label: 'Moving', icon: 'images/icons/fa6-solid_truck.svg', group: 'Home Service Pros' },
      { href: 'industry_handyman', label: 'Handyman', icon: 'images/icons/fa7-solid_tools.svg', group: 'Home Service Pros' },
      { href: 'industry_alarm_security', label: 'Alarm & Security', icon: 'images/icons/fa6-solid_alarm.svg', group: 'Home Service Pros' },
      { href: 'industry_pool_services', label: 'Pool Services', icon: 'images/icons/fa6-solid_water.svg', group: 'Home Service Pros' },
      { href: 'industry_appliance_repair', label: 'Appliance Repair', icon: 'images/icons/fa6-solid_store.svg', group: 'Home Service Pros' },
      { href: 'industry_solar_installation', label: 'Solar Installation', icon: 'images/icons/fa6-solid_solar-panel.svg', group: 'Home Service Pros' },
      { href: 'industry_garage_door', label: 'Garage Door', icon: 'images/icons/fa6-solid_warehouse.svg', group: 'Home Service Pros' },
      { href: 'industry_painting', label: 'Painting', icon: 'images/icons/fa6-solid_paint-roller.svg', group: 'Home Service Pros' },
      { href: 'industry_tilling', label: 'Tilling', icon: 'images/icons/fa6-solid_tractor.svg', group: 'Home Service Pros' },
      { href: 'industry_window_cleaning', label: 'Window Cleaning', icon: 'images/icons/fa6-solid_house-chimney-window.svg', group: 'Home Service Pros' },
      { href: 'industry_computer_repair', label: 'Computer Repair', icon: 'images/icons/fa6-solid_computer.svg', group: 'Home Service Pros' },
      { href: 'industry_healthcare_medical', label: 'Healthcare & Medical', icon: 'images/icons/fa6-solid_stethoscope.svg', group: 'Professional Businesses' },
      { href: 'industry_legal', label: 'Legal', icon: 'images/icons/fa6-solid_gavel_.svg', group: 'Professional Businesses' },
      { href: 'industry_financial_service', label: 'Financial Service', icon: 'images/icons/fa6-solid_chart-line.svg', group: 'Professional Businesses' },
      { href: 'industry_real_estate_property_management', label: 'Real Estate & Property Management', icon: 'images/icons/fa6-solid_sign-hanging.svg', group: 'Professional Businesses' },
      { href: 'industry_small_business', label: 'Small Business', icon: 'images/icons/fa6-solid_shop.svg', group: 'Professional Businesses' },
      { href: 'industry_corporate_government', label: 'Corporate & Government', icon: 'images/icons/fa6-solid_building-columns.svg', group: 'Professional Businesses' },
      { href: 'industry_retail_ecommerce', label: 'Retail & eCommerce', icon: 'images/icons/fa6-solid_store.svg', group: 'Professional Businesses' },
      { href: 'industry_marketing_media_advertising', label: 'Marketing, Media & Advertising', icon: 'images/icons/fa6-solid_briefcase.svg', group: 'Professional Businesses' },
      { href: 'industry_it_technology_communications', label: 'IT & Technology', icon: 'images/icons/fa6-solid_shield-halved.svg', group: 'Professional Businesses' },
      { href: 'industry_franchises', label: 'Franchises', icon: 'images/icons/fa6-solid_building.svg', group: 'Professional Businesses' },
      { href: 'industry_tourism_travel_hospitality', label: 'Tourism, Travel & Hospitality', icon: 'images/icons/fa6-solid_suitcase-rolling.svg', group: 'Professional Businesses' },
      { href: 'industry_building_construction_trades', label: 'Building, Construction & Trades', icon: 'images/icons/fa6-solid_hotel.svg', group: 'Professional Businesses' },
    ];

    const searchWrap = document.createElement('div');
    searchWrap.className = 'mobile-menu-search';
    searchWrap.innerHTML = `
      <svg class="mobile-menu-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <input
        type="search"
        class="mobile-menu-search-input"
        placeholder="Search"
        aria-label="Search menu"
        autocomplete="off"
        enterkeyhint="search"
      >
    `;

    const emptyState = document.createElement('p');
    emptyState.className = 'mobile-menu-search-empty';
    emptyState.textContent = 'No matches in this menu';
    emptyState.setAttribute('role', 'status');

    const menuList = nav.querySelector(':scope > ul');
    nav.insertBefore(searchWrap, menuList || nav.firstChild);
    if (menuList) {
      menuList.after(emptyState);
    } else {
      nav.appendChild(emptyState);
    }

    const input = searchWrap.querySelector('.mobile-menu-search-input');
    const topItems = Array.from(nav.querySelectorAll(':scope > ul > li'));
    const industriesDropdown = nav.querySelector('.mobile-menu-dropdown');
    const dropdownContent = industriesDropdown
      ? industriesDropdown.querySelector('.mobile-menu-dropdown-content')
      : null;

    // Container for industries found via catalog but missing from the short menu
    let extraCategory = null;
    let extraList = null;
    if (dropdownContent) {
      extraCategory = document.createElement('p');
      extraCategory.className = 'mobile-menu-category mobile-menu-search-extra-label';
      extraCategory.textContent = 'More industries';
      extraCategory.hidden = true;

      extraList = document.createElement('ul');
      extraList.className = 'mobile-menu-submenu mobile-menu-search-extra';
      extraList.hidden = true;

      const viewAll = dropdownContent.querySelector('.mobile-menu-view-all');
      if (viewAll) {
        dropdownContent.insertBefore(extraCategory, viewAll);
        dropdownContent.insertBefore(extraList, viewAll);
      } else {
        dropdownContent.appendChild(extraCategory);
        dropdownContent.appendChild(extraList);
      }
    }

    const menuIndustryHrefs = new Set(
      Array.from(nav.querySelectorAll('.mobile-menu-submenu a[href*="industry"]')).map((a) =>
        (a.getAttribute('href') || '').replace(/\.html$/, '').split('/').pop()
      )
    );

    let searchOpenedDropdown = false;

    function normalize(text) {
      return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function hrefKey(href) {
      return (href || '').replace(/\.html$/, '').split('/').pop();
    }

    function clearExtraResults() {
      if (!extraList || !extraCategory) return;
      extraList.innerHTML = '';
      extraList.hidden = true;
      extraCategory.hidden = true;
    }

    function renderExtraResults(matches) {
      if (!extraList || !extraCategory) return 0;
      clearExtraResults();
      if (!matches.length) return 0;

      matches.forEach((industry) => {
        const li = document.createElement('li');
        li.className = 'mobile-menu-search-hit';
        li.innerHTML = `
          <a href="${industry.href}">
            <img src="${industry.icon}" alt="" class="mobile-menu-icon" width="20" height="20">
            <span>${industry.label}</span>
          </a>
        `;
        const link = li.querySelector('a');
        link.addEventListener('click', closeMobileMenu);
        extraList.appendChild(li);
      });

      extraCategory.hidden = false;
      extraList.hidden = false;
      return matches.length;
    }

    function resetVisibility() {
      nav.querySelectorAll('.mobile-menu-item-hidden').forEach((el) => {
        el.classList.remove('mobile-menu-item-hidden');
      });
      clearExtraResults();
      emptyState.classList.remove('is-visible');
    }

    function filterMenu(rawQuery) {
      const query = normalize(rawQuery);
      resetVisibility();

      if (!query) {
        if (searchOpenedDropdown) {
          const toggle = industriesDropdown && industriesDropdown.querySelector('.mobile-menu-dropdown-toggle');
          if (industriesDropdown) {
            industriesDropdown.classList.remove('active');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          }
          searchOpenedDropdown = false;
        }
        return;
      }

      let visibleCount = 0;

      // Catalog matches not already shown in the short submenu
      const catalogMatches = ALL_INDUSTRIES.filter((industry) => {
        const key = hrefKey(industry.href);
        // Skip ones already listed in the short mobile submenu
        if (menuIndustryHrefs.has(key)) return false;
        return normalize(industry.label).includes(query);
      });
      const extraCount = renderExtraResults(catalogMatches);

      topItems.forEach((item) => {
        if (!item.classList.contains('mobile-menu-dropdown')) {
          const match = normalize(item.textContent).includes(query);
          item.classList.toggle('mobile-menu-item-hidden', !match);
          if (match) visibleCount += 1;
          return;
        }

        const dropdown = item;
        const toggle = dropdown.querySelector('.mobile-menu-dropdown-toggle');
        const parentMatch = normalize(toggle ? toggle.textContent : 'Industries').includes(query);
        const submenuItems = Array.from(
          dropdown.querySelectorAll('.mobile-menu-submenu:not(.mobile-menu-search-extra) > li')
        );
        const categories = Array.from(
          dropdown.querySelectorAll('.mobile-menu-category:not(.mobile-menu-search-extra-label)')
        );
        const viewAll = dropdown.querySelector('.mobile-menu-view-all');
        let anyChildMatch = false;

        submenuItems.forEach((subItem) => {
          const match = parentMatch || normalize(subItem.textContent).includes(query);
          subItem.classList.toggle('mobile-menu-item-hidden', !match);
          if (match) anyChildMatch = true;
        });

        categories.forEach((category) => {
          const submenu = category.nextElementSibling;
          if (!submenu || !submenu.classList.contains('mobile-menu-submenu')) {
            category.classList.add('mobile-menu-item-hidden');
            return;
          }
          const hasVisible = Array.from(submenu.children).some(
            (child) => !child.classList.contains('mobile-menu-item-hidden')
          );
          category.classList.toggle('mobile-menu-item-hidden', !hasVisible);
        });

        const showDropdown = parentMatch || anyChildMatch || extraCount > 0;
        dropdown.classList.toggle('mobile-menu-item-hidden', !showDropdown);

        if (viewAll) {
          const viewAllMatch =
            parentMatch ||
            anyChildMatch ||
            extraCount > 0 ||
            normalize(viewAll.textContent).includes(query);
          viewAll.classList.toggle('mobile-menu-item-hidden', !viewAllMatch);
        }

        if (showDropdown) {
          visibleCount += 1;
          if (!dropdown.classList.contains('active')) {
            dropdown.classList.add('active');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
            searchOpenedDropdown = true;
          }
        }
      });

      emptyState.classList.toggle('is-visible', visibleCount === 0 && extraCount === 0);
    }

    function reset() {
      if (!input.value && !searchOpenedDropdown) {
        resetVisibility();
        return;
      }
      input.value = '';
      filterMenu('');
    }

    input.addEventListener('input', () => filterMenu(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && input.value) {
        e.stopPropagation();
        reset();
      }
    });

    return {
      reset,
      focus: () => input.focus({ preventScroll: true }),
    };
  }
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
  
  // Check if it's a primary CTA that should scroll to the form
  const ctaLabel = button ? button.textContent.trim() : '';
  if (button && (ctaLabel === 'Get Started' || ctaLabel === 'Book more jobs')) {
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
