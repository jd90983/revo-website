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
      let processedHtml = html;
      
      // Pre-process Get Started section template to set initial state BEFORE inserting into DOM
      // This prevents the "flash" where section appears, disappears, then animates
      if (html.includes('ser-get-started') || html.includes('get-started-section')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const sectionInHTML = tempDiv.querySelector('.ser-get-started');
        if (sectionInHTML) {
          // Remove animate-in class and set initial state BEFORE DOM insertion
          sectionInHTML.classList.remove('animate-in');
          sectionInHTML.style.setProperty('opacity', '0', 'important');
          sectionInHTML.style.setProperty('transform', 'translateY(30px)', 'important');
          sectionInHTML.style.setProperty('transition', 'opacity 0.6s ease, transform 0.6s ease', 'important');
          // Get the modified HTML with initial state already set
          processedHtml = tempDiv.innerHTML;
        }
      }
      
      // Insert the pre-processed HTML (with initial state already set, so no flash)
      container.innerHTML = processedHtml;
      console.log('Template loaded successfully into:', containerSelector);
      
      // Initialize Get Started section if template is loaded
      if (html.includes('ser-get-started') || html.includes('get-started-section')) {
        // Small delay to ensure DOM is ready, then initialize observer
        setTimeout(() => {
          if (typeof initGetStartedSection === 'function') {
            initGetStartedSection();
          }
        }, 10);
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
  
  // Mark that this section is initialized by template loader
  section.setAttribute('data-template-initialized', 'true');
  
  // Remove animate-in class if it exists (shouldn't exist if pre-processing worked)
  section.classList.remove('animate-in');
  section.removeAttribute('data-animation-initialized');
  
  // Mark section for animation
  section.setAttribute('data-animate', 'true');
  
  // Initial state should already be set from pre-processing before DOM insertion
  // Don't re-apply styles here to avoid causing a flash/desvanecimiento
  // The section should already have opacity: 0 and transform: translateY(30px) from pre-processing
  
  // Small delay to ensure DOM is fully ready and styles are applied
  requestAnimationFrame(() => {
    // Initialize scroll animations for the loaded section
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add animate-in class which will trigger CSS animation
            entry.target.classList.add('animate-in');
            
            // Remove inline styles after animation completes to allow CSS to take over
            setTimeout(() => {
              entry.target.style.removeProperty('opacity');
              entry.target.style.removeProperty('transform');
            }, 650); // Wait for animation to complete (600ms + 50ms buffer)
            
            sectionObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      sectionObserver.observe(section);
      
      // If section is already in viewport, trigger animation after ensuring initial state
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Ensure we wait a bit to see the initial state before animating
        setTimeout(() => {
          section.classList.add('animate-in');
          setTimeout(() => {
            section.style.removeProperty('opacity');
            section.style.removeProperty('transform');
          }, 650);
        }, 200); // Increased delay to ensure initial state is visible
      }
    }
  });
  
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
  
  // Remove animate-in class if it exists (from template)
  section.classList.remove('animate-in');
  
  // Set initial animation state
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  // Small delay to ensure DOM is ready
  setTimeout(() => {
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
            // Remove inline styles to allow CSS animations to work smoothly
            entry.target.style.opacity = '';
            entry.target.style.transform = '';
            sectionObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      sectionObserver.observe(section);
      
      // If section is already in viewport, trigger animation immediately
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        section.classList.add('animate-in');
        section.style.opacity = '';
        section.style.transform = '';
      }
    }
  }, 100);
  
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

