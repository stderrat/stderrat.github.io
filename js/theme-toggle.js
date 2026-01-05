/**
 * ============================================================================
 * Theme Toggle - Dark/Light Mode Switcher
 * ============================================================================
 * 
 * Handles theme switching with:
 * - Local storage persistence
 * - System preference detection
 * - Smooth transitions
 * - Accessible keyboard support
 * 
 * ============================================================================
 */

(function() {
    'use strict';

    // Theme constants
    const STORAGE_KEY = 'yaub-theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';
    const TRANSITION_DURATION = 300;

    /**
     * ThemeToggle Module
     * Encapsulates all theme switching functionality
     */
    const ThemeToggle = {
        /**
         * Initialize the theme toggle
         */
        init: function() {
            // Apply saved theme or system preference immediately (before paint)
            this.applyInitialTheme();
            
            // Set up toggle button when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupToggleButton());
            } else {
                this.setupToggleButton();
            }

            // Listen for system preference changes
            this.watchSystemPreference();
        },

        /**
         * Get the current theme from storage (ignore system preference)
         * @returns {string} 'dark' or 'light'
         */
        getPreferredTheme: function() {
            // Check localStorage first
            const stored = this.getStoredTheme();
            if (stored) {
                return stored;
            }

            // Default to dark (ignore system preference)
            return THEME_DARK;
        },

        /**
         * Get theme from localStorage
         * @returns {string|null}
         */
        getStoredTheme: function() {
            try {
                return localStorage.getItem(STORAGE_KEY);
            } catch (e) {
                // localStorage may not be available (private browsing, etc.)
                return null;
            }
        },

        /**
         * Save theme to localStorage
         * @param {string} theme - 'dark' or 'light'
         */
        storeTheme: function(theme) {
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch (e) {
                // Silently fail if localStorage is not available
            }
        },

        /**
         * Apply theme to document
         * @param {string} theme - 'dark' or 'light'
         * @param {boolean} transition - Whether to animate the transition
         */
        applyTheme: function(theme, transition = false) {
            const html = document.documentElement;
            
            if (transition) {
                // Add transition class for smooth color changes
                html.classList.add('theme-transitioning');
                
                // Remove transition class after animation completes
                setTimeout(() => {
                    html.classList.remove('theme-transitioning');
                }, TRANSITION_DURATION);
            }

            // Apply the theme
            html.setAttribute('data-theme', theme);
            
            // Update meta theme-color for mobile browsers
            this.updateMetaThemeColor(theme);
            
            // Update aria-label on toggle button
            this.updateButtonState(theme);
        },

        /**
         * Apply initial theme (before first paint to prevent flash)
         */
        applyInitialTheme: function() {
            const theme = this.getPreferredTheme();
            this.applyTheme(theme, false);
        },

        /**
         * Toggle between dark and light themes
         */
        toggle: function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_DARK;
            const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
            
            this.applyTheme(newTheme, true);
            this.storeTheme(newTheme);
            
            // Dispatch custom event for other scripts to react
            window.dispatchEvent(new CustomEvent('themechange', {
                detail: { theme: newTheme }
            }));
        },

        /**
         * Set up the toggle button
         */
        setupToggleButton: function() {
            const button = document.getElementById('theme-toggle-btn');
            if (!button) return;

            // Click handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });

            // Keyboard support (Enter and Space)
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle();
                }
            });

            // Update initial button state
            const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_DARK;
            this.updateButtonState(currentTheme);
        },

        /**
         * Update button aria-label based on current theme
         * @param {string} theme - Current theme
         */
        updateButtonState: function(theme) {
            const button = document.getElementById('theme-toggle-btn');
            if (!button) return;

            const label = theme === THEME_DARK 
                ? 'Switch to light mode' 
                : 'Switch to dark mode';
            
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
        },

        /**
         * Update meta theme-color for mobile browser chrome
         * @param {string} theme - Current theme
         */
        updateMetaThemeColor: function(theme) {
            let meta = document.querySelector('meta[name="theme-color"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'theme-color';
                document.head.appendChild(meta);
            }
            
            // Use appropriate color for each theme
            meta.content = theme === THEME_DARK ? '#303030' : '#f7f8fa';
        },

        /**
         * Watch for system preference changes
         * Disabled - theme only changes when user explicitly toggles
         */
        watchSystemPreference: function() {
            // Disabled - ignore system preference changes
            // Theme only switches when user clicks the toggle button
            return;
        },

        /**
         * Get current theme
         * @returns {string} Current theme ('dark' or 'light')
         */
        getCurrentTheme: function() {
            return document.documentElement.getAttribute('data-theme') || THEME_DARK;
        },

        /**
         * Set theme programmatically
         * @param {string} theme - 'dark' or 'light'
         */
        setTheme: function(theme) {
            if (theme !== THEME_DARK && theme !== THEME_LIGHT) {
                console.warn('Invalid theme:', theme);
                return;
            }
            this.applyTheme(theme, true);
            this.storeTheme(theme);
        },

        /**
         * Clear stored preference (will reset to dark mode)
         */
        clearPreference: function() {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                // Silently fail
            }
            // Reset to default (dark mode)
            this.applyTheme(THEME_DARK, true);
        }
    };

    // Initialize on script load
    ThemeToggle.init();

    // Add keyboard shortcut (T key) for theme toggle (only if button exists)
    if (document.getElementById('theme-toggle-btn')) {
        document.addEventListener('keydown', function(e) {
            // Don't trigger if user is typing in an input field
            const target = e.target;
            const tagName = target.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable) {
                return;
            }
            
            // Check for 'T' key (case insensitive, no modifiers)
            if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                // Don't toggle if any modal is open
                const searchModal = document.querySelector('.search-modal.active');
                const shortcutsModal = document.querySelector('.shortcuts-modal.active');
                if (searchModal || shortcutsModal) return;
                
                e.preventDefault();
                ThemeToggle.toggle();
            }
        });
    }

    // Expose to global scope for external access
    window.ThemeToggle = ThemeToggle;
})();

