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
});

