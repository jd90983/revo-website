/**
 * Hero Wave Mouse-Following Effect v2.0
 * Makes the Spline 3D wave background bulge/rise towards the mouse cursor
 * 
 * Key technique: Dynamic transform-origin + scale creates the illusion
 * of the wave "mountain" moving towards the cursor
 * 
 * Features:
 * - Dynamic transform-origin follows mouse (bulge effect)
 * - Smooth mouse-following with configurable lag
 * - 3D perspective distortion towards cursor
 * - Scale creates "rising" effect from cursor position
 * - Touch support for mobile
 * - Performance optimized
 * 
 * @author Revo AI
 * @version 2.0.0
 */

(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    // Responsiveness - higher = faster response
    easing: {
      position: 0.04,      // Position follows faster
      origin: 0.06,        // Transform origin follows even faster
      scale: 0.03          // Scale changes smoothly
    },
    
    // Movement range (how far the wave can move in pixels)
    movement: {
      x: 120,              // Maximum X movement (increased)
      y: 80                // Maximum Y movement (increased)
    },
    
    // Scale effect - creates the "bulge" towards cursor
    scale: {
      base: 1.02,          // Base scale (slightly larger than 1)
      max: 1.15,           // Max scale when cursor at edge
      cursorBoost: 0.08    // Additional scale boost near cursor
    },
    
    // 3D rotation effect (subtle tilt towards cursor)
    rotation: {
      x: 8,                // Tilt forward/back (degrees)
      y: 12                // Tilt left/right (degrees)
    },
    
    // Skew effect (directional distortion)
    skew: {
      x: 3,                // Horizontal skew (degrees)
      y: 2                 // Vertical skew (degrees)
    },
    
    // Perspective (lower = more dramatic 3D effect)
    perspective: 800,
    
    // Mobile settings
    mobile: {
      enabled: true,
      touchSensitivity: 1.8,
      reducedMotion: false  // Set true for less movement on mobile
    }
  };

  // ============================================
  // State
  // ============================================
  let heroSection = null;
  let heroBackground = null;
  let splineContainer = null;
  let animationId = null;
  let isInitialized = false;
  let isVisible = true;
  let lastTime = 0;
  let isMobile = false;
  
  // Raw mouse position (pixels, relative to hero)
  const mouseRaw = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };
  
  // Normalized mouse position (-1 to 1)
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };
  
  // Transform origin position (percentage)
  const origin = {
    x: 50,
    y: 50,
    targetX: 50,
    targetY: 50
  };
  
  // Current transform values
  const transform = {
    x: 0,
    y: 0,
    scale: CONFIG.scale.base,
    rotateX: 0,
    rotateY: 0,
    skewX: 0,
    skewY: 0
  };

  // ============================================
  // Core Functions
  // ============================================
  
  /**
   * Initialize the wave-following effect
   */
  function init() {
    // Check for mobile
    isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    
    heroSection = document.querySelector('.hero');
    if (!heroSection) {
      console.warn('Hero Wave Follow: Hero section not found');
      return;
    }
    
    heroBackground = heroSection.querySelector('.hero-background');
    splineContainer = heroSection.querySelector('.hero-spline-container');
    
    if (!splineContainer) {
      console.warn('Hero Wave Follow: Spline container not found');
      return;
    }
    
    // Apply base styles
    applyBaseStyles();
    
    // Set up event listeners
    setupEventListeners();
    
    isInitialized = true;
    
    // Start animation loop
    startAnimation();
    
    console.log('Hero Wave Follow v2: Initialized', isMobile ? '(mobile)' : '(desktop)');
  }
  
  /**
   * Apply base CSS styles for smooth transforms
   */
  function applyBaseStyles() {
    // Hero background gets perspective
    if (heroBackground) {
      heroBackground.style.perspective = CONFIG.perspective + 'px';
      heroBackground.style.perspectiveOrigin = '50% 50%';
      heroBackground.style.overflow = 'hidden';
    }
    
    // Spline container gets transform styles
    splineContainer.style.transformOrigin = '50% 50%';
    splineContainer.style.transformStyle = 'preserve-3d';
    splineContainer.style.willChange = 'transform, transform-origin';
    splineContainer.style.backfaceVisibility = 'hidden';
    
    // Slight overflow to allow for scale without clipping
    splineContainer.style.position = 'absolute';
    splineContainer.style.inset = '-10%';
    splineContainer.style.width = '120%';
    splineContainer.style.height = '120%';
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Touch movement
    if (CONFIG.mobile.enabled) {
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Mouse leave - gradually return to center
    heroSection.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    // Visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Intersection Observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              startAnimation();
            } else {
              stopAnimation();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(heroSection);
    }
    
    // Window resize
    window.addEventListener('resize', handleResize, { passive: true });
  }
  
  /**
   * Handle mouse movement
   */
  function handleMouseMove(e) {
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    
    // Track even slightly outside hero for smoother edge behavior
    const buffer = 150;
    const isNearHero = e.clientY >= rect.top - buffer && e.clientY <= rect.bottom + buffer;
    
    if (!isNearHero) return;
    
    // Raw position relative to hero
    mouseRaw.targetX = e.clientX - rect.left;
    mouseRaw.targetY = e.clientY - rect.top;
    
    // Normalized position (-1 to 1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouse.targetX = clamp((mouseRaw.targetX - centerX) / centerX, -1, 1);
    mouse.targetY = clamp((mouseRaw.targetY - centerY) / centerY, -1, 1);
    
    // Transform origin follows mouse (0-100%)
    // This is the KEY to the bulge effect!
    origin.targetX = clamp((mouseRaw.targetX / rect.width) * 100, 10, 90);
    origin.targetY = clamp((mouseRaw.targetY / rect.height) * 100, 10, 90);
  }
  
  /**
   * Handle touch start
   */
  function handleTouchStart(e) {
    if (e.touches.length > 0) {
      handleTouchMove(e);
    }
  }
  
  /**
   * Handle touch movement
   */
  function handleTouchMove(e) {
    if (e.touches.length === 0 || !heroSection) return;
    
    const touch = e.touches[0];
    const rect = heroSection.getBoundingClientRect();
    
    // Only process if touch is within or near hero
    if (touch.clientY < rect.top - 50 || touch.clientY > rect.bottom + 50) return;
    
    const sensitivity = CONFIG.mobile.touchSensitivity;
    
    // Raw position
    mouseRaw.targetX = touch.clientX - rect.left;
    mouseRaw.targetY = touch.clientY - rect.top;
    
    // Normalized with sensitivity boost
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouse.targetX = clamp(((mouseRaw.targetX - centerX) / centerX) * sensitivity, -1, 1);
    mouse.targetY = clamp(((mouseRaw.targetY - centerY) / centerY) * sensitivity, -1, 1);
    
    // Origin follows touch
    origin.targetX = clamp((mouseRaw.targetX / rect.width) * 100, 5, 95);
    origin.targetY = clamp((mouseRaw.targetY / rect.height) * 100, 5, 95);
  }
  
  /**
   * Handle touch end
   */
  function handleTouchEnd() {
    // Gradually return to center
    mouse.targetX = 0;
    mouse.targetY = 0;
    origin.targetX = 50;
    origin.targetY = 50;
  }
  
  /**
   * Handle mouse leaving hero area
   */
  function handleMouseLeave() {
    // Gradually return to center
    mouse.targetX = 0;
    mouse.targetY = 0;
    origin.targetX = 50;
    origin.targetY = 50;
  }
  
  /**
   * Handle visibility change
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
    } else if (isVisible) {
      startAnimation();
    }
  }
  
  /**
   * Handle window resize
   */
  function handleResize() {
    isMobile = window.innerWidth < 768;
    // Reset to center
    mouse.targetX = 0;
    mouse.targetY = 0;
    origin.targetX = 50;
    origin.targetY = 50;
  }

  // ============================================
  // Animation Loop
  // ============================================
  
  /**
   * Main animation loop
   */
  function animate(currentTime) {
    if (!isInitialized || !splineContainer) {
      animationId = null;
      return;
    }
    
    // Delta time for consistent animation
    const deltaTime = lastTime ? Math.min((currentTime - lastTime) / 16.67, 3) : 1;
    lastTime = currentTime;
    
    // Lerp mouse position
    mouse.x = lerp(mouse.x, mouse.targetX, CONFIG.easing.position * deltaTime);
    mouse.y = lerp(mouse.y, mouse.targetY, CONFIG.easing.position * deltaTime);
    
    // Lerp raw mouse position
    mouseRaw.x = lerp(mouseRaw.x, mouseRaw.targetX, CONFIG.easing.position * deltaTime);
    mouseRaw.y = lerp(mouseRaw.y, mouseRaw.targetY, CONFIG.easing.position * deltaTime);
    
    // Lerp transform origin (follows faster for responsive feel)
    origin.x = lerp(origin.x, origin.targetX, CONFIG.easing.origin * deltaTime);
    origin.y = lerp(origin.y, origin.targetY, CONFIG.easing.origin * deltaTime);
    
    // Calculate transforms
    calculateTransforms(deltaTime);
    
    // Apply transforms
    applyTransforms();
    
    // Continue animation
    animationId = requestAnimationFrame(animate);
  }
  
  /**
   * Calculate all transform values
   */
  function calculateTransforms(deltaTime) {
    // Movement (translation)
    const movementMultiplier = isMobile && CONFIG.mobile.reducedMotion ? 0.6 : 1;
    transform.x = mouse.x * CONFIG.movement.x * movementMultiplier;
    transform.y = mouse.y * CONFIG.movement.y * movementMultiplier;
    
    // Scale calculation - THIS IS KEY FOR THE BULGE EFFECT
    // Base scale + distance-based scale + cursor proximity boost
    const distanceFromCenter = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
    const normalizedDistance = Math.min(distanceFromCenter / 1.414, 1); // 1.414 is max distance to corner
    
    // Scale increases more dramatically based on cursor position
    const targetScale = CONFIG.scale.base + 
                       (normalizedDistance * (CONFIG.scale.max - CONFIG.scale.base)) +
                       (CONFIG.scale.cursorBoost * normalizedDistance);
    
    transform.scale = lerp(transform.scale, targetScale, CONFIG.easing.scale * deltaTime);
    
    // Rotation - tilts towards cursor
    transform.rotateX = -mouse.y * CONFIG.rotation.x;
    transform.rotateY = mouse.x * CONFIG.rotation.y;
    
    // Skew - directional distortion
    transform.skewX = mouse.x * CONFIG.skew.x;
    transform.skewY = -mouse.y * CONFIG.skew.y;
  }
  
  /**
   * Apply all transforms to the spline container
   */
  function applyTransforms() {
    // Dynamic transform origin - THE KEY TO THE BULGE EFFECT
    splineContainer.style.transformOrigin = `${origin.x}% ${origin.y}%`;
    
    // Update perspective origin on background to match
    if (heroBackground) {
      heroBackground.style.perspectiveOrigin = `${origin.x}% ${origin.y}%`;
    }
    
    // Build transform string
    const transformString = [
      `translate3d(${transform.x.toFixed(2)}px, ${transform.y.toFixed(2)}px, 0)`,
      `scale(${transform.scale.toFixed(4)})`,
      `rotateX(${transform.rotateX.toFixed(2)}deg)`,
      `rotateY(${transform.rotateY.toFixed(2)}deg)`,
      `skew(${transform.skewX.toFixed(2)}deg, ${transform.skewY.toFixed(2)}deg)`
    ].join(' ');
    
    splineContainer.style.transform = transformString;
  }
  
  /**
   * Start the animation loop
   */
  function startAnimation() {
    if (animationId) return;
    lastTime = 0;
    animationId = requestAnimationFrame(animate);
  }
  
  /**
   * Stop the animation loop
   */
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ============================================
  // Utility Functions
  // ============================================
  
  /**
   * Linear interpolation
   */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
  
  /**
   * Clamp value between min and max
   */
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // ============================================
  // Public API
  // ============================================
  
  window.HeroWaveFollow = {
    init: init,
    start: startAnimation,
    stop: stopAnimation,
    
    // Runtime configuration
    setConfig: function(newConfig) {
      deepMerge(CONFIG, newConfig);
    },
    
    // Preset configurations
    presets: {
      subtle: function() {
        CONFIG.movement = { x: 60, y: 40 };
        CONFIG.scale = { base: 1.0, max: 1.05, cursorBoost: 0.02 };
        CONFIG.rotation = { x: 4, y: 6 };
      },
      dramatic: function() {
        CONFIG.movement = { x: 150, y: 100 };
        CONFIG.scale = { base: 1.05, max: 1.25, cursorBoost: 0.12 };
        CONFIG.rotation = { x: 12, y: 18 };
      },
      responsive: function() {
        CONFIG.easing = { position: 0.08, origin: 0.12, scale: 0.06 };
      },
      smooth: function() {
        CONFIG.easing = { position: 0.02, origin: 0.03, scale: 0.015 };
      }
    },
    
    // Get current state
    getState: function() {
      return {
        mouse: { ...mouse },
        origin: { ...origin },
        transform: { ...transform },
        isInitialized,
        isVisible,
        isMobile
      };
    }
  };
  
  /**
   * Deep merge objects
   */
  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  // ============================================
  // Auto-initialize when DOM is ready
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
