/**
 * Search Modal
 * Cmd/Ctrl+K quick search overlay with Pagefind integration
 */

(function() {
    'use strict';

    let modal = null;
    let backdrop = null;
    let input = null;
    let isOpen = false;
    let pagefindAvailable = false;

    /**
     * Initialize the search modal
     */
    function init() {
        createModal();
        setupEventListeners();
    }

    /**
     * Create the modal HTML structure
     */
    function createModal() {
        // Create backdrop
        backdrop = document.createElement('div');
        backdrop.className = 'search-modal-backdrop';
        backdrop.addEventListener('click', closeModal);
        document.body.appendChild(backdrop);

        // Create modal
        modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Search');
        
        modal.innerHTML = `
            <div class="search-modal-body">
                <div id="search-modal-pagefind"></div>
            </div>
            <div class="search-modal-footer">
                <div class="search-modal-footer-hints">
                    <span class="search-modal-footer-hint">
                        <kbd>↑</kbd><kbd>↓</kbd> navigate
                    </span>
                    <span class="search-modal-footer-hint">
                        <kbd>↵</kbd> select
                    </span>
                    <span class="search-modal-footer-hint">
                        <kbd>Esc</kbd> close
                    </span>
                </div>
                <a href="/search/" class="search-modal-footer-link">
                    Full Search Page →
                </a>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Try to initialize Pagefind, or show fallback
        initPagefind();
    }

    /**
     * Initialize Pagefind in the modal
     */
    function initPagefind() {
        const container = document.getElementById('search-modal-pagefind');
        
        // Check if Pagefind is available
        if (typeof PagefindUI !== 'undefined') {
            try {
                new PagefindUI({
                    element: '#search-modal-pagefind',
                    showSubResults: true,
                    showImages: false,
                    excerptLength: 15,
                    resetStyles: false,
                    autofocus: true,
                    translations: {
                        placeholder: "Search articles...",
                        zero_results: "No results found for \"[SEARCH_TERM]\"",
                        many_results: "[COUNT] results",
                        one_result: "1 result"
                    }
                });
                pagefindAvailable = true;
                
                // Get the Pagefind input reference
                setTimeout(function() {
                    input = modal.querySelector('.pagefind-ui__search-input');
                }, 100);
                
                return;
            } catch (e) {
                console.warn('Pagefind initialization failed:', e);
            }
        }
        
        // Fallback: Show a simple search form that redirects to search page
        pagefindAvailable = false;
        if (container) {
            container.innerHTML = `
                <form class="search-modal-fallback-form" action="/search/" method="get">
                    <div class="search-modal-fallback-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input 
                            type="text" 
                            name="q" 
                            class="search-modal-fallback-input" 
                            placeholder="Search articles..."
                            autocomplete="off"
                            spellcheck="false"
                        >
                    </div>
                </form>
                <div class="search-modal-fallback-hint">
                    Press <kbd>Enter</kbd> to search
                </div>
            `;
            input = container.querySelector('.search-modal-fallback-input');
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Keyboard shortcut: Cmd/Ctrl + K
        document.addEventListener('keydown', function(e) {
            // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleModal();
            }
            
            // Close on Escape
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                closeModal();
            }
        });

        // Prevent modal from closing when clicking inside
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Arrow key navigation and Enter to select
        modal.addEventListener('keydown', function(e) {
            if (!isOpen) return;

            const results = modal.querySelectorAll('.pagefind-ui__result-link');
            if (results.length === 0) return;

            const focused = document.activeElement;
            const currentInput = modal.querySelector('.pagefind-ui__search-input') || 
                                 modal.querySelector('.search-modal-fallback-input');
            const isInInput = focused === currentInput;
            const currentIndex = Array.from(results).indexOf(focused);

            // Arrow Down
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (isInInput || currentIndex === -1) {
                    // Move from input to first result
                    results[0].focus();
                } else if (currentIndex < results.length - 1) {
                    // Move to next result
                    results[currentIndex + 1].focus();
                }
            }

            // Arrow Up
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentIndex > 0) {
                    // Move to previous result
                    results[currentIndex - 1].focus();
                } else if (currentIndex === 0 && currentInput) {
                    // Move back to input from first result
                    currentInput.focus();
                }
            }

            // Enter to select focused result
            if (e.key === 'Enter' && !isInInput && currentIndex >= 0) {
                e.preventDefault();
                results[currentIndex].click();
            }
        });
    }

    /**
     * Toggle modal open/close
     */
    function toggleModal() {
        if (isOpen) {
            closeModal();
        } else {
            openModal();
        }
    }

    /**
     * Open the modal
     */
    function openModal() {
        if (isOpen) return;
        
        isOpen = true;
        backdrop.classList.add('active');
        modal.classList.add('active');
        document.body.classList.add('search-modal-open');
        
        // Focus input after animation
        setTimeout(function() {
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    }

    /**
     * Close the modal
     */
    function closeModal() {
        if (!isOpen) return;
        
        isOpen = false;
        backdrop.classList.remove('active');
        modal.classList.remove('active');
        document.body.classList.remove('search-modal-open');
        
        // Clear input
        if (input) {
            input.value = '';
            // If Pagefind, trigger input event to clear results
            if (pagefindAvailable) {
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.SearchModal = {
        open: openModal,
        close: closeModal,
        toggle: toggleModal,
        isOpen: function() { return isOpen; }
    };

})();
