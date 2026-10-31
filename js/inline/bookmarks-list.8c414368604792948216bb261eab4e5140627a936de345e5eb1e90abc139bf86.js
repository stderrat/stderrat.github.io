// Extracted from layouts/partials/bookmarks-list.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    const STORAGE_KEY = 'blog-bookmarks';
    
    function getBookmarks() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }
    
    function saveBookmarks(bookmarks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
    
    function removeBookmark(url) {
        let bookmarks = getBookmarks();
        bookmarks = bookmarks.filter(b => b.url !== url);
        saveBookmarks(bookmarks);
        renderBookmarks();
        
        // Update bookmark button if on same page
        const btn = document.querySelector('.bookmark-btn[data-url="' + url + '"]');
        if (btn) {
            btn.classList.remove('bookmarked');
            const icon = btn.querySelector('.bookmark-icon');
            const text = btn.querySelector('.bookmark-text');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
            if (text) text.textContent = 'Save';
        }
    }
    
    function renderBookmarks() {
        const bookmarks = getBookmarks();
        const list = document.getElementById('bookmarks-list');
        const empty = document.getElementById('bookmarks-empty');
        const clearBtn = document.getElementById('bookmarks-clear');
        const countEl = document.querySelector('.bookmarks-count');
        
        if (!list) return;
        
        // Update count
        if (countEl) {
            countEl.textContent = bookmarks.length;
            countEl.style.display = bookmarks.length > 0 ? 'inline-block' : 'none';
        }
        
        if (bookmarks.length === 0) {
            list.innerHTML = '';
            if (empty) empty.style.display = 'block';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }
        
        if (empty) empty.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'block';
        
        list.innerHTML = bookmarks.map(b => `
            <li class="bookmark-item">
                <a href="${b.url}" class="bookmark-link">
                    <span class="bookmark-item-title">${b.title}</span>
                    <span class="bookmark-item-meta">
                        <span class="bookmark-item-section">${b.section}</span>
                        ${b.date ? '<span class="bookmark-item-date">' + b.date + '</span>' : ''}
                    </span>
                </a>
                <button class="bookmark-remove" data-url="${b.url}" title="Remove bookmark">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `).join('');
        
        // Add remove handlers
        list.querySelectorAll('.bookmark-remove').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                removeBookmark(this.dataset.url);
            });
        });
    }
    
    function clearAllBookmarks() {
        if (confirm('Remove all saved articles?')) {
            localStorage.removeItem(STORAGE_KEY);
            renderBookmarks();
            
            // Update any bookmark buttons on page
            document.querySelectorAll('.bookmark-btn.bookmarked').forEach(btn => {
                btn.classList.remove('bookmarked');
                const icon = btn.querySelector('.bookmark-icon');
                const text = btn.querySelector('.bookmark-text');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
                if (text) text.textContent = 'Save';
            });
        }
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        renderBookmarks();
        
        const clearBtn = document.getElementById('bookmarks-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAllBookmarks);
        }
    });
    
    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY) {
            renderBookmarks();
        }
    });
    
    // Listen for bookmark changes from the bookmark button (same page)
    window.addEventListener('bookmarks-changed', function() {
        renderBookmarks();
    });
})();
