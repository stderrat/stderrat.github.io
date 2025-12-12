/**
 * Reader Mode
 * Provides a distraction-free reading experience
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'readerModeEnabled';
    const HINT_SHOWN_KEY = 'readerModeHintShown';

    // State
    let isReaderMode = false;
    let hintTimeout = null;

    /**
     * Initialize reader mode
     */
    function init() {
        // Only initialize on article pages (pages with #body-inner content)
        if (!document.querySelector('#body-inner') || document.querySelector('#chapter')) {
            return;
        }

        // Check if reader mode is disabled for this page (no toggle button present)
        // This happens when disableReaderMode: true is set in the article's front matter
        if (!document.querySelector('.reader-mode-toggle')) {
            return;
        }

        createFloatingElements();
        setupEventListeners();
        
        // Restore state from localStorage
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
            enableReaderMode(false); // false = no animation on page load
        }
    }

    /**
     * Create floating navigation and exit button
     */
    function createFloatingElements() {
        // Exit button
        const exitBtn = document.createElement('button');
        exitBtn.className = 'reader-mode-exit';
        exitBtn.innerHTML = '<i class="fas fa-times"></i> Exit Reader Mode';
        exitBtn.setAttribute('aria-label', 'Exit reader mode');
        exitBtn.addEventListener('click', function() {
            disableReaderMode(true);
        });
        document.body.appendChild(exitBtn);

        // Floating prev navigation
        const prevLink = document.querySelector('.nav.nav-prev');
        if (prevLink) {
            const prevNav = document.createElement('a');
            prevNav.className = 'reader-nav reader-nav-prev';
            prevNav.href = prevLink.href;
            prevNav.title = prevLink.title || 'Previous article';
            prevNav.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevNav.setAttribute('aria-label', 'Previous article');
            document.body.appendChild(prevNav);
        }

        // Floating next navigation
        const nextLink = document.querySelector('.nav.nav-next');
        if (nextLink) {
            const nextNav = document.createElement('a');
            nextNav.className = 'reader-nav reader-nav-next';
            nextNav.href = nextLink.href;
            nextNav.title = nextLink.title || 'Next article';
            nextNav.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextNav.setAttribute('aria-label', 'Next article');
            document.body.appendChild(nextNav);
        }

        // Keyboard hint
        const hint = document.createElement('div');
        hint.className = 'reader-mode-hint';
        hint.innerHTML = 'Press <kbd>Esc</kbd> or <kbd>R</kbd> to exit reader mode';
        document.body.appendChild(hint);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Toggle button click
        const toggleBtn = document.querySelector('.reader-mode-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleReaderMode();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            // 'R' key to toggle reader mode
            if (e.key === 'r' || e.key === 'R') {
                if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                    toggleReaderMode();
                }
            }

            // Escape to exit reader mode
            if (e.key === 'Escape' && isReaderMode) {
                disableReaderMode(true);
            }
        });

        // Left/Right arrow keys for navigation in reader mode
        document.addEventListener('keydown', function(e) {
            if (!isReaderMode) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowLeft') {
                const prevNav = document.querySelector('.reader-nav-prev');
                if (prevNav) {
                    window.location.href = prevNav.href;
                }
            }
            if (e.key === 'ArrowRight') {
                const nextNav = document.querySelector('.reader-nav-next');
                if (nextNav) {
                    window.location.href = nextNav.href;
                }
            }
        });
    }

    /**
     * Toggle reader mode
     */
    function toggleReaderMode() {
        if (isReaderMode) {
            disableReaderMode(true);
        } else {
            enableReaderMode(true);
        }
    }

    /**
     * Enable reader mode
     * @param {boolean} animate - Whether to animate the transition
     */
    function enableReaderMode(animate) {
        if (isReaderMode) return;
        
        isReaderMode = true;
        
        if (animate) {
            document.body.classList.add('reader-mode-transitioning');
        }
        
        document.body.classList.add('reader-mode');
        localStorage.setItem(STORAGE_KEY, 'true');

        // Update toggle button state
        const toggleBtn = document.querySelector('.reader-mode-toggle');
        if (toggleBtn) {
            toggleBtn.querySelector('.toggle-text').textContent = 'Exit Reader';
            toggleBtn.querySelector('i').className = 'fas fa-times';
            toggleBtn.setAttribute('aria-pressed', 'true');
        }

        // Show keyboard hint on first use
        if (animate && !localStorage.getItem(HINT_SHOWN_KEY)) {
            showHint();
            localStorage.setItem(HINT_SHOWN_KEY, 'true');
        }

        // Remove transitioning class after animation
        if (animate) {
            setTimeout(function() {
                document.body.classList.remove('reader-mode-transitioning');
            }, 400);
        }

        // Scroll to top of article smoothly
        if (animate) {
            const mainContent = document.querySelector('#main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Announce to screen readers
        announceToScreenReader('Reader mode enabled. Press Escape to exit.');
    }

    /**
     * Disable reader mode
     * @param {boolean} animate - Whether to animate the transition
     */
    function disableReaderMode(animate) {
        if (!isReaderMode) return;
        
        isReaderMode = false;
        
        if (animate) {
            document.body.classList.add('reader-mode-transitioning');
        }
        
        document.body.classList.remove('reader-mode');
        localStorage.setItem(STORAGE_KEY, 'false');

        // Update toggle button state
        const toggleBtn = document.querySelector('.reader-mode-toggle');
        if (toggleBtn) {
            toggleBtn.querySelector('.toggle-text').textContent = 'Reader Mode';
            toggleBtn.querySelector('i').className = 'fas fa-book-reader';
            toggleBtn.setAttribute('aria-pressed', 'false');
        }

        // Hide hint if visible
        hideHint();

        // Remove transitioning class after animation
        if (animate) {
            setTimeout(function() {
                document.body.classList.remove('reader-mode-transitioning');
            }, 400);
        }

        // Announce to screen readers
        announceToScreenReader('Reader mode disabled.');
    }

    /**
     * Show keyboard hint
     */
    function showHint() {
        const hint = document.querySelector('.reader-mode-hint');
        if (hint) {
            hint.classList.add('visible');
            
            // Auto-hide after 4 seconds
            hintTimeout = setTimeout(function() {
                hideHint();
            }, 4000);
        }
    }

    /**
     * Hide keyboard hint
     */
    function hideHint() {
        const hint = document.querySelector('.reader-mode-hint');
        if (hint) {
            hint.classList.remove('visible');
        }
        if (hintTimeout) {
            clearTimeout(hintTimeout);
            hintTimeout = null;
        }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(function() {
            announcement.remove();
        }, 1000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external use
    window.ReaderMode = {
        enable: function() { enableReaderMode(true); },
        disable: function() { disableReaderMode(true); },
        toggle: toggleReaderMode,
        isEnabled: function() { return isReaderMode; }
    };

})();

