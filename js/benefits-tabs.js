/* ============================================
   Product Tabs — desktop: auto-rotate + click
   Mobile: static stacked cards (no carousel)
   Used by Benefits + Features sections
   ============================================ */

(function () {
  'use strict';

  var AUTO_INTERVAL_MS = 10000;
  var DESKTOP_MQ = '(min-width: 1024px)';

  function getImagePaths(items, configPaths) {
    if (configPaths && configPaths.length) return configPaths;
    return Array.prototype.map.call(items, function (item) {
      return item.getAttribute('data-image') || '';
    });
  }

  function initBenefitsTabs(config) {
    var sectionSelector = config.sectionSelector;
    var imageId = config.imageId;
    if (!sectionSelector || !imageId) return;

    var section = document.querySelector(sectionSelector);
    if (!section) return;

    var tabsList = section.querySelector('.products-tabs');
    var items = section.querySelectorAll('.products-item');
    var imageEl = document.getElementById(imageId);
    if (!items.length || !imageEl || !tabsList) return;

    var ariaLabel = config.ariaLabel || 'Benefits';
    var initDataset = config.initDataset || 'benefitsTabsInit';
    var images = getImagePaths(items, config.imagePaths);
    var currentIndex = 0;
    var timerId = null;
    var isVisible = true;
    var desktopMq = window.matchMedia(DESKTOP_MQ);
    var abortController = null;
    var intersectionObserver = null;

    function isDesktop() {
      return desktopMq.matches;
    }

    function clearTimer() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function disconnectDesktop() {
      clearTimer();
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }
    }

    function startTimer() {
      clearTimer();
      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isDesktop() || prefersReducedMotion || !isVisible || items.length < 2) return;
      timerId = setInterval(function () {
        activateDesktop((currentIndex + 1) % items.length, false);
      }, AUTO_INTERVAL_MS);
    }

    function resetTimer() {
      clearTimer();
      startTimer();
    }

    function swapImage(index) {
      var src = images[index];
      if (!src || imageEl.getAttribute('src') === src) return;

      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var titleEl = items[index].querySelector('.products-title');
      var alt = items[index].getAttribute('data-alt') || (titleEl ? titleEl.textContent : '');

      if (prefersReducedMotion) {
        imageEl.src = src;
        imageEl.alt = alt;
        return;
      }

      imageEl.classList.add('is-fading');
      window.setTimeout(function () {
        imageEl.src = src;
        imageEl.alt = alt;
        imageEl.classList.remove('is-fading');
      }, 220);
    }

    function activateDesktop(index, userInitiated) {
      if (!isDesktop()) return;
      if (index < 0 || index >= items.length) return;
      if (index === currentIndex && userInitiated) return;

      currentIndex = index;

      Array.prototype.forEach.call(items, function (item, i) {
        var isActive = i === index;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        item.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      swapImage(index);

      if (userInitiated) resetTimer();
    }

    function enableMobile() {
      disconnectDesktop();
      section.classList.add('benefits-tabs--mobile');
      section.classList.remove('benefits-tabs--desktop');
      tabsList.setAttribute('role', 'list');
      tabsList.removeAttribute('aria-label');

      Array.prototype.forEach.call(items, function (item) {
        item.classList.remove('active');
        item.classList.add('products-item--static');
        item.setAttribute('role', 'listitem');
        item.removeAttribute('aria-selected');
        item.removeAttribute('tabindex');
        item.removeAttribute('disabled');
      });
    }

    function enableDesktop() {
      section.classList.add('benefits-tabs--desktop');
      section.classList.remove('benefits-tabs--mobile');
      tabsList.setAttribute('role', 'tablist');
      tabsList.setAttribute('aria-label', ariaLabel);

      Array.prototype.forEach.call(items, function (item, index) {
        item.classList.remove('products-item--static');
        item.removeAttribute('disabled');
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
        item.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
      });

      abortController = new AbortController();
      var signal = abortController.signal;

      Array.prototype.forEach.call(items, function (item, index) {
        item.addEventListener(
          'click',
          function () {
            activateDesktop(index, true);
          },
          { signal: signal }
        );

        item.addEventListener(
          'keydown',
          function (e) {
            var next = index;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              e.preventDefault();
              next = (index + 1) % items.length;
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              e.preventDefault();
              next = (index - 1 + items.length) % items.length;
            } else if (e.key === 'Home') {
              e.preventDefault();
              next = 0;
            } else if (e.key === 'End') {
              e.preventDefault();
              next = items.length - 1;
            } else {
              return;
            }
            activateDesktop(next, true);
            items[next].focus();
          },
          { signal: signal }
        );
      });

      if ('IntersectionObserver' in window) {
        intersectionObserver = new IntersectionObserver(
          function (entries) {
            isVisible = entries[0].isIntersecting;
            if (isVisible) startTimer();
            else clearTimer();
          },
          { threshold: 0.2 }
        );
        intersectionObserver.observe(section);
      }

      activateDesktop(currentIndex, false);
      startTimer();
    }

    function applyMode() {
      if (isDesktop()) {
        enableDesktop();
      } else {
        enableMobile();
      }
    }

    section.setAttribute('role', 'region');
    if (!section.getAttribute('aria-label')) {
      section.setAttribute('aria-label', ariaLabel);
    }

    if (section.dataset[initDataset] !== 'true') {
      section.dataset[initDataset] = 'true';
      desktopMq.addEventListener('change', applyMode);
    }

    applyMode();
  }

  window.initBenefitsTabs = initBenefitsTabs;

  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.ser-products-section') && document.getElementById('products-image')) {
      initBenefitsTabs({
        sectionSelector: '.ser-products-section',
        imageId: 'products-image',
        ariaLabel: 'Benefits',
        initDataset: 'benefitsTabsInit',
      });
    }

    var featuresImageEl =
      document.getElementById('features-image') || document.getElementById('industry-features-image');
    if (document.querySelector('.ser-features-section') && featuresImageEl) {
      initBenefitsTabs({
        sectionSelector: '.ser-features-section',
        imageId: featuresImageEl.id,
        ariaLabel: 'Features',
        initDataset: 'featuresTabsInit',
      });
    }
  });
})();
