// Extracted from layouts/partials/footer.html so the page works with a CSP without 'unsafe-inline'.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (err) {
      console.warn('Service worker registration failed:', err);
    });
  });
}
