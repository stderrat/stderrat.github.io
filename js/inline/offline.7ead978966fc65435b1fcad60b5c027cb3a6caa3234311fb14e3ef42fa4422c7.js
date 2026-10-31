// Extracted from layouts/offline/list.html so the page works with a CSP without 'unsafe-inline'.
// Auto-retry when connection is restored
window.addEventListener('online', function() {
    location.reload();
});
