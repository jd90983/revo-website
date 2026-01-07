/* ============================================
   Products Section - Sticky Scroll Behavior
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const productsSection = document.querySelector('.ser-products-section');
  if (!productsSection) return;
  
  const productsContent = productsSection.querySelector('.products-content');
  const productsItems = productsSection.querySelectorAll('.products-item');
  const productsImage = productsSection.querySelector('#products-image');
  
  if (!productsContent || productsItems.length === 0 || !productsImage) return;
  
  const totalItems = productsItems.length;
  let currentActiveIndex = 0;
  let sectionStartY = null;
  let sectionEndY = null;
  
  // Image paths for each product
  const productImages = [
    'images/services/24_7-Availability.png', // 24/7 Availability
    'images/services/Smart Call-Management.png', // Smart Call Management
    'images/services/AI-Caller-Memory-&-Context-Recall.png' // AI Caller Memory & Context Recall
  ];
  
  // Check if mobile/tablet
  const isMobileOrTablet = () => {
    return window.innerWidth < 1024;
  };
  
  // Initialize: hide all descriptions and buttons except the first one (only in desktop)
  productsItems.forEach((item, index) => {
    if (isMobileOrTablet()) {
      // In mobile/tablet, show all content
      item.classList.add('active');
      const description = item.querySelector('.products-description');
      const actions = item.querySelector('.products-actions');
      if (description) {
        description.style.removeProperty('max-height');
        description.style.removeProperty('opacity');
        description.style.removeProperty('margin-bottom');
        description.style.removeProperty('padding');
      }
      if (actions) {
        actions.style.removeProperty('max-height');
        actions.style.removeProperty('opacity');
        actions.style.removeProperty('margin');
        actions.style.removeProperty('padding');
      }
    } else {
      // Desktop behavior: hide all except first
      if (index !== 0) {
        item.classList.remove('active');
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          description.style.setProperty('max-height', '0', 'important');
          description.style.setProperty('opacity', '0', 'important');
          description.style.setProperty('margin-bottom', '0', 'important');
          description.style.setProperty('padding', '0', 'important');
        }
        if (actions) {
          actions.style.setProperty('max-height', '0', 'important');
          actions.style.setProperty('opacity', '0', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      } else {
        item.classList.add('active');
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            const height = description.scrollHeight || 200;
            description.style.setProperty('max-height', height + 'px', 'important');
            description.style.setProperty('opacity', '1', 'important');
            description.style.setProperty('margin-bottom', '24px', 'important');
            description.style.setProperty('padding', '0', 'important');
          }, 50);
        }
        if (actions) {
          actions.style.setProperty('max-height', '100px', 'important');
          actions.style.setProperty('opacity', '1', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      }
    }
  });
  
  // Function to activate a product item
  const activateItem = (index) => {
    if (index < 0 || index >= totalItems) return;
    
    // In mobile/tablet, don't hide/show content - just update active class for styling
    if (isMobileOrTablet()) {
      currentActiveIndex = index;
      productsItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      return;
    }
    
    // Desktop behavior: show/hide content
    // Allow activation even if same index (to refresh/ensure state)
    if (index === currentActiveIndex) {
      // Force refresh the active item to ensure it's visible
      const activeItem = productsItems[index];
      if (activeItem) {
        const description = activeItem.querySelector('.products-description');
        const actions = activeItem.querySelector('.products-actions');
        if (description) {
          requestAnimationFrame(() => {
            const height = description.scrollHeight || 200;
            description.style.maxHeight = height + 'px';
            description.style.opacity = '1';
            description.style.marginBottom = '24px';
            description.style.padding = '0';
          });
        }
        if (actions) {
          actions.style.maxHeight = '100px';
          actions.style.opacity = '1';
          actions.style.margin = '0';
          actions.style.padding = '0';
        }
      }
      return;
    }
    
    const previousIndex = currentActiveIndex;
    currentActiveIndex = index;
    
    // Remove active class from all items
    productsItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
        // Ensure description and actions are visible
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            const height = description.scrollHeight || 200;
            // Use setProperty with important to override CSS !important
            description.style.setProperty('max-height', height + 'px', 'important');
            description.style.setProperty('opacity', '1', 'important');
            description.style.setProperty('margin-bottom', '24px', 'important');
            description.style.setProperty('padding', '0', 'important');
          });
        }
        if (actions) {
          // Use setProperty with important to override CSS !important
          actions.style.setProperty('max-height', '100px', 'important');
          actions.style.setProperty('opacity', '1', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      } else {
        item.classList.remove('active');
        // Hide description and actions for inactive items
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          // Use setProperty with important to override CSS !important
          description.style.setProperty('max-height', '0', 'important');
          description.style.setProperty('opacity', '0', 'important');
          description.style.setProperty('margin-bottom', '0', 'important');
          description.style.setProperty('padding', '0', 'important');
        }
        if (actions) {
          // Use setProperty with important to override CSS !important
          actions.style.setProperty('max-height', '0', 'important');
          actions.style.setProperty('opacity', '0', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      }
    });
    
    // Update image with smooth transition
    if (productImages[index] && productsImage) {
      const newImage = new Image();
      newImage.onload = () => {
        productsImage.style.transition = 'opacity 0.4s ease';
        productsImage.style.opacity = '0';
        setTimeout(() => {
          productsImage.src = productImages[index];
          productsImage.style.opacity = '1';
        }, 200);
      };
      newImage.onerror = () => {
        productsImage.src = productImages[index];
        productsImage.style.opacity = '1';
      };
      newImage.src = productImages[index];
    }
  };
  
  // Sticky scroll behavior - only on desktop
  const checkScrollProgress = () => {
    if (isMobileOrTablet()) return;
    
    const productsWrapper = productsSection.querySelector('.products_wr');
    if (!productsWrapper) return;
    
    const viewportHeight = window.innerHeight;
    const navbarHeight = 72;
    const currentScrollY = window.scrollY || window.pageYOffset;
    
    // Calculate when content becomes sticky
    const contentRect = productsContent.getBoundingClientRect();
    const contentTop = contentRect.top;
    const contentBottom = contentRect.bottom;
    const wrapperRect = productsWrapper.getBoundingClientRect();
    
    // Check if section is completely out of viewport (reset only when really out of view)
    // Use a larger threshold to prevent premature reset
    if (wrapperRect.bottom < -500 || wrapperRect.top > viewportHeight + 500) {
      if (sectionStartY !== null) {
        sectionStartY = null;
        sectionEndY = null;
        console.log('🔄 Section reset - out of view');
      }
      return;
    }
    
    // Initialize section start/end positions when content becomes sticky
    // Sticky activates when content top is at or just below navbar
    if (sectionStartY === null) {
      // Very lenient detection: content top should be near navbar height
      // This will catch the sticky moment more reliably
      if (contentTop <= navbarHeight + 100 && contentTop >= navbarHeight - 150) {
        sectionStartY = currentScrollY;
        sectionEndY = sectionStartY + (viewportHeight * totalItems);
        console.log('✅✅✅ STICKY ACTIVATED! Start:', sectionStartY, 'End:', sectionEndY, 'Content top:', Math.round(contentTop));
      }
    }
    
    // If section is sticky, calculate progress
    // Allow reverse scrolling by checking if we're within the section bounds
    if (sectionStartY !== null) {
      // Calculate scroll progress (can be negative or > 1 for reverse scrolling)
      const scrolled = currentScrollY - sectionStartY;
      const scrollDistance = viewportHeight * totalItems;
      let scrollProgress = scrolled / scrollDistance; // Don't clamp to allow reverse
      
      // Determine which item should be active based on scroll progress
      // Each item gets 1/3 of the scroll distance
      let itemIndex;
      
      // Clamp scrollProgress to a reasonable range for calculation
      // Allow some negative values but not too extreme
      const clampedProgress = Math.max(-0.1, Math.min(1.1, scrollProgress));
      
      if (clampedProgress >= 1) {
        // Past the end - stay on last item
        itemIndex = totalItems - 1;
      } else if (clampedProgress <= 0) {
        // At or before start - stay on first item
        itemIndex = 0;
      } else {
        // Within range - calculate based on progress
        // Use a smoother calculation that doesn't jump too quickly
        itemIndex = Math.floor(clampedProgress * totalItems);
        
        // Ensure we catch the last item near the end
        if (clampedProgress >= 0.95) {
          itemIndex = totalItems - 1;
        }
        
        // Ensure we catch the first item near the start (but with a buffer)
        if (clampedProgress <= 0.1) {
          itemIndex = 0;
        }
      }
      
      // Clamp to valid range
      itemIndex = Math.min(totalItems - 1, Math.max(0, itemIndex));
      
      // Only activate if index actually changed (prevents unnecessary updates)
      if (itemIndex !== currentActiveIndex) {
        console.log('🔄 Changing item:', currentActiveIndex, '→', itemIndex, 'Progress:', scrollProgress.toFixed(3), 'Clamped:', clampedProgress.toFixed(3), 'Scrolled:', scrolled.toFixed(0));
        activateItem(itemIndex);
      }
      
      // Don't reset sectionStartY/sectionEndY when scrolling past the end
      // Only reset when section is completely out of view (handled above)
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
  
  // Debug: Log initial state
  console.log('🔍 Products section initialized:', {
    totalItems,
    currentActiveIndex,
    isMobileOrTablet: isMobileOrTablet(),
    viewportHeight: window.innerHeight,
    productsContent: !!productsContent,
    productsWrapper: !!productsSection.querySelector('.products_wr')
  });
  
  // Initial check - run multiple times to catch sticky state
  setTimeout(() => {
    checkScrollProgress();
  }, 100);
  
  setTimeout(() => {
    checkScrollProgress();
  }, 500);
  
  setTimeout(() => {
    checkScrollProgress();
  }, 1000);
  
  // Also check on every scroll to see what's happening
  // This will help us debug why sticky isn't activating
  
  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      sectionStartY = null;
      sectionEndY = null;
      checkScrollProgress();
    }, 250);
  }, { passive: true });
  
  // Click handlers for mobile/tablet
  productsItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (isMobileOrTablet()) {
        activateItem(index);
      }
    });
  });
});

/* ============================================
   Features Section - Sticky Scroll Behavior (Dark Theme)
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const featuresSection = document.querySelector('.ser-features-section');
  if (!featuresSection) return;
  
  const featuresContent = featuresSection.querySelector('.products-content');
  const featuresItems = featuresSection.querySelectorAll('.products-item');
  const featuresImage = featuresSection.querySelector('#features-image');
  
  if (!featuresContent || featuresItems.length === 0 || !featuresImage) return;
  
  const totalItems = featuresItems.length;
  let currentActiveIndex = 0;
  let sectionStartY = null;
  let sectionEndY = null;
  
  // Image paths for each feature
  const featureImages = [
    'images/services/Personalized AI Reception.png', // Personalized AI Reception
    'images/services/Smart Response Timing.png', // Smart Response Timing
    'images/services/Detailed Call Reports.png' // Detailed Call Reports
  ];
  
  // Check if mobile/tablet
  const isMobileOrTablet = () => {
    return window.innerWidth < 1024;
  };
  
  // Initialize: hide all descriptions and buttons except the first one (only in desktop)
  featuresItems.forEach((item, index) => {
    if (isMobileOrTablet()) {
      // In mobile/tablet, show all content
      item.classList.add('active');
      const description = item.querySelector('.products-description');
      const actions = item.querySelector('.products-actions');
      if (description) {
        description.style.removeProperty('max-height');
        description.style.removeProperty('opacity');
        description.style.removeProperty('margin-bottom');
        description.style.removeProperty('padding');
      }
      if (actions) {
        actions.style.removeProperty('max-height');
        actions.style.removeProperty('opacity');
        actions.style.removeProperty('margin');
        actions.style.removeProperty('padding');
      }
    } else {
      // Desktop behavior: hide all except first
      if (index !== 0) {
        item.classList.remove('active');
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          description.style.setProperty('max-height', '0', 'important');
          description.style.setProperty('opacity', '0', 'important');
          description.style.setProperty('margin-bottom', '0', 'important');
          description.style.setProperty('padding', '0', 'important');
        }
        if (actions) {
          actions.style.setProperty('max-height', '0', 'important');
          actions.style.setProperty('opacity', '0', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      } else {
        item.classList.add('active');
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            const height = description.scrollHeight || 200;
            description.style.setProperty('max-height', height + 'px', 'important');
            description.style.setProperty('opacity', '1', 'important');
            description.style.setProperty('margin-bottom', '24px', 'important');
            description.style.setProperty('padding', '0', 'important');
          }, 50);
        }
        if (actions) {
          actions.style.setProperty('max-height', '100px', 'important');
          actions.style.setProperty('opacity', '1', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      }
    }
  });
  
  // Function to activate a feature item
  const activateItem = (index) => {
    if (index < 0 || index >= totalItems) return;
    
    // In mobile/tablet, don't hide/show content - just update active class for styling
    if (isMobileOrTablet()) {
      currentActiveIndex = index;
      featuresItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      return;
    }
    
    // Desktop behavior: show/hide content
    // Allow activation even if same index (to refresh/ensure state)
    if (index === currentActiveIndex) {
      // Force refresh the active item to ensure it's visible
      const activeItem = featuresItems[index];
      if (activeItem) {
        const description = activeItem.querySelector('.products-description');
        const actions = activeItem.querySelector('.products-actions');
        if (description) {
          requestAnimationFrame(() => {
            const height = description.scrollHeight || 200;
            description.style.maxHeight = height + 'px';
            description.style.opacity = '1';
            description.style.marginBottom = '24px';
            description.style.padding = '0';
          });
        }
        if (actions) {
          actions.style.maxHeight = '100px';
          actions.style.opacity = '1';
          actions.style.margin = '0';
          actions.style.padding = '0';
        }
      }
      return;
    }
    
    const previousIndex = currentActiveIndex;
    currentActiveIndex = index;
    
    // Remove active class from all items
    featuresItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
        // Ensure description and actions are visible
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            const height = description.scrollHeight || 200;
            // Use setProperty with important to override CSS !important
            description.style.setProperty('max-height', height + 'px', 'important');
            description.style.setProperty('opacity', '1', 'important');
            description.style.setProperty('margin-bottom', '24px', 'important');
            description.style.setProperty('padding', '0', 'important');
          });
        }
        if (actions) {
          // Use setProperty with important to override CSS !important
          actions.style.setProperty('max-height', '100px', 'important');
          actions.style.setProperty('opacity', '1', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      } else {
        item.classList.remove('active');
        // Hide description and actions for inactive items
        const description = item.querySelector('.products-description');
        const actions = item.querySelector('.products-actions');
        if (description) {
          // Use setProperty with important to override CSS !important
          description.style.setProperty('max-height', '0', 'important');
          description.style.setProperty('opacity', '0', 'important');
          description.style.setProperty('margin-bottom', '0', 'important');
          description.style.setProperty('padding', '0', 'important');
        }
        if (actions) {
          // Use setProperty with important to override CSS !important
          actions.style.setProperty('max-height', '0', 'important');
          actions.style.setProperty('opacity', '0', 'important');
          actions.style.setProperty('margin', '0', 'important');
          actions.style.setProperty('padding', '0', 'important');
        }
      }
    });
    
    // Update image with smooth transition
    if (featureImages[index] && featuresImage) {
      const newImage = new Image();
      newImage.onload = () => {
        featuresImage.style.transition = 'opacity 0.4s ease';
        featuresImage.style.opacity = '0';
        setTimeout(() => {
          featuresImage.src = featureImages[index];
          featuresImage.style.opacity = '1';
        }, 200);
      };
      newImage.onerror = () => {
        featuresImage.src = featureImages[index];
        featuresImage.style.opacity = '1';
      };
      newImage.src = featureImages[index];
    }
  };
  
  // Sticky scroll behavior - only on desktop
  const checkScrollProgress = () => {
    if (isMobileOrTablet()) return;
    
    const featuresWrapper = featuresSection.querySelector('.products_wr');
    if (!featuresWrapper) return;
    
    const viewportHeight = window.innerHeight;
    const navbarHeight = 72;
    const currentScrollY = window.scrollY || window.pageYOffset;
    
    // Calculate when content becomes sticky
    const contentRect = featuresContent.getBoundingClientRect();
    const contentTop = contentRect.top;
    const contentBottom = contentRect.bottom;
    const wrapperRect = featuresWrapper.getBoundingClientRect();
    
    // Check if section is completely out of viewport (reset only when really out of view)
    // Use a larger threshold to prevent premature reset
    if (wrapperRect.bottom < -500 || wrapperRect.top > viewportHeight + 500) {
      if (sectionStartY !== null) {
        sectionStartY = null;
        sectionEndY = null;
        console.log('🔄 Features section reset - out of view');
      }
      return;
    }
    
    // Initialize section start/end positions when content becomes sticky
    // Sticky activates when content top is at or just below navbar
    if (sectionStartY === null) {
      // Very lenient detection: content top should be near navbar height
      // This will catch the sticky moment more reliably
      if (contentTop <= navbarHeight + 100 && contentTop >= navbarHeight - 150) {
        sectionStartY = currentScrollY;
        sectionEndY = sectionStartY + (viewportHeight * totalItems);
        console.log('✅✅✅ FEATURES STICKY ACTIVATED! Start:', sectionStartY, 'End:', sectionEndY, 'Content top:', Math.round(contentTop));
      }
    }
    
    // If section is sticky, calculate progress
    // Allow reverse scrolling by checking if we're within the section bounds
    if (sectionStartY !== null) {
      // Calculate scroll progress (can be negative or > 1 for reverse scrolling)
      const scrolled = currentScrollY - sectionStartY;
      const scrollDistance = viewportHeight * totalItems;
      let scrollProgress = scrolled / scrollDistance; // Don't clamp to allow reverse
      
      // Determine which item should be active based on scroll progress
      // Each item gets 1/3 of the scroll distance
      let itemIndex;
      
      // Clamp scrollProgress to a reasonable range for calculation
      // Allow some negative values but not too extreme
      const clampedProgress = Math.max(-0.1, Math.min(1.1, scrollProgress));
      
      if (clampedProgress >= 1) {
        // Past the end - stay on last item
        itemIndex = totalItems - 1;
      } else if (clampedProgress <= 0) {
        // At or before start - stay on first item
        itemIndex = 0;
      } else {
        // Within range - calculate based on progress
        // Use a smoother calculation that doesn't jump too quickly
        itemIndex = Math.floor(clampedProgress * totalItems);
        
        // Ensure we catch the last item near the end
        if (clampedProgress >= 0.95) {
          itemIndex = totalItems - 1;
        }
        
        // Ensure we catch the first item near the start (but with a buffer)
        if (clampedProgress <= 0.1) {
          itemIndex = 0;
        }
      }
      
      // Clamp to valid range
      itemIndex = Math.min(totalItems - 1, Math.max(0, itemIndex));
      
      // Only activate if index actually changed (prevents unnecessary updates)
      if (itemIndex !== currentActiveIndex) {
        console.log('🔄 Changing feature item:', currentActiveIndex, '→', itemIndex, 'Progress:', scrollProgress.toFixed(3), 'Clamped:', clampedProgress.toFixed(3), 'Scrolled:', scrolled.toFixed(0));
        activateItem(itemIndex);
      }
      
      // Don't reset sectionStartY/sectionEndY when scrolling past the end
      // Only reset when section is completely out of view (handled above)
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
  
  // Debug: Log initial state
  console.log('🔍 Features section initialized:', {
    totalItems,
    currentActiveIndex,
    isMobileOrTablet: isMobileOrTablet(),
    viewportHeight: window.innerHeight,
    featuresContent: !!featuresContent,
    featuresWrapper: !!featuresSection.querySelector('.products_wr')
  });
  
  // Initial check - run multiple times to catch sticky state
  setTimeout(() => {
    checkScrollProgress();
  }, 100);
  
  setTimeout(() => {
    checkScrollProgress();
  }, 500);
  
  setTimeout(() => {
    checkScrollProgress();
  }, 1000);
  
  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      sectionStartY = null;
      sectionEndY = null;
      checkScrollProgress();
    }, 250);
  }, { passive: true });
  
  // Click handlers for mobile/tablet
  featuresItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (isMobileOrTablet()) {
        activateItem(index);
      }
    });
  });
});

