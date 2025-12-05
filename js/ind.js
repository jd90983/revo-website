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
});

