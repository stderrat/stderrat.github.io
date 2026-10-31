// Extracted from layouts/partials/bookmark-button.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    const STORAGE_KEY = 'blog-bookmarks';
    
    // Get all bookmarks from localStorage
    function getBookmarks() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }
    
    // Save bookmarks to localStorage
    function saveBookmarks(bookmarks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
    
    // Check if current article is bookmarked
    function isBookmarked(url) {
        return getBookmarks().some(b => b.url === url);
    }
    
    // Toggle bookmark state
    function toggleBookmark(btn) {
        const url = btn.dataset.url;
        const title = btn.dataset.title;
        const section = btn.dataset.section;
        const date = btn.dataset.date;
        
        let bookmarks = getBookmarks();
        const existingIndex = bookmarks.findIndex(b => b.url === url);
        
        if (existingIndex > -1) {
            // Remove bookmark
            bookmarks.splice(existingIndex, 1);
            updateButtonState(btn, false);
            showToast('Bookmark removed');
        } else {
            // Add bookmark
            bookmarks.unshift({
                url: url,
                title: title,
                section: section,
                date: date,
                savedAt: new Date().toISOString()
            });
            updateButtonState(btn, true);
            showToast('Article saved!');
        }
        
        saveBookmarks(bookmarks);
        updateBookmarkCount();
        
        // Dispatch custom event to notify bookmarks list to update
        window.dispatchEvent(new CustomEvent('bookmarks-changed'));
    }
    
    // Update button appearance
    function updateButtonState(btn, isBookmarked) {
        const icon = btn.querySelector('.bookmark-icon');
        const text = btn.querySelector('.bookmark-text');
        
        if (isBookmarked) {
            btn.classList.add('bookmarked');
            icon.classList.remove('far');
            icon.classList.add('fas');
            text.textContent = 'Saved';
        } else {
            btn.classList.remove('bookmarked');
            icon.classList.remove('fas');
            icon.classList.add('far');
            text.textContent = 'Save';
        }
    }
    
    // Show toast notification
    function showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.bookmark-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'bookmark-toast';
        toast.innerHTML = '<i class="fas fa-check"></i> ' + message;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // Update bookmark count in sidebar (if element exists)
    function updateBookmarkCount() {
        const countEl = document.querySelector('.bookmarks-count');
        if (countEl) {
            const count = getBookmarks().length;
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        const btn = document.querySelector('.bookmark-btn');
        if (btn) {
            // Set initial state
            updateButtonState(btn, isBookmarked(btn.dataset.url));
            
            // Add click handler
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleBookmark(this);
            });
        }
        
        updateBookmarkCount();
    });
})();
