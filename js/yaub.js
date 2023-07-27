
// Stick the TOC to the top of the screen when scrolling
/* $(document).ready(function(){
  $("#toc-field").sticky({position: sticky, rightSpacing: 0, topSpacing:0, zIndex: 1000});
}); */

// add animated scrollbar when hovering anchors in the TOC
$('#toc-field a:not(:has(img)):not(.btn):not(.nav-prev):not(.nav-next):not(.no-highlight)').addClass('highlight');

// triggers back to top button
(function($) {
  // Make sure JS class is added.
  document.documentElement.className = "js";
  // Run on page scroll.
  $(window).scroll( function() {

  // Toggle header class after threshold point.
    if ( $(this).scrollTop() > 100 ) {
      $(".top-btn").addClass('sticky');
    } else {
      $(".top-btn").removeClass('sticky');
    }
  });
})(jQuery);

/* add copy links to headers */
/* default function by hugo-learn does not work with asciidoc ? */
jQuery(document).ready(function() {
  // Add link button for every
  var text, clip = new ClipboardJS('.anchor');
  $("h2,h3,h4,h5,h6,archive").append(function(index, html){
    var element = $(this);
    var url = encodeURI(document.location.origin + document.location.pathname);
    var link = url + "#"+element[0].id;

    if (!(element[0].classList.contains('recentlist')) && (!(element[0].classList.contains('shortcut-title')))) {
      return " <span class='anchor' data-clipboard-text='"+link+"'>" +
        "<i class='fas fa-link fa-lg'></i>" +
        "</span>"
      ;
    }
  });

  $(".anchor").on('mouseleave', function(e) {
    $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
  });

  clip.on('success', function(e) {
      e.clearSelection();
      $(e.trigger).attr('aria-label', 'Link copied to clipboard!').addClass('tooltipped tooltipped-s');
  });
  $('code.language-mermaid').each(function(index, element) {
    var content = $(element).html().replace(/&amp;/g, '&');
    $(element).parent().replaceWith('<div class="mermaid" align="center">' + content + '</div>');
  });
});
