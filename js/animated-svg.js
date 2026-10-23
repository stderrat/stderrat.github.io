/* animated-svg — starts the animation of [data-animated-svg] diagrams once
   they scroll into view. Loaded only on pages that use the animated-svg
   shortcode. No dependencies.
   - Flow dots (circle.flow-dot + animateMotion[data-begin]) are driven by JS
     only, no CSS needed: shown and started at their data-begin offset, loop.
   - Optional build-up stages (.rv elements) use the theme CSS classes
     is-armed / is-playing. Diagrams without .rv stay fully visible. */
(function () {
  'use strict';
  var figures = document.querySelectorAll('[data-animated-svg]');
  if (!figures.length) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function startDots(fig) {
    fig.querySelectorAll('animateMotion[data-begin]').forEach(function (m) {
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
