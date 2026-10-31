// Extracted from layouts/partials/custom-footer.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    var revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length === 0) return;
    
    // Check if user prefers reduced motion - just mark as revealed
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealElements.forEach(function(el) { el.classList.add('revealed'); });
        return;
    }
    
    // Enable JS-based animation
    document.body.classList.add('js-ready');
    
    // Immediately reveal items that are visible on page load (above the fold)
    var viewportHeight = window.innerHeight;
    revealElements.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight) {
            // Small delay for staggered effect
            setTimeout(function() {
                el.classList.add('revealed');
            }, 50);
        }
    });
    
    // Use Intersection Observer for items below the fold
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.1
    };
    
    var revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(function(el) {
        if (!el.classList.contains('revealed')) {
            revealObserver.observe(el);
        }
    });
})();
