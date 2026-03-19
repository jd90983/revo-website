/**
 * Hero Neural Network Effect
 * Creates an AI-inspired particle network overlay with:
 * - Floating nodes that pulse and drift
 * - Dynamic connections that flow between nearby nodes
 * - Mouse attraction - nodes gravitate towards cursor
 * - "Thinking" pulses that travel along connections
 * - Depth layers for parallax feel
 * 
 * @author Revo AI
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Set to true to re-enable the hero neural network effect (mouse-reactive nodes).
  const HERO_NEURAL_EFFECT_ENABLED = false;

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    // Node settings
    nodes: {
      count: {
        desktop: 45,
        mobile: 25
      },
      size: {
        min: 2,
        max: 5
      },
      speed: 0.3,
      // Layers for depth (0 = back, 1 = front)
      layers: 3
    },
    
    // Connection settings
    connections: {
      maxDistance: 150,
      lineWidth: {
        min: 0.3,
        max: 1.2
      },
      opacity: {
        min: 0.05,
        max: 0.25
      }
    },
    
    // Pulse/thinking effect
    pulse: {
      enabled: true,
      speed: 0.02,
      frequency: 0.005, // How often new pulses start
      color: { r: 6, g: 182, b: 212 }, // Cyan
      size: 4,
      trailLength: 8
    },
    
    // Mouse interaction
    mouse: {
      attractionRadius: 200,
      attractionStrength: 0.08,
      repelOnClick: true,
      easing: 0.05
    },
    
    // Colors (AI-themed: blues, cyans, subtle purples)
    colors: {
      nodes: [
        { r: 59, g: 130, b: 246, a: 0.7 },   // Blue
        { r: 6, g: 182, b: 212, a: 0.8 },    // Cyan (brighter)
        { r: 99, g: 102, b: 241, a: 0.6 },   // Indigo
        { r: 139, g: 92, b: 246, a: 0.5 },   // Purple
        { r: 255, g: 255, b: 255, a: 0.4 }   // White accent
      ],
      connections: { r: 6, g: 182, b: 212 }, // Cyan
      glow: { r: 59, g: 130, b: 246 }        // Blue glow
    },
    
    // Animation
    animation: {
      breathingSpeed: 0.002,  // Node size breathing
      driftSpeed: 0.0005      // Slow drift
    }
  };

  // ============================================
  // State
  // ============================================
  let canvas = null;
  let ctx = null;
  let nodes = [];
  let pulses = [];
  let animationId = null;
  let isInitialized = false;
  let isVisible = true;
  let isMobile = false;
  let time = 0;
  
  // Mouse state
  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    isOver: false
  };
  
  // Canvas dimensions
  let width = 0;
  let height = 0;
  let dpr = 1;

  // ============================================
  // Node Class
  // ============================================
  class Node {
    constructor(layer) {
      this.layer = layer; // 0-2 for depth
      this.layerScale = 0.5 + (layer / CONFIG.nodes.layers) * 0.5;
      this.reset();
    }
    
    reset() {
      // Position
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      
      // Velocity (slower for back layers)
      const speed = CONFIG.nodes.speed * this.layerScale;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      
      // Size varies by layer (smaller = further back)
      const sizeRange = CONFIG.nodes.size.max - CONFIG.nodes.size.min;
      this.baseSize = (CONFIG.nodes.size.min + Math.random() * sizeRange) * this.layerScale;
      this.size = this.baseSize;
      
      // Color
      this.color = CONFIG.colors.nodes[Math.floor(Math.random() * CONFIG.colors.nodes.length)];
      
      // Breathing offset (for pulsing)
      this.breatheOffset = Math.random() * Math.PI * 2;
      this.breatheSpeed = CONFIG.animation.breathingSpeed * (0.8 + Math.random() * 0.4);
      
      // Drift offset
      this.driftOffset = Math.random() * Math.PI * 2;
      
      // Opacity varies by layer
      this.baseOpacity = this.color.a * this.layerScale;
      this.opacity = this.baseOpacity;
      
      // Connection state
      this.connections = [];
      this.isActive = false; // Highlighted when near mouse
    }
    
    update(deltaTime) {
      // Breathing effect
      this.breatheOffset += this.breatheSpeed * deltaTime;
      const breathe = Math.sin(this.breatheOffset) * 0.3 + 1;
      this.size = this.baseSize * breathe;
      
      // Drift
      this.driftOffset += CONFIG.animation.driftSpeed * deltaTime;
      const driftX = Math.sin(this.driftOffset) * 0.2;
      const driftY = Math.cos(this.driftOffset * 0.7) * 0.2;
      
      // Mouse attraction (stronger for front layers)
      if (mouse.x !== null && mouse.isOver) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CONFIG.mouse.attractionRadius * this.layerScale) {
          const force = (1 - dist / CONFIG.mouse.attractionRadius) * 
                       CONFIG.mouse.attractionStrength * this.layerScale;
          this.vx += (dx / dist) * force * deltaTime;
          this.vy += (dy / dist) * force * deltaTime;
          
          // Highlight nodes near mouse
          this.isActive = dist < CONFIG.mouse.attractionRadius * 0.5;
          this.opacity = this.baseOpacity + (1 - dist / CONFIG.mouse.attractionRadius) * 0.3;
        } else {
          this.isActive = false;
          this.opacity = this.baseOpacity;
        }
      } else {
        this.isActive = false;
        this.opacity = this.baseOpacity;
      }
      
      // Apply velocity
      this.x += (this.vx + driftX) * deltaTime;
      this.y += (this.vy + driftY) * deltaTime;
      
      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
      
      // Wrap around edges
      const padding = 50;
      if (this.x < -padding) this.x = width + padding;
      if (this.x > width + padding) this.x = -padding;
      if (this.y < -padding) this.y = height + padding;
      if (this.y > height + padding) this.y = -padding;
    }
    
    draw() {
      // Main node
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
      ctx.fill();
      
      // Glow for active/larger nodes
      if (this.isActive || this.size > 3.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        const glowOpacity = this.isActive ? 0.15 : 0.05;
        ctx.fillStyle = `rgba(${CONFIG.colors.glow.r}, ${CONFIG.colors.glow.g}, ${CONFIG.colors.glow.b}, ${glowOpacity})`;
        ctx.fill();
      }
    }
  }

  // ============================================
  // Pulse Class (thinking effect)
  // ============================================
  class Pulse {
    constructor(startNode, endNode) {
      this.startNode = startNode;
      this.endNode = endNode;
      this.progress = 0;
      this.speed = CONFIG.pulse.speed * (0.8 + Math.random() * 0.4);
      this.alive = true;
      this.trail = [];
    }
    
    update(deltaTime) {
      this.progress += this.speed * deltaTime;
      
      if (this.progress >= 1) {
        this.alive = false;
        return;
      }
      
      // Current position along connection
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
      
      // Add to trail
      this.trail.push({ x, y, alpha: 1 });
      
      // Limit trail length
      if (this.trail.length > CONFIG.pulse.trailLength) {
        this.trail.shift();
      }
      
      // Fade trail
      this.trail.forEach((point, i) => {
        point.alpha = (i + 1) / this.trail.length;
      });
    }
    
    draw() {
      const color = CONFIG.pulse.color;
      
      // Draw trail
      this.trail.forEach((point, i) => {
        const size = CONFIG.pulse.size * point.alpha;
        const alpha = point.alpha * 0.8;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fill();
        
        // Glow
        if (point.alpha > 0.5) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.2})`;
          ctx.fill();
        }
      });
    }
  }

  // ============================================
  // Core Functions
  // ============================================
  
  function init() {
    if (!HERO_NEURAL_EFFECT_ENABLED) return;

    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
      console.warn('Neural Network: Hero section not found');
      return;
    }
    
    isMobile = window.innerWidth < 768;
    
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.className = 'hero-neural-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    
    // Insert into hero background
    const heroBackground = heroSection.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.appendChild(canvas);
    } else {
      heroSection.insertBefore(canvas, heroSection.firstChild);
    }
    
    ctx = canvas.getContext('2d');
    
    // Set up
    resizeCanvas();
    createNodes();
    setupEventListeners();
    
    isInitialized = true;
    startAnimation();
    
    console.log('Neural Network: Initialized with', nodes.length, 'nodes');
  }
  
  function resizeCanvas() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection || !canvas) return;
    
    const rect = heroSection.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    width = rect.width;
    height = rect.height;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(dpr, dpr);
    
    // Recreate nodes if count changed
    const targetCount = isMobile ? CONFIG.nodes.count.mobile : CONFIG.nodes.count.desktop;
    if (nodes.length !== targetCount) {
      createNodes();
    }
  }
  
  function createNodes() {
    const count = isMobile ? CONFIG.nodes.count.mobile : CONFIG.nodes.count.desktop;
    nodes = [];
    
    for (let i = 0; i < count; i++) {
      const layer = Math.floor(Math.random() * CONFIG.nodes.layers);
      nodes.push(new Node(layer));
    }
    
    // Sort by layer (back to front)
    nodes.sort((a, b) => a.layer - b.layer);
  }
  
  function setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Touch
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse leave
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      heroSection.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    }
    
    // Visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isMobile = window.innerWidth < 768;
        resizeCanvas();
      }, 150);
    }, { passive: true });
    
    // Intersection Observer
    if ('IntersectionObserver' in window && heroSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) startAnimation();
            else stopAnimation();
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(heroSection);
    }
  }
  
  function handleMouseMove(e) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isOver = true;
    }
  }
  
  function handleTouchStart(e) {
    if (e.touches.length > 0) {
      handleTouchMove(e);
    }
  }
  
  function handleTouchMove(e) {
    if (e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    
    if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      mouse.targetX = touch.clientX - rect.left;
      mouse.targetY = touch.clientY - rect.top;
      mouse.isOver = true;
    }
  }
  
  function handleTouchEnd() {
    mouse.isOver = false;
  }
  
  function handleMouseLeave() {
    mouse.isOver = false;
  }
  
  function handleMouseEnter() {
    mouse.isOver = true;
  }
  
  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
    } else if (isVisible) {
      startAnimation();
    }
  }

  // ============================================
  // Animation Loop
  // ============================================
  
  let lastTime = 0;
  
  function animate(currentTime) {
    if (!isInitialized || !canvas || !ctx) {
      animationId = null;
      return;
    }
    
    const deltaTime = lastTime ? Math.min((currentTime - lastTime) / 16.67, 3) : 1;
    lastTime = currentTime;
    time += deltaTime;
    
    // Lerp mouse position
    if (mouse.targetX !== null) {
      mouse.x = mouse.x === null ? mouse.targetX : 
                mouse.x + (mouse.targetX - mouse.x) * CONFIG.mouse.easing * deltaTime;
      mouse.y = mouse.y === null ? mouse.targetY :
                mouse.y + (mouse.targetY - mouse.y) * CONFIG.mouse.easing * deltaTime;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Update nodes
    nodes.forEach(node => node.update(deltaTime));
    
    // Draw connections
    drawConnections();
    
    // Update and draw pulses
    updatePulses(deltaTime);
    
    // Draw nodes (on top of connections)
    nodes.forEach(node => node.draw());
    
    // Spawn new pulses
    spawnPulses();
    
    animationId = requestAnimationFrame(animate);
  }
  
  function drawConnections() {
    const maxDist = CONFIG.connections.maxDistance;
    const connColor = CONFIG.colors.connections;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        // Only connect nodes on same or adjacent layers
        if (Math.abs(nodeA.layer - nodeB.layer) > 1) continue;
        
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Adjust max distance by layer (closer layers have longer connections)
        const layerAvg = (nodeA.layer + nodeB.layer) / 2;
        const adjustedMaxDist = maxDist * (0.6 + layerAvg / CONFIG.nodes.layers * 0.4);
        
        if (dist < adjustedMaxDist) {
          const opacity = CONFIG.connections.opacity.min + 
                         (1 - dist / adjustedMaxDist) * 
                         (CONFIG.connections.opacity.max - CONFIG.connections.opacity.min);
          
          // Boost opacity if either node is active
          const activeBoost = (nodeA.isActive || nodeB.isActive) ? 1.5 : 1;
          
          const lineWidth = CONFIG.connections.lineWidth.min +
                           (1 - dist / adjustedMaxDist) *
                           (CONFIG.connections.lineWidth.max - CONFIG.connections.lineWidth.min);
          
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(${connColor.r}, ${connColor.g}, ${connColor.b}, ${opacity * activeBoost})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }
    }
  }
  
  function spawnPulses() {
    if (!CONFIG.pulse.enabled) return;
    
    // Random chance to spawn pulse
    if (Math.random() > CONFIG.pulse.frequency) return;
    
    // Find two connected nodes
    const maxDist = CONFIG.connections.maxDistance;
    const candidates = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDist * 0.8) {
          candidates.push([nodes[i], nodes[j]]);
        }
      }
    }
    
    if (candidates.length > 0) {
      const [startNode, endNode] = candidates[Math.floor(Math.random() * candidates.length)];
      // Random direction
      if (Math.random() > 0.5) {
        pulses.push(new Pulse(startNode, endNode));
      } else {
        pulses.push(new Pulse(endNode, startNode));
      }
    }
  }
  
  function updatePulses(deltaTime) {
    // Update and draw pulses
    pulses = pulses.filter(pulse => {
      pulse.update(deltaTime);
      if (pulse.alive) {
        pulse.draw();
        return true;
      }
      return false;
    });
    
    // Limit pulse count
    if (pulses.length > 15) {
      pulses = pulses.slice(-15);
    }
  }
  
  function startAnimation() {
    if (animationId) return;
    lastTime = 0;
    animationId = requestAnimationFrame(animate);
  }
  
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ============================================
  // Public API
  // ============================================
  
  window.HeroNeuralNetwork = {
    init,
    start: startAnimation,
    stop: stopAnimation,
    
    setConfig(newConfig) {
      Object.assign(CONFIG, newConfig);
    },
    
    // Trigger a burst of activity (e.g., on click)
    burst() {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnPulses(), i * 100);
      }
    },
    
    getState() {
      return {
        nodes: nodes.length,
        pulses: pulses.length,
        isInitialized,
        isVisible,
        isMobile
      };
    }
  };

  // ============================================
  // Auto-initialize
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();


