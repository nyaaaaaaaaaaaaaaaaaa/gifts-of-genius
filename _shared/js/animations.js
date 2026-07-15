/* ================================================================
   Animation System — scroll-triggered entry animations
   Usage:
     1. Add class="animate-on-scroll fade-in-up" to any element
     2. It will fade+slide up when scrolled into view
     3. For stagger: wrap children in container with
        class="animate-stagger" and each child as "animate-stagger-item"
   ================================================================ */

(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  // --- Configuration ---
  var ROOT_MARGIN = '0px 0px -60px 0px';
  var THRESHOLD = 0.12;

  // --- Observer ---
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        // Once visible, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: ROOT_MARGIN,
    threshold: THRESHOLD
  });

  // --- Observe all scroll-triggered elements ---
  function observeAll() {
    var els = document.querySelectorAll('.animate-on-scroll, .animate-stagger');
    Array.prototype.forEach.call(els, function (el) {
      // If already visible (e.g. above fold), show immediately
      var rect = el.getBoundingClientRect();
      var winH = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < winH - 60) {
        el.classList.add('animate-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  // --- Run on load, then also on dynamic content changes ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAll);
  } else {
    observeAll();
  }

  // Re-run on resize (in case layout changes above/below fold)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observeAll, 200);
  });

  // Expose a public method so pages can re-trigger after dynamic content
  window.refreshAnimations = observeAll;

})();