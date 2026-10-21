/**
 * Reader Mode
 * Provides a distraction-free reading experience
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'readerModeEnabled';
    const HINT_SHOWN_KEY = 'readerModeHintShown';
    const FONT_SIZE_KEY = 'readerFontSize';

    // Font size settings
    const FONT_SIZES = [80, 90, 100, 110, 120, 130, 140, 150];
    const DEFAULT_FONT_SIZE = 100;

    // State
    let isReaderMode = false;
    let hintTimeout = null;
    let currentFontSize = DEFAULT_FONT_SIZE;

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

        // Floating search button
        const searchBtn = document.createElement('button');
        searchBtn.className = 'reader-search-btn';
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.title = 'Search (Cmd/Ctrl+K)';
        searchBtn.setAttribute('aria-label', 'Open search');
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Use the SearchModal API if available
            if (window.SearchModal && typeof window.SearchModal.open === 'function') {
                window.SearchModal.open();
            }
        });
        document.body.appendChild(searchBtn);

        // Font size controls
        const fontControls = document.createElement('div');
        fontControls.className = 'reader-font-controls';
        fontControls.innerHTML = `
            <button class="reader-font-btn" data-action="decrease" title="Decrease font size" aria-label="Decrease font size">
                <i class="fas fa-minus"></i>
            </button>
            <span class="reader-font-size">100%</span>
            <button class="reader-font-btn" data-action="increase" title="Increase font size" aria-label="Increase font size">
                <i class="fas fa-plus"></i>
            </button>
            <button class="reader-font-btn reader-font-reset" data-action="reset" title="Reset font size" aria-label="Reset font size">
                <i class="fas fa-undo"></i>
            </button>
        `;
        document.body.appendChild(fontControls);
        
        // Setup font size controls
        setupFontSizeControls(fontControls);

        // Reading progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'reader-progress-indicator';
        progressIndicator.innerHTML = `
            <div class="reader-progress-ring">
                <svg viewBox="0 0 36 36">
                    <path class="reader-progress-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="reader-progress-bar"
                        stroke-dasharray="0, 100"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <span class="reader-progress-percent">0%</span>
            </div>
            <div class="reader-progress-info">
                <span class="reader-progress-time"></span>
                <span class="reader-progress-label">remaining</span>
            </div>
        `;
        document.body.appendChild(progressIndicator);

        // Calculate reading time
        calculateReadingTime();

        // Keyboard hint
        const hint = document.createElement('div');
        hint.className = 'reader-mode-hint';
        hint.innerHTML = 'Press <kbd>Esc</kbd> or <kbd>R</kbd> to exit reader mode';
        document.body.appendChild(hint);
    }

    /**
     * Setup font size controls
     */
    function setupFontSizeControls(container) {
        const sizeDisplay = container.querySelector('.reader-font-size');
        const buttons = container.querySelectorAll('.reader-font-btn');
        
        // Load saved font size
        const savedSize = localStorage.getItem(FONT_SIZE_KEY);
        if (savedSize) {
            currentFontSize = parseInt(savedSize, 10);
            if (!FONT_SIZES.includes(currentFontSize)) {
                currentFontSize = DEFAULT_FONT_SIZE;
            }
        }
        
        // Apply initial font size
        applyFontSize();
        updateFontSizeDisplay(sizeDisplay);
        
        // Button click handlers
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.getAttribute('data-action');
                
                if (action === 'increase') {
                    const nextIndex = FONT_SIZES.indexOf(currentFontSize) + 1;
                    if (nextIndex < FONT_SIZES.length) {
                        currentFontSize = FONT_SIZES[nextIndex];
                    }
                } else if (action === 'decrease') {
                    const prevIndex = FONT_SIZES.indexOf(currentFontSize) - 1;
                    if (prevIndex >= 0) {
                        currentFontSize = FONT_SIZES[prevIndex];
                    }
                } else if (action === 'reset') {
                    currentFontSize = DEFAULT_FONT_SIZE;
                }
                
                applyFontSize();
                updateFontSizeDisplay(sizeDisplay);
                saveFontSize();
            });
        });
    }

    /**
     * Apply current font size to content
     */
    function applyFontSize() {
        const bodyInner = document.getElementById('body-inner');
        if (bodyInner) {
            bodyInner.style.fontSize = (currentFontSize / 100) * 1.08 + 'rem';
        }
    }

    /**
     * Update font size display
     */
    function updateFontSizeDisplay(element) {
        if (element) {
            element.textContent = currentFontSize + '%';
        }
        
        // Update button states
        const decreaseBtn = document.querySelector('.reader-font-btn[data-action="decrease"]');
        const increaseBtn = document.querySelector('.reader-font-btn[data-action="increase"]');
        
        if (decreaseBtn) {
            decreaseBtn.disabled = currentFontSize === FONT_SIZES[0];
        }
        if (increaseBtn) {
            increaseBtn.disabled = currentFontSize === FONT_SIZES[FONT_SIZES.length - 1];
        }
    }

    /**
     * Save font size to localStorage
     */
    function saveFontSize() {
        try {
            localStorage.setItem(FONT_SIZE_KEY, currentFontSize.toString());
        } catch (e) {
            // localStorage not available
        }
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

    // Reading progress state
    let totalReadingTime = 0;
    let scrollHandler = null;

    /**
     * Calculate estimated reading time based on word count
     */
    function calculateReadingTime() {
        const content = document.querySelector('#body-inner');
        if (!content) return;

        // Get text content and count words
        const text = content.textContent || content.innerText;
        const words = text.trim().split(/\s+/).length;
        
        // Average reading speed: 200-250 words per minute
        const wordsPerMinute = 220;
        totalReadingTime = Math.ceil(words / wordsPerMinute);

        // Update the initial display
        updateReadingProgress();

        // Setup scroll listener for progress tracking
        if (!scrollHandler) {
            scrollHandler = throttle(updateReadingProgress, 100);
            window.addEventListener('scroll', scrollHandler, { passive: true });
        }
    }

    /**
     * Update reading progress indicator
     */
    function updateReadingProgress() {
        const progressBar = document.querySelector('.reader-progress-bar');
        const progressPercent = document.querySelector('.reader-progress-percent');
        const progressTime = document.querySelector('.reader-progress-time');
        
        if (!progressBar || !progressPercent || !progressTime) return;

        // Calculate scroll progress
        const content = document.querySelector('#body-inner');
        if (!content) return;

        const contentRect = content.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const contentTop = window.scrollY + contentRect.top;
        const contentHeight = contentRect.height;
        
        // Calculate how much of the content has been scrolled past
        const scrolled = window.scrollY - contentTop + windowHeight;
        const totalScrollable = contentHeight;
        
        let progress = Math.max(0, Math.min(100, (scrolled / totalScrollable) * 100));
        
        // Update circular progress bar
        progressBar.setAttribute('stroke-dasharray', `${progress}, 100`);
        
        // Update percentage text
        progressPercent.textContent = `${Math.round(progress)}%`;
        
        // Update remaining time
        const remainingPercent = Math.max(0, 100 - progress);
        const remainingTime = Math.ceil((remainingPercent / 100) * totalReadingTime);
        
        if (remainingTime <= 0) {
            progressTime.textContent = 'Done!';
            document.querySelector('.reader-progress-label').textContent = '';
        } else if (remainingTime === 1) {
            progressTime.textContent = '< 1 min';
            document.querySelector('.reader-progress-label').textContent = 'remaining';
        } else {
            progressTime.textContent = `${remainingTime} min`;
            document.querySelector('.reader-progress-label').textContent = 'remaining';
        }
    }

    /**
     * Throttle function to limit how often a function is called
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
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

