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

// Form submission handler
function handleFormSubmission(form) {
  // Get all form fields
  const formData = {
    firstName: form.querySelector('#firstName').value.trim(),
    lastName: form.querySelector('#lastName').value.trim(),
    contactNumber: form.querySelector('#contactNumber').value.trim(),
    email: form.querySelector('#email').value.trim(),
    industry: form.querySelector('#industry').value,
    callsPerWeek: form.querySelector('#callsPerWeek').value
  };

  // Validate all required fields
  const requiredFields = ['firstName', 'lastName', 'contactNumber', 'email', 'industry', 'callsPerWeek'];
  let isValid = true;
  let firstInvalidField = null;

  requiredFields.forEach(fieldName => {
    const field = form.querySelector(`#${fieldName}`);
    if (!field) return;
    
    validateField(field);
    const wrapper = field.closest('.get-started-form-input-wrapper');
    
    if (!formData[fieldName] || formData[fieldName] === '') {
      isValid = false;
      if (wrapper) wrapper.classList.remove('valid');
      if (!firstInvalidField) firstInvalidField = field;
    }
  });

  // Additional email validation
  if (formData.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      isValid = false;
      const emailField = form.querySelector('#email');
      const emailWrapper = emailField.closest('.get-started-form-input-wrapper');
      if (emailWrapper) emailWrapper.classList.remove('valid');
      if (!firstInvalidField) firstInvalidField = emailField;
    }
  }

  // Additional phone validation
  if (formData.contactNumber) {
    const digitsOnly = formData.contactNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      isValid = false;
      const phoneField = form.querySelector('#contactNumber');
      const phoneWrapper = phoneField.closest('.get-started-form-input-wrapper');
      if (phoneWrapper) phoneWrapper.classList.remove('valid');
      if (!firstInvalidField) firstInvalidField = phoneField;
    }
  }

  if (!isValid) {
    // Scroll to first invalid field
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidField.focus();
    }
    showFormMessage(form, 'Please fill in all required fields correctly.', 'error');
    return false;
  }

  // Disable submit button and show loading state
  const submitBtn = form.querySelector('.get-started-form-submit-btn');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  // Save to localStorage as backup
  try {
    const submissions = JSON.parse(localStorage.getItem('revoFormSubmissions') || '[]');
    const submission = {
      ...formData,
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toLocaleString()
    };
    submissions.push(submission);
    // Keep only last 100 submissions
    if (submissions.length > 100) {
      submissions.shift();
    }
    localStorage.setItem('revoFormSubmissions', JSON.stringify(submissions));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  // Send form data to API (saves to Supabase and sends email)
  sendFormToAPI(formData, form, submitBtn, originalBtnText);

  return false; // Prevent default form submission
}

// Send form data to Vercel API route (saves to Supabase and sends email)
async function sendFormToAPI(formData, form, submitBtn, originalBtnText) {
  // Determine API URL - use deployed URL for localhost, relative for production
  // Declare outside try block so it's accessible in catch
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiUrl = isLocalhost 
    ? 'https://revoapp.ai/api/submit-form'  // Use deployed API for localhost testing
    : '/api/submit-form';  // Use relative URL when deployed
  
  console.log('Submitting form to:', apiUrl, 'from:', window.location.hostname);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    // Check if response is OK and is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        url: response.url,
        text: text.substring(0, 500)
      });
      throw new Error(`Server returned ${response.status} ${response.statusText}. The API endpoint may not be deployed correctly.`);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Submission failed with status ${response.status}`);
    }

    // Success - form submitted and saved to database
    showFormMessage(form, 'Thank you! Your information has been received. We\'ll contact you soon.', 'success');
    form.reset();
    
    // Clear validation states
    form.querySelectorAll('.get-started-form-input-wrapper').forEach(wrapper => {
      wrapper.classList.remove('valid');
    });

  } catch (error) {
    console.error('Form submission error:', error);
    
    // Show error message to help with debugging
    const errorMessage = error.message || 'Failed to submit form. Please check console for details.';
    console.error('Full error details:', {
      message: error.message,
      apiUrl: apiUrl,
      formData: formData,
      errorType: error.name
    });
    
    // Show error message to user (for debugging)
    showFormMessage(form, `Error: ${errorMessage}. Data saved locally as backup.`, 'error');
    
    // Data is still saved to localStorage as backup
    // Don't reset form so user can try again
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

// Show form message (success or error)
function showFormMessage(form, message, type) {
  // Remove existing message
  const existingMessage = form.querySelector('.get-started-form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `get-started-form-message get-started-form-message-${type}`;
  messageEl.textContent = message;
  
  // Insert before submit button
  const submitBtn = form.querySelector('.get-started-form-submit-btn');
  form.insertBefore(messageEl, submitBtn);

  // Auto-remove success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }

  // Scroll to message
  messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize form submission handler
function initFormSubmission() {
  const forms = document.querySelectorAll('.get-started-form-form');
  
  forms.forEach(form => {
    // Skip if already initialized
    if (form.hasAttribute('data-submission-initialized')) {
      return;
    }
    
    form.setAttribute('data-submission-initialized', 'true');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmission(this);
    });
  });
}

// Initialize form submission on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initFormSubmission();
});

// Also initialize when templates are loaded
const originalInitGetStartedForm = initGetStartedForm;
initGetStartedForm = function() {
  originalInitGetStartedForm();
  // Small delay to ensure form is in DOM
  setTimeout(initFormSubmission, 100);
};

// Make function available globally for template loader
window.initGetStartedForm = initGetStartedForm;

