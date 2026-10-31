// Extracted from layouts/partials/footer.html so the page works with a CSP without 'unsafe-inline'.
(function(){
    document.addEventListener('DOMContentLoaded', function() {
        var progressBar = document.querySelector('.read-progress');
        if (!progressBar) return;
        
        // Add the animation class
        progressBar.classList.add('position-fixed');
        
        function updateProgress() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight > 0) {
                var progress = Math.min((scrollTop / docHeight) * 100, 100);
                progressBar.style.width = progress + '%';
            }
        }
        
        // Throttle scroll events for better performance
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Initial call and resize handler
        updateProgress();
        window.addEventListener('resize', updateProgress, { passive: true });
    });
})();
