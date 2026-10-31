// Extracted from layouts/partials/search-pagefind.html so the page works with a CSP without 'unsafe-inline'.
window.addEventListener('DOMContentLoaded', (event) => {
    new PagefindUI({ 
        element: "#pagefind-search",
        showSubResults: true,
        showImages: false,
        excerptLength: 15,
        resetStyles: false,
        translations: {
            placeholder: "Search articles...",
            zero_results: "No results for [SEARCH_TERM]",
            clear_search: "Clear",
            search_label: "Search articles"
        }
    });
    var input = document.querySelector('#pagefind-search .pagefind-ui__search-input');
    if (input && !input.getAttribute('aria-label')) {
        input.setAttribute('aria-label', 'Search articles');
    }
    var clearBtn = document.querySelector('#pagefind-search .pagefind-ui__search-clear');
    if (clearBtn && !clearBtn.getAttribute('aria-label')) {
        clearBtn.setAttribute('aria-label', 'Clear search');
    }
});
