/* ============================================
   Sticky Products Section - Standalone Version
   (No ES6 modules - works in all browsers)
   ============================================ */

(function() {
  'use strict';

  function initStickyProductsSection(config) {
    const sectionSelector = config.sectionSelector;
    const imageId = config.imageId;
    const imagePaths = config.imagePaths || [];

    // Validate required config
    if (!sectionSelector || !imageId) {
      console.error('❌ StickyProductsSection: Missing required config (sectionSelector, imageId)');
      return;
    }

    function initializeSection() {
      const section = document.querySelector(sectionSelector);
      if (!section) {
        console.warn('⚠️ StickyProductsSection: Section not found: ' + sectionSelector);
        return;
      }
      
      const productsContent = section.querySelector('.products-content');
      const productsItems = section.querySelectorAll('.products-item');
      const productsImage = document.getElementById(imageId);
      
      if (!productsContent || productsItems.length === 0 || !productsImage) {
        console.warn('⚠️ StickyProductsSection: Required elements not found in ' + sectionSelector);
        return;
      }
      
      const totalItems = productsItems.length;
      let currentActiveIndex = 0;
      let sectionStartY = null;
      let sectionEndY = null;
      
      // Use provided image paths or extract from data-image attributes
      function getImagePaths() {
        if (imagePaths.length > 0) {
          return imagePaths;
        }
        // Fallback: extract from data-image attributes
        var paths = [];
        for (var i = 0; i < productsItems.length; i++) {
          var path = productsItems[i].getAttribute('data-image') || '';
          paths.push(path);
        }
        return paths;
      }
      
      const itemImages = getImagePaths();
      
      // Check if mobile/tablet
      function isMobileOrTablet() {
        return window.innerWidth < 1024;
      }
      
      // Initialize: hide all descriptions and buttons except the first one (only in desktop)
      productsItems.forEach(function(item, index) {
        if (isMobileOrTablet()) {
          // In mobile/tablet, show all content
          item.classList.add('active');
          var description = item.querySelector('.products-description');
          var actions = item.querySelector('.products-actions');
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
            var description = item.querySelector('.products-description');
            var actions = item.querySelector('.products-actions');
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
            var description = item.querySelector('.products-description');
            var actions = item.querySelector('.products-actions');
            if (description) {
              // Use setTimeout to ensure DOM is ready
              setTimeout(function() {
                var height = description.scrollHeight || 200;
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
      function activateItem(index) {
        if (index < 0 || index >= totalItems) return;
        
        // In mobile/tablet, don't hide/show content - just update active class for styling
        if (isMobileOrTablet()) {
          currentActiveIndex = index;
          productsItems.forEach(function(item, i) {
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
          var activeItem = productsItems[index];
          if (activeItem) {
            var description = activeItem.querySelector('.products-description');
            var actions = activeItem.querySelector('.products-actions');
            if (description) {
              window.requestAnimationFrame(function() {
                var height = description.scrollHeight || 200;
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
        
        var previousIndex = currentActiveIndex;
        currentActiveIndex = index;
        
        // Remove active class from all items
        productsItems.forEach(function(item, i) {
          if (i === index) {
            item.classList.add('active');
            // Ensure description and actions are visible
            var description = item.querySelector('.products-description');
            var actions = item.querySelector('.products-actions');
            if (description) {
              // Use requestAnimationFrame to ensure DOM is ready
              window.requestAnimationFrame(function() {
                var height = description.scrollHeight || 200;
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
            var description = item.querySelector('.products-description');
            var actions = item.querySelector('.products-actions');
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
        if (itemImages[index] && productsImage) {
          var newImage = new Image();
          newImage.onload = function() {
            productsImage.style.transition = 'opacity 0.4s ease';
            productsImage.style.opacity = '0';
            setTimeout(function() {
              productsImage.src = itemImages[index];
              productsImage.style.opacity = '1';
            }, 200);
          };
          newImage.onerror = function() {
            productsImage.src = itemImages[index];
            productsImage.style.opacity = '1';
          };
          newImage.src = itemImages[index];
        }
      }
      
      // Sticky scroll behavior - only on desktop
      function checkScrollProgress() {
        if (isMobileOrTablet()) return;
        
        var productsWrapper = section.querySelector('.products_wr');
        if (!productsWrapper) return;
        
        var viewportHeight = window.innerHeight;
        var navbarHeight = 72;
        var currentScrollY = window.scrollY || window.pageYOffset;
        
        // Calculate when content becomes sticky
        var contentRect = productsContent.getBoundingClientRect();
        var contentTop = contentRect.top;
        var contentBottom = contentRect.bottom;
        var wrapperRect = productsWrapper.getBoundingClientRect();
        
        // Check if section is completely out of viewport (reset only when really out of view)
        // Use a larger threshold to prevent premature reset
        if (wrapperRect.bottom < -500 || wrapperRect.top > viewportHeight + 500) {
          if (sectionStartY !== null) {
            sectionStartY = null;
            sectionEndY = null;
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
          }
        }
        
        // If section is sticky, calculate progress
        // Allow reverse scrolling by checking if we're within the section bounds
        if (sectionStartY !== null) {
          // Calculate scroll progress (can be negative or > 1 for reverse scrolling)
          var scrolled = currentScrollY - sectionStartY;
          var scrollDistance = viewportHeight * totalItems;
          var scrollProgress = scrolled / scrollDistance; // Don't clamp to allow reverse
          
          // Determine which item should be active based on scroll progress
          // Each item gets 1/N of the scroll distance
          var itemIndex;
          
          // Clamp scrollProgress to a reasonable range for calculation
          // Allow some negative values but not too extreme
          var clampedProgress = Math.max(-0.1, Math.min(1.1, scrollProgress));
          
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
            activateItem(itemIndex);
          }
        }
      }
      
      // Throttled scroll handler
      var ticking = false;
      function handleScroll() {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            checkScrollProgress();
            ticking = false;
          });
          ticking = true;
        }
      }
      
      // Listen to scroll events
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check - run multiple times to catch sticky state
      setTimeout(function() {
        checkScrollProgress();
      }, 100);
      
      setTimeout(function() {
        checkScrollProgress();
      }, 500);
      
      setTimeout(function() {
        checkScrollProgress();
      }, 1000);
      
      // Handle resize
      var resizeTimeout;
      window.addEventListener('resize', function() {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          sectionStartY = null;
          sectionEndY = null;
          checkScrollProgress();
        }, 250);
      }, { passive: true });
      
      // Click handlers for mobile/tablet
      productsItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
          if (isMobileOrTablet()) {
            activateItem(index);
          }
        });
      });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSection);
    } else {
      initializeSection();
    }
  }

  // Export to global scope
  if (typeof window !== 'undefined') {
    window.initStickyProductsSection = initStickyProductsSection;
  }
})();

