// Extracted from layouts/partials/keyboard-hints.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    const STORAGE_KEY = 'keyboard-hints-dismissed';
    const hintsEl = document.getElementById('keyboard-hints');
    const dismissBtn = document.getElementById('hint-dismiss');
    const flashLeft = document.getElementById('flash-left');
    const flashRight = document.getElementById('flash-right');
    
    // Check if hints were dismissed
    function isHintsDismissed() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    
    // Show hints on first visit (after a short delay)
    function initHints() {
        if (!hintsEl) return;
        
        if (isHintsDismissed()) {
            hintsEl.style.display = 'none';
        } else {
            // Show once after 2 seconds, then remember permanently
            setTimeout(function() {
                hintsEl.classList.add('show');
                
                setTimeout(function() {
                    localStorage.setItem(STORAGE_KEY, 'true');
                    hintsEl.classList.remove('show');
                    hintsEl.classList.add('fade-out');
                    setTimeout(function() {
                        hintsEl.style.display = 'none';
                    }, 300);
                }, 8000);
            }, 2000);
        }
    }
    
    // Dismiss handler
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            localStorage.setItem(STORAGE_KEY, 'true');
            hintsEl.classList.remove('show');
            hintsEl.classList.add('fade-out');
            setTimeout(function() {
                hintsEl.style.display = 'none';
            }, 300);
        });
    }
    
    // Show flash when arrow keys are pressed
    document.addEventListener('keydown', function(e) {
        // Skip if in input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.which === 37 && flashLeft) {
            // Left arrow
            flashLeft.classList.add('show');
            setTimeout(function() {
                flashLeft.classList.remove('show');
            }, 300);
        } else if (e.which === 39 && flashRight) {
            // Right arrow
            flashRight.classList.add('show');
            setTimeout(function() {
                flashRight.classList.remove('show');
            }, 300);
        }
        
        // Also dismiss hints permanently after first key press
        if ((e.which === 37 || e.which === 39) && hintsEl && !isHintsDismissed()) {
            localStorage.setItem(STORAGE_KEY, 'true');
            hintsEl.classList.remove('show');
        }
    });
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHints);
    } else {
        initHints();
    }
})();
