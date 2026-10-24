/* animated-svg — starts the animation of [data-animated-svg] diagrams once
   they scroll into view. Loaded only on pages that use the animated-svg
   shortcode. No dependencies (the lightbox uses Featherlight if present).
   - Flow dots (circle.flow-dot + animateMotion[data-begin]) are driven by JS
     only, no CSS needed: shown and started at their data-begin offset, loop.
   - Optional build-up stages (.rv elements) use the theme CSS classes
     is-armed / is-playing. Diagrams without .rv stay fully visible.
   - Click (or Enter/Space) on a diagram opens an enlarged copy in the
     Featherlight lightbox, like the PNG images. Dots run there as well. */
(function () {
  'use strict';
  var figures = document.querySelectorAll('[data-animated-svg]');
  if (!figures.length) return;
  var reducedMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  function startDots(root) {
    root.querySelectorAll('animateMotion[data-begin]').forEach(function (m) {
      var at = parseFloat(m.getAttribute('data-begin')) || 0;
      var dot = m.parentNode;
      try { m.beginElementAt(at); } catch (e) { return; /* SMIL unsupported: keep dot hidden */ }
      setTimeout(function () { dot.setAttribute('visibility', 'visible'); }, at * 1000);
    });
  }

  function play(fig) {
    if (fig.classList.contains('is-armed')) fig.classList.add('is-playing');
    startDots(fig);
  }

  /* ---- lightbox ------------------------------------------------------- */
  function openLightbox(fig) {
    var svg = fig.querySelector('.content > svg');
    if (!svg || !window.jQuery || !jQuery.featherlight) return;
    var copy = svg.cloneNode(true);
    copy.removeAttribute('width');
    copy.removeAttribute('height');
    copy.querySelectorAll('.flow-dot').forEach(function (d) { d.setAttribute('visibility', 'hidden'); });
    var wrap = document.createElement('div');
    wrap.className = 'asvg-lightbox-content';
    wrap.appendChild(copy);
    jQuery.featherlight(jQuery(wrap), {
      variant: 'asvg-lightbox',
      afterContent: function () {
        if (!reducedMotion) startDots(this.$content[0]);
      }
    });
  }

  figures.forEach(function (fig) {
    var content = fig.querySelector('.content');
    if (!content) return;
    content.setAttribute('role', 'button');
    content.setAttribute('tabindex', '0');
    content.setAttribute('title', 'Click to enlarge');
    content.addEventListener('click', function () { openLightbox(fig); });
    content.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(fig); }
    });
  });

  /* ---- scroll-in animation -------------------------------------------- */
  if (reducedMotion) return;

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        play(entry.target);
      }
    });
  }, { threshold: 0.4 }) : null;

  figures.forEach(function (fig) {
    if (fig.querySelector('.rv')) fig.classList.add('is-armed');
    if (observer) observer.observe(fig); else play(fig);
  });
})();
