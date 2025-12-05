// Get Started Form - Focus gradient border and validation

// Validate fields and show check icon
function validateField(field) {
  const wrapper = field.closest('.get-started-form-input-wrapper');
  if (!wrapper) return;

  let isValid = false;

  if (field.type === 'email') {
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailPattern.test(field.value.trim()) && field.value.trim().length > 0;
  } else if (field.type === 'tel') {
    // Phone validation - at least 10 digits
    const digitsOnly = field.value.replace(/\D/g, '');
    isValid = digitsOnly.length >= 10;
  } else if (field.tagName === 'SELECT') {
    // Select validation
    isValid = field.value !== '' && field.value !== null;
  } else {
    // Text input validation
    isValid = field.value.trim().length > 0;
  }

  if (isValid) {
    wrapper.classList.add('valid');
  } else {
    wrapper.classList.remove('valid');
  }
}

// Initialize form functionality
function initGetStartedForm() {
  // Use a specific container if provided, or search the whole document
  const container = document.querySelector('.get-started-form-section') || document;
  const formFields = container.querySelectorAll('.get-started-form-input-wrapper input, .get-started-form-input-wrapper select');
  
  formFields.forEach(field => {
    // Skip if already initialized
    if (field.hasAttribute('data-form-initialized')) {
      return;
    }
    
    field.setAttribute('data-form-initialized', 'true');
    const wrapper = field.closest('.get-started-form-input-wrapper');
    
    // Focus effect - gradient stroke
    field.addEventListener('focus', function() {
      const currentWrapper = this.closest('.get-started-form-input-wrapper');
      if (currentWrapper) {
        currentWrapper.classList.add('focused');
      }
    });
    
    // Blur effect - remove gradient stroke
    field.addEventListener('blur', function() {
      const currentWrapper = this.closest('.get-started-form-input-wrapper');
      if (currentWrapper) {
        currentWrapper.classList.remove('focused');
        // Validate on blur
        validateField(this);
      }
    });
    
    // For selects, also validate on change
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', function() {
        validateField(this);
      });
    }
  });

  // Phone number field - only allow numbers and phone characters
  const contactNumberField = container.querySelector('#contactNumber');
  if (contactNumberField && !contactNumberField.hasAttribute('data-phone-initialized')) {
    contactNumberField.setAttribute('data-phone-initialized', 'true');
    
    contactNumberField.addEventListener('input', function(e) {
      // Allow only numbers, spaces, parentheses, hyphens, and plus sign
      const phonePattern = /[^0-9\s()\-+]/g;
      e.target.value = e.target.value.replace(phonePattern, '');
      validateField(e.target);
    });

    // Prevent paste of invalid characters
    contactNumberField.addEventListener('paste', function(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const cleanedText = pastedText.replace(/[^0-9\s()\-+]/g, '');
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      e.target.value = e.target.value.substring(0, start) + cleanedText + e.target.value.substring(end);
      e.target.setSelectionRange(start + cleanedText.length, start + cleanedText.length);
      validateField(e.target);
    });
  }
}

// Initialize on DOMContentLoaded (for forms that are already in the page)
document.addEventListener('DOMContentLoaded', function() {
  initGetStartedForm();
});

// Make function available globally for template loader
window.initGetStartedForm = initGetStartedForm;

