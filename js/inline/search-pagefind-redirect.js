// Extracted from layouts/partials/search-pagefind-redirect.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    const input = document.getElementById('sidebar-search');
    const clearBtn = document.getElementById('sidebar-search-clear');
    
    // Show/hide clear button
    input.addEventListener('input', function() {
        clearBtn.style.display = this.value ? 'block' : 'none';
    });
    
    // Clear button click
    clearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        input.value = '';
        clearBtn.style.display = 'none';
        input.focus();
    });
})();
