// Extracted from layouts/partials/footer.html so the page works with a CSP without 'unsafe-inline'.
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

document.addEventListener('DOMContentLoaded', function () {
  if (typeof jQuery === 'undefined') return;
  jQuery(".article-box").click(function(event) {
    window.location = jQuery(this).attr('href');
    event.stopPropagation();
    return false;
  });
});
