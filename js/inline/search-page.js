// Extracted from layouts/search/list.html so the page works with a CSP without 'unsafe-inline'.
window.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Pagefind
    const pagefind = new PagefindUI({ 
        element: "#pagefind-results",
        showSubResults: true,
        showImages: false,
        excerptLength: 30,
        resetStyles: false,
        autofocus: true,
        translations: {
            placeholder: "Search articles... (Use Quotes for exact matches)",
            zero_results: "No results found for \"[SEARCH_TERM]\". Try different keywords.",
            many_results: "[COUNT] results for \"[SEARCH_TERM]\"",
            one_result: "1 result for \"[SEARCH_TERM]\"",
            clear_search: "Clear",
            search_label: "Search articles"
        }
    });

    const searchInput = document.querySelector('#pagefind-results .pagefind-ui__search-input, #pagefind-results input');
    if (searchInput) {
        if (!searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Search articles');
        }
        const clearBtn = document.querySelector('#pagefind-results .pagefind-ui__search-clear');
        if (clearBtn && !clearBtn.getAttribute('aria-label')) {
            clearBtn.setAttribute('aria-label', 'Clear search');
        }
    }
    
    // Check for query parameter and trigger search
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query && searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
});
