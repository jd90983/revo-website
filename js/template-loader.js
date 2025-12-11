/* ============================================
   Template Loader - Load shared HTML templates
   ============================================ */

/**
 * Loads an HTML template from a file and inserts it into a container
 * @param {string} templatePath - Path to the template HTML file
 * @param {string} containerSelector - CSS selector for the container element
 */
async function loadTemplate(templatePath, containerSelector) {
  try {
    console.log(`Loading template from: ${templatePath}`);
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const container = document.querySelector(containerSelector);
    if (container) {
      container.innerHTML = html;
      console.log('Template loaded successfully into:', containerSelector);
      
      // Re-inicializar scripts si es necesario
      // Por ejemplo, si hay animaciones o interactividad
      if (typeof initGetStartedSection === 'function') {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          initGetStartedSection();
        }, 50);
      }
      
      // Initialize Get Started Form section if template is loaded
      if (html.includes('get-started-form-section')) {
        setTimeout(() => {
          initGetStartedFormSection();
        }, 100);
      }
      
      // Initialize Transform CTA section if template is loaded
      if (html.includes('transform-cta-section')) {
        setTimeout(() => {
          initTransformCTASection();
        }, 100);
      }
      
      // Initialize Experience the Power section if template is loaded
      if (html.includes('experience-power-section') || html.includes('ser-experience-power')) {
        setTimeout(() => {
          initExperiencePowerSection();
        }, 100);
      }
      
      // Trigger custom event for other scripts to listen
      const event = new CustomEvent('templateLoaded', {
        detail: { templatePath, containerSelector }
      });
      document.dispatchEvent(event);
    } else {
      console.warn(`Container not found: ${containerSelector}`);
    }
  } catch (error) {
    console.error('Error loading template:', error);
    // Fallback: show error message in container if it exists
    const container = document.querySelector(containerSelector);
    if (container) {
      container.innerHTML = `<div style="background: #ff0000; color: white; padding: 20px; border-radius: 8px; margin: 20px;">
        <strong>Error loading template:</strong><br>
        ${error.message}<br>
        <small>Make sure you're running a local server (not opening file directly)</small>
      </div>`;
    }
  }
}

/**
 * Initialize the Get Started section after template is loaded
 * This can be used to add event listeners, animations, etc.
 */
function initGetStartedSection() {
  const section = document.querySelector('.ser-get-started');
  if (!section) {
    console.warn('Get Started section not found after template load');
    return;
  }
  
  // Initialize scroll animations for the loaded section
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Mark section for animation and set initial state
    section.setAttribute('data-animate', 'true');
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Small delay to ensure styles are applied
    setTimeout(() => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      sectionObserver.observe(section);
    }, 10);
  }
  
  console.log('Get Started section template loaded and initialized');
}

/**
 * Initialize the Get Started Form section after template is loaded
 * This initializes form functionality and animations
 */
function initGetStartedFormSection() {
  const section = document.querySelector('.get-started-form-section');
  if (!section) {
    console.warn('Get Started Form section not found after template load');
    return;
  }
  
  // Initialize scroll animations for the loaded section
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sectionObserver.observe(section);
  }
  
  // Initialize form functionality after template loads
  // This ensures the gradient stroke and validation work
  if (typeof window.initGetStartedForm === 'function') {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
      window.initGetStartedForm();
    }, 100);
  }
  
  // Initialize background transition animation
  if (typeof initGetStartedFormTransition === 'function') {
    initGetStartedFormTransition();
  }
  
  console.log('Get Started Form section template loaded and initialized');
}

/**
 * Initialize the Transform CTA section after template is loaded
 * This initializes scroll animations
 */
function initTransformCTASection() {
  const section = document.querySelector('.transform-cta-section');
  if (!section) {
    console.warn('Transform CTA section not found after template load');
    return;
  }
  
  // Initialize scroll animations for the loaded section
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sectionObserver.observe(section);
  }
  
  console.log('Transform CTA section template loaded and initialized');
}

/**
 * Initialize the Experience the Power section after template is loaded
 * This initializes scroll animations
 */
function initExperiencePowerSection() {
  const section = document.querySelector('.ser-experience-power');
  if (!section) {
    console.warn('Experience the Power section not found after template load');
    return;
  }
  
  // Initialize scroll animations for the loaded section
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sectionObserver.observe(section);
  }
  
  console.log('Experience the Power section template loaded and initialized');
}

