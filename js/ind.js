// Ind Page Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.ind-faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.ind-faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });

  // Benefits Tabs (if needed for future interactivity)
  const benefitTabs = document.querySelectorAll('.ind-benefits-tabs .ind-tab-item');
  
  benefitTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      benefitTabs.forEach(otherTab => {
        otherTab.classList.remove('active');
      });
      
      // Add active class to clicked tab
      tab.classList.add('active');
    });
  });

  // Features Personalized Tabs
  const personalizedTabs = document.querySelectorAll('.ind-features-personalized-tabs .ind-tab-item');
  
  personalizedTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      personalizedTabs.forEach(otherTab => {
        otherTab.classList.remove('active');
      });
      
      // Add active class to clicked tab
      tab.classList.add('active');
    });
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

  // Animate the features sticky container on scroll
  const featuresContainer = document.querySelector('.ind-features-sticky-container');
  if (featuresContainer && 'IntersectionObserver' in window) {
    // Set initial state for animation
    featuresContainer.style.opacity = '0';
    featuresContainer.style.transform = 'translateY(30px)';
    featuresContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    const containerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          containerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    containerObserver.observe(featuresContainer);
  }

  // Animate the ser-benefits sections on scroll
  const serBenefitsSections = document.querySelectorAll('.ser-benefits');
  serBenefitsSections.forEach(serBenefitsSection => {
    if (serBenefitsSection && 'IntersectionObserver' in window) {
      // Set initial state for animation
      serBenefitsSection.style.opacity = '0';
      serBenefitsSection.style.transform = 'translateY(30px)';
      serBenefitsSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      const benefitsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            benefitsObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      benefitsObserver.observe(serBenefitsSection);
    }
  });

  // Load More functionality for Home Service Categories
  const loadMoreBtn = document.getElementById('home-service-load-more');
  const categoriesGrid = document.getElementById('home-service-categories-grid');
  
  if (loadMoreBtn && categoriesGrid) {
    const itemsPerLoad = 2; // Show 2 more rows (2 items per column)
    let currentlyVisible = 4; // Initially showing 4 items per column (2 rows)
    
    // Initialize: show first 2 rows (4 items per column)
    const columns = categoriesGrid.querySelectorAll('.ind-categories-column');
    columns.forEach(column => {
      const items = column.querySelectorAll('.ind-category-item');
      items.forEach((item, index) => {
        if (index < currentlyVisible) {
          item.setAttribute('data-visible', 'true');
        } else {
          item.setAttribute('data-visible', 'false');
        }
      });
    });
    
    // Check if there are more items to show
    function checkIfMoreItems() {
      let allColumnsHaveMore = false;
      
      columns.forEach(column => {
        const items = column.querySelectorAll('.ind-category-item');
        const hiddenItems = Array.from(items).filter(item => item.getAttribute('data-visible') === 'false');
        if (hiddenItems.length > 0) {
          allColumnsHaveMore = true;
        }
      });
      
      if (!allColumnsHaveMore) {
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }
    }
    
    // Load more items
    loadMoreBtn.addEventListener('click', function() {
      let hasMoreItems = false;
      
      columns.forEach(column => {
        const items = column.querySelectorAll('.ind-category-item');
        const nextVisibleCount = currentlyVisible + itemsPerLoad;
        
        items.forEach((item, index) => {
          if (index >= currentlyVisible && index < nextVisibleCount) {
            item.setAttribute('data-visible', 'true');
            hasMoreItems = true;
          }
        });
      });
      
      currentlyVisible += itemsPerLoad;
      checkIfMoreItems();
    });
    
    // Initial check
    checkIfMoreItems();
  }
});

