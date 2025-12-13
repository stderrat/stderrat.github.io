/**
 * Search Modal
 * Cmd/Ctrl+K quick search overlay with Pagefind integration
 */

(function() {
    'use strict';

    const RECENT_SEARCHES_KEY = 'recentSearches';
    const MAX_RECENT_SEARCHES = 5;

    let modal = null;
    let backdrop = null;
    let input = null;
    let isOpen = false;
    let pagefindAvailable = false;
    let recentSearchesContainer = null;

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
                <div class="recent-searches" style="display: none;">
                    <div class="recent-searches-header">
                        <span class="recent-searches-title">Recent Searches</span>
                        <button class="recent-searches-clear" type="button">Clear History</button>
                    </div>
                    <div class="recent-searches-list"></div>
                </div>
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
        recentSearchesContainer = modal.querySelector('.recent-searches');
        
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
                
                // Get the Pagefind input reference and setup listeners
                setTimeout(function() {
                    input = modal.querySelector('.pagefind-ui__search-input');
                    if (input) {
                        setupSearchInputListeners();
                    }
                    setupRecentSearchesListeners();
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
            if (input) {
                setupSearchInputListeners();
            }
        }
        
        // Setup recent searches clear button
        setupRecentSearchesListeners();
    }

    /**
     * Setup listeners for search input
     */
    function setupSearchInputListeners() {
        if (!input) return;

        // Track when user performs a search
        let searchTimeout = null;
        input.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Show/hide recent searches based on input
            if (query.length === 0) {
                showRecentSearches();
            } else {
                hideRecentSearches();
            }
            
            // Save search after user stops typing (debounced)
            clearTimeout(searchTimeout);
            if (query.length >= 3) {
                searchTimeout = setTimeout(function() {
                    saveRecentSearch(query);
                }, 1500);
            }
        });

        // Save search on Enter
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query.length >= 2) {
                    saveRecentSearch(query);
                }
            }
        });
    }

    /**
     * Setup listeners for recent searches UI
     */
    function setupRecentSearchesListeners() {
        // Clear button
        const clearBtn = modal.querySelector('.recent-searches-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                clearRecentSearches();
            });
        }
    }

    /**
     * Get recent searches from localStorage
     */
    function getRecentSearches() {
        try {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Save a search term to recent searches
     */
    function saveRecentSearch(query) {
        if (!query || query.length < 2) return;
        
        let searches = getRecentSearches();
        
        // Remove if already exists (to move to top)
        searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
        
        // Add to beginning
        searches.unshift(query);
        
        // Keep only MAX_RECENT_SEARCHES
        searches = searches.slice(0, MAX_RECENT_SEARCHES);
        
        try {
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
        } catch (e) {
            console.warn('Could not save recent search:', e);
        }
    }

    /**
     * Clear all recent searches
     */
    function clearRecentSearches() {
        try {
            localStorage.removeItem(RECENT_SEARCHES_KEY);
            hideRecentSearches();
        } catch (e) {
            console.warn('Could not clear recent searches:', e);
        }
    }

    /**
     * Show recent searches UI
     */
    function showRecentSearches() {
        if (!recentSearchesContainer) return;
        
        const searches = getRecentSearches();
        if (searches.length === 0) {
            hideRecentSearches();
            return;
        }
        
        const list = recentSearchesContainer.querySelector('.recent-searches-list');
        if (list) {
            list.innerHTML = searches.map(function(term) {
                return `
                    <button class="recent-search-item" type="button" data-search="${escapeHtml(term)}">
                        <i class="fas fa-history"></i>
                        <span>${escapeHtml(term)}</span>
                    </button>
                `;
            }).join('');
            
            // Add click listeners to items
            list.querySelectorAll('.recent-search-item').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const searchTerm = this.getAttribute('data-search');
                    if (input && searchTerm) {
                        input.value = searchTerm;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.focus();
                        hideRecentSearches();
                    }
                });
            });
        }
        
        recentSearchesContainer.style.display = 'block';
    }

    /**
     * Hide recent searches UI
     */
    function hideRecentSearches() {
        if (recentSearchesContainer) {
            recentSearchesContainer.style.display = 'none';
        }
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
        
        // Show recent searches if input is empty
        showRecentSearches();
        
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
