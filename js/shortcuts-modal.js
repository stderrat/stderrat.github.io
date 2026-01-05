/**
 * Keyboard Shortcuts Help Modal
 * Shows available keyboard shortcuts when user presses '?'
 */

(function() {
    'use strict';

    let modal = null;
    let isOpen = false;

    // Detect OS for showing correct modifier key
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? '⌘' : 'Ctrl';

    // Check if theme toggle is enabled
    const themeToggleEnabled = !!document.getElementById('theme-toggle-btn');
    
    // Build general items based on what's enabled
    const generalItems = [];
    if (themeToggleEnabled) {
        generalItems.push({ keys: 'T', description: 'Toggle dark/light theme' });
    }
    generalItems.push({ keys: '?', description: 'Show this help' });

    const shortcuts = [
        {
            category: 'Navigation',
            items: [
                { keys: '[', description: 'Toggle sidebar' }
            ]
        },
        {
            category: 'Search',
            items: [
                { keys: `${modKey}+K`, description: 'Open search' },
                { keys: '↑ ↓', description: 'Navigate results' },
                { keys: 'Enter', description: 'Open selected result' },
                { keys: 'Esc', description: 'Close search' }
            ]
        },
        {
            category: 'Reading',
            items: [
                { keys: 'R', description: 'Toggle reader mode' },
                { keys: '+ / −', description: 'Adjust font size (reader mode)' },
                { keys: 'Esc', description: 'Exit reader mode' }
            ]
        },
        {
            category: 'General',
            items: generalItems
        }
    ];

    function createModal() {
        modal = document.createElement('div');
        modal.id = 'shortcuts-modal';
        modal.className = 'shortcuts-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'shortcuts-modal-title');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="shortcuts-modal-backdrop"></div>
            <div class="shortcuts-modal-content">
                <header class="shortcuts-modal-header">
                    <h2 id="shortcuts-modal-title">
                        <i class="fas fa-keyboard"></i>
                        Keyboard Shortcuts
                    </h2>
                    <button class="shortcuts-modal-close" aria-label="Close shortcuts help">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <div class="shortcuts-modal-body">
                    ${shortcuts.map(section => `
                        <div class="shortcuts-section">
                            <h3 class="shortcuts-category">${section.category}</h3>
                            <dl class="shortcuts-list">
                                ${section.items.map(item => `
                                    <div class="shortcut-item">
                                        <dt class="shortcut-keys">${formatKeys(item.keys)}</dt>
                                        <dd class="shortcut-desc">${item.description}</dd>
                                    </div>
                                `).join('')}
                            </dl>
                        </div>
                    `).join('')}
                </div>
                <footer class="shortcuts-modal-footer">
                    <span class="shortcuts-hint">Press <kbd>?</kbd> or <kbd>Esc</kbd> to close</span>
                </footer>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.shortcuts-modal-backdrop').addEventListener('click', closeModal);
        modal.querySelector('.shortcuts-modal-close').addEventListener('click', closeModal);
    }

    function formatKeys(keys) {
        // Split by spaces and wrap each key in kbd
        return keys.split(' ').map(key => {
            if (key === '/') return '<span class="shortcut-separator">/</span>';
            return `<kbd>${key}</kbd>`;
        }).join('');
    }

    function openModal() {
        if (!modal) createModal();
        
        isOpen = true;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for accessibility
        setTimeout(() => {
            modal.querySelector('.shortcuts-modal-close').focus();
        }, 100);

        // Announce to screen readers
        announceToScreenReader('Keyboard shortcuts dialog opened');
    }

    function closeModal() {
        if (!modal || !isOpen) return;
        
        isOpen = false;
        modal.classList.remove('active');
        document.body.style.overflow = '';

        announceToScreenReader('Keyboard shortcuts dialog closed');
    }

    function toggleModal() {
        if (isOpen) {
            closeModal();
        } else {
            openModal();
        }
    }

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    function toggleSidebar() {
        // Toggle sidebar using the same mechanism as yaub.js
        const sidebar = document.getElementById('sidebar');
        const body = document.getElementById('body');
        
        if (sidebar && body) {
            if (sidebar.classList.contains('collapsed')) {
                // Expand sidebar
                sidebar.classList.remove('collapsed');
                body.classList.remove('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', 'false');
                announceToScreenReader('Sidebar expanded');
            } else {
                // Collapse sidebar
                sidebar.classList.add('collapsed');
                body.classList.add('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', 'true');
                announceToScreenReader('Sidebar collapsed');
            }
        }
    }

    function handleKeyDown(e) {
        // Don't trigger when typing in inputs
        const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) ||
                         document.activeElement.isContentEditable;

        // Close on Escape
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            closeModal();
            return;
        }

        // Toggle on ? (Shift + /)
        if (e.key === '?' && !isTyping) {
            e.preventDefault();
            toggleModal();
            return;
        }

        // Toggle sidebar on [
        if (e.key === '[' && !isTyping && !isOpen) {
            e.preventDefault();
            toggleSidebar();
            return;
        }
    }

    function init() {
        document.addEventListener('keydown', handleKeyDown);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose globally for button clicks
    window.ShortcutsModal = {
        open: openModal,
        close: closeModal,
        toggle: toggleModal
    };
})();

