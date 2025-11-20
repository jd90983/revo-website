/* ============================================
   Main JavaScript - Forms & Utilities
   ============================================ */

// Newsletter Form Validation
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  const emailInput = newsletterForm.querySelector('input[type="email"]');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove previous error state
    emailInput.classList.remove('error');

    if (!email) {
      showMessage('Please enter your email address', 'error');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    // Success - handle submission
    showMessage('Thank you for subscribing!', 'success');
    emailInput.value = '';
    emailInput.classList.remove('error');

    // Here you would typically send the data to your backend
    console.log('Email submitted:', email);
  });

  // Clear error state on input
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
  });
}

// Message Display Function
function showMessage(message, type) {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(messageEl);

  // Remove after 3 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(messageEl);
    }, 300);
  }, 3000);
}

// Lazy Loading Images (if not using native lazy loading)
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if ('IntersectionObserver' in window) {
  lazyLoadImages();
}

// Prevent default for dummy links (links with href="#")
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

// Performance Monitoring (Optional - for development)
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    console.log('Page Load Time:', pageLoadTime + 'ms');

    // You can send this to analytics
  });
}

// Accessibility: Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
  body:not(.keyboard-nav) *:focus {
    outline: none;
  }

  body.keyboard-nav *:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;
document.head.appendChild(focusStyle);
