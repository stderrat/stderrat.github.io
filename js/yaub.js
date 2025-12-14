
var theme = true;
var isPrint = document.querySelector('body').classList.contains('print');
var isPrintPreview = false;

var isRtl = document.querySelector('html').getAttribute('dir') == 'rtl';
var lang = document.querySelector('html').getAttribute('lang');
var dir_padding_start = 'padding-left';
var dir_padding_end = 'padding-right';
var dir_key_start = 37;
var dir_key_end = 39;
var dir_scroll = 1;
if (isRtl) {
  dir_padding_start = 'padding-right';
  dir_padding_end = 'padding-left';
  dir_key_start = 39;
  dir_key_end = 37;
  dir_scroll = -1;
}

// Stick the TOC to the top of the screen when scrolling
/* $(document).ready(function(){
  $("#toc-field").sticky({position: sticky, rightSpacing: 0, topSpacing:0, zIndex: 1000});
}); */

// add animated scrollbar when hovering anchors in the TOC
$('#toc-field a:not(:has(img)):not(.btn):not(.nav-prev):not(.nav-next):not(.no-highlight)').addClass('highlight');

// ========================================
// TOC Scroll Spy - Track active section
// ========================================
(function() {
    'use strict';

    function initTocScrollSpy() {
        const toc = document.getElementById('TableOfContents');
        if (!toc) return;

        const tocLinks = toc.querySelectorAll('a');
        if (tocLinks.length === 0) return;

        // Get all headings that are linked in the TOC
        const headingIds = Array.from(tocLinks).map(link => {
            const href = link.getAttribute('href');
            return href ? href.substring(1) : null; // Remove the # prefix
        }).filter(id => id);

        const headings = headingIds.map(id => document.getElementById(id)).filter(el => el);
        
        if (headings.length === 0) return;

        // Track active heading
        let activeId = null;

        // Function to update active TOC item
        function setActiveTocItem(id) {
            if (activeId === id) return;
            activeId = id;

            // Remove active class from all items
            tocLinks.forEach(link => {
                const li = link.parentElement;
                if (li) li.classList.remove('active');
            });

            // Add active class to current item
            if (id) {
                const activeLink = toc.querySelector('a[href="#' + id + '"]');
                if (activeLink) {
                    const li = activeLink.parentElement;
                    if (li) li.classList.add('active');
                }
            }
        }

        // Use Intersection Observer for efficient scroll tracking
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -70% 0px', // Trigger when heading is near top
            threshold: 0
        };

        const observer = new IntersectionObserver(function(entries) {
            // Find the topmost visible heading
            let topHeading = null;
            let topPosition = Infinity;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const rect = entry.boundingClientRect;
                    if (rect.top < topPosition) {
                        topPosition = rect.top;
                        topHeading = entry.target;
                    }
                }
            });

            if (topHeading) {
                setActiveTocItem(topHeading.id);
            }
        }, observerOptions);

        // Observe all headings
        headings.forEach(heading => observer.observe(heading));

        // Also track scroll for cases where no heading is intersecting
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // Find the heading closest to the top of the viewport
                let closestHeading = null;
                let closestDistance = Infinity;

                headings.forEach(heading => {
                    const rect = heading.getBoundingClientRect();
                    const distance = Math.abs(rect.top - 100); // 100px from top
                    
                    // Only consider headings that are above or near the viewport top
                    if (rect.top <= 150 && distance < closestDistance) {
                        closestDistance = distance;
                        closestHeading = heading;
                    }
                });

                // If we're at the very top, select the first heading
                if (window.scrollY < 100 && headings.length > 0) {
                    setActiveTocItem(headings[0].id);
                } else if (closestHeading) {
                    setActiveTocItem(closestHeading.id);
                }
            }, 50);
        }, { passive: true });

        // Smooth scroll when clicking TOC links
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.getElementById(href.substring(1));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // Update URL hash without jumping
                        history.pushState(null, null, href);
                    }
                }
            });
        });

        // Set initial active item based on URL hash or first heading
        if (window.location.hash) {
            const hashId = window.location.hash.substring(1);
            if (headingIds.includes(hashId)) {
                setActiveTocItem(hashId);
            }
        } else if (headings.length > 0) {
            setActiveTocItem(headings[0].id);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTocScrollSpy);
    } else {
        initTocScrollSpy();
    }
})();

// triggers back to top button
(function($) {
  // Note: .js class is now added inline in header.html for faster rendering
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

/* ========================================
   COPY TOAST NOTIFICATION SYSTEM
======================================== */
(function() {
  'use strict';
  
  var toastContainer = null;
  
  // Create toast container if it doesn't exist
  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'copy-toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }
  
  // Show a toast notification
  window.showCopyToast = function(message, type) {
    message = message || 'Copied to clipboard!';
    type = type || 'success';
    
    var container = getToastContainer();
    var toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = '<span class="copy-toast-icon"><i class="fas fa-check"></i></span>' +
                      '<span>' + message + '</span>';
    
    container.appendChild(toast);
    
    // Remove after 2.5 seconds
    setTimeout(function() {
      toast.classList.add('toast-exit');
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2500);
  };
})();

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
      $(e.trigger).attr('aria-label', 'Link copied!').addClass('tooltipped tooltipped-s');
      // Show toast notification
      if (window.showCopyToast) {
        window.showCopyToast('Link copied to clipboard!');
      }
  });
  // Convert code blocks to mermaid pre elements (for initMermaid to process)
  $('code.language-mermaid').each(function(index, element) {
    var content = $(element).text(); // Use .text() to get decoded content
    // Create a pre element with the mermaid content (not div!)
    var preElement = $('<pre class="mermaid actionbar-wrapper zoomable" align="center"></pre>').text(content);
    $(element).parent().replaceWith(preElement);
  });
  
  // Let initMermaid process all mermaid elements (from shortcodes and code blocks)
  if (typeof initMermaid === 'function' && window.relearn && window.relearn.themeUseMermaid) {
    setTimeout(function() {
      try {
        // initMermaid will parse YAML, set up structure, and call mermaid.run()
        initMermaid(false, { theme: 'default' });
      } catch (e) {
        console.error('Mermaid initialization error:', e);
      }
    }, 100);
  }

  // Sidebar toggle functionality (target button by class to avoid duplicate ID issues)
  $('.sidebar-toggle-btn').on('click', function() {
    var sidebar = $('#sidebar');
    var body = $('#body');
    
    if (sidebar.hasClass('collapsed')) {
      // Expand sidebar
      sidebar.removeClass('collapsed');
      body.removeClass('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', 'false');
    } else {
      // Collapse sidebar
      sidebar.addClass('collapsed');
      body.addClass('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', 'true');
    }
  });

  // Restore sidebar state from localStorage
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    $('#sidebar').addClass('collapsed');
    $('#body').addClass('sidebar-collapsed');
  }

  // Menu expand/collapse functionality
  // Initialize: expand menus that are ancestors of current page (have .parent or .active class)
  $('#sidebar ul.topics li.dd-item.parent, #sidebar ul.topics li.dd-item.active').addClass('menu-expanded');
  
  // One-time cleanup: Remove any inline styles from old slideUp/slideDown
  $('#sidebar ul.topics ul').removeAttr('style');

  // Handle click on chevron to toggle menu
  $('#sidebar ul.topics').on('click', '.menu-chevron', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var $li = $(this).closest('li.dd-item');
    
    // Simply toggle the expanded class - CSS handles visibility
    $li.toggleClass('menu-expanded');
  });
});

function initMermaid(update, attrs) {
  if (!window.relearn.themeUseMermaid) {
    return;
  }
  var doBeside = true;
  var isImageRtl = isRtl;

  // we are either in update or initialization mode;
  // during initialization, we want to edit the DOM;
  // during update we only want to execute if something changed
  var decodeHTML = function (html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  var encodeHTML = function (text) {
    var html = document.createElement('textarea');
    html.textContent = text;
    return html.innerHTML;
  };

  var parseGraph = function (graph) {
    // See https://github.com/mermaid-js/mermaid/blob/9a080bb975b03b2b1d4ef6b7927d09e6b6b62760/packages/mermaid/src/diagram-api/frontmatter.ts#L10
    // for reference on the regex originally taken from jekyll
    var YAML = 1;
    var INIT = 2;
    var GRAPH = 3;
    var d = /^(?:\s*[\n\r])*(?:-{3}(\s*[\n\r](?:.*?)[\n\r])-{3}(?:\s*[\n\r]+)+)?(?:\s*(?:%%\s*\{\s*\w+\s*:([^%]*?)%%\s*[\n\r]?))?(.*)$/s;
    var m = d.exec(graph);
    var yaml = {};
    var dir = {};
    var content = graph;
    if (m && m.length == 4) {
      yaml = m[YAML] ? jsyaml.load(m[YAML]) : yaml;
      dir = m[INIT] ? JSON.parse('{ "init": ' + m[INIT]).init : dir;
      content = m[GRAPH] ? m[GRAPH] : content;
    }
    var ret = { yaml: yaml, dir: dir, content: content.trim() };
    return ret;
  };

  var serializeGraph = function (graph) {
    var yamlPart = '';
    if (Object.keys(graph.yaml).length) {
      yamlPart = '---\n' + jsyaml.dump(graph.yaml) + '---\n';
    }
    var dirPart = '';
    if (Object.keys(graph.dir).length) {
      dirPart = '%%{init: ' + JSON.stringify(graph.dir) + '}%%\n';
    }
    return yamlPart + dirPart + graph.content;
  };

  var init_func = function (attrs) {
    var is_initialized = false;
    var theme = attrs.theme;
    document.querySelectorAll('.mermaid').forEach(function (element) {
      var parse = parseGraph(decodeHTML(element.innerHTML));

      if (parse.yaml.theme) {
        parse.yaml.relearn_user_theme = true;
      }
      if (parse.dir.theme) {
        parse.dir.relearn_user_theme = true;
      }
      if (!parse.yaml.relearn_user_theme && !parse.dir.relearn_user_theme) {
        parse.yaml.theme = theme;
      }
      is_initialized = true;

      var graph = encodeHTML(serializeGraph(parse));
      var new_element = document.createElement('div');
      var hasActionbarWrapper = element.classList.contains('actionbar-wrapper');
      Array.from(element.attributes).forEach(function (attr) {
        new_element.setAttribute(attr.name, attr.value);
        element.removeAttribute(attr.name);
      });
      new_element.classList.add('mermaid-container');
      new_element.classList.remove('mermaid');
      new_element.classList.remove('actionbar-wrapper');
      element.classList.add('mermaid');
      if (hasActionbarWrapper) {
        element.classList.add('actionbar-wrapper');
      }

      element.innerHTML = graph;
      if (element.offsetParent !== null) {
        element.classList.add('mermaid-render');
      }
      new_element.innerHTML = '<div class="mermaid-code">' + graph + '</div>' + element.outerHTML;
      element.parentNode.replaceChild(new_element, element);
    });
    return is_initialized;
  };

  var update_func = function (attrs) {
    var is_initialized = false;
    var theme = attrs.theme;
    document.querySelectorAll('.mermaid-container').forEach(function (e) {
      var element = e.querySelector('.mermaid');
      var code = e.querySelector('.mermaid-code');
      var parse = parseGraph(decodeHTML(code.innerHTML));

      if (element.classList.contains('mermaid-render')) {
        if (parse.yaml.relearn_user_theme || parse.dir.relearn_user_theme) {
          return;
        }
        if (parse.yaml.theme == theme || parse.dir.theme == theme) {
          return;
        }
      }
      if (element.offsetParent !== null) {
        element.classList.add('mermaid-render');
      } else {
        element.classList.remove('mermaid-render');
        return;
      }
      is_initialized = true;

      parse.yaml.theme = theme;
      var graph = encodeHTML(serializeGraph(parse));
      element.removeAttribute('data-processed');
      element.innerHTML = graph;
      code.innerHTML = graph;
    });
    return is_initialized;
  };

  var state = this;
  if (update && !state.is_initialized) {
    return;
  }
  if (typeof mermaid == 'undefined' || typeof mermaid.mermaidAPI == 'undefined') {
    return;
  }

  if (!state.is_initialized) {
    state.is_initialized = true;
    window.addEventListener(
      'beforeprint',
      function () {
        isPrintPreview = true;
        initMermaid(true, {
          theme: getColorValue('PRINT-MERMAID-theme'),
        });
      }.bind(this)
    );
    window.addEventListener(
      'afterprint',
      function () {
        isPrintPreview = false;
        initMermaid(true);
      }.bind(this)
    );
  }

  attrs = attrs || {
    theme: getColorValue('MERMAID-theme'),
  };

  if (update) {
    unmark();
  }

  var is_initialized = update ? update_func(attrs) : init_func(attrs);
  if (is_initialized) {
    mermaid.initialize(Object.assign({ securityLevel: 'antiscript', startOnLoad: false }, window.relearn.mermaidConfig, { theme: attrs.theme }));
    mermaid.run({
      postRenderCallback: function (id) {
        // zoom for Mermaid
        // https://github.com/mermaid-js/mermaid/issues/1860#issuecomment-1345440607
        var svgs = d3.selectAll('body:not(.print) .mermaid-container.zoomable > .mermaid > #' + id);
        svgs.each(function () {
          var parent = this.parentElement;
          // we need to copy the maxWidth, otherwise our reset button will not align in the upper right
          parent.style.maxWidth = this.style.maxWidth || this.getAttribute('width');
          // if no unit is given for the width
          parent.style.maxWidth = parent.style.maxWidth || 'calc( ' + this.getAttribute('width') + 'px + 1rem )';
          var svg = d3.select(this);
          svg.html('<g>' + svg.html() + '</g>');
          var inner = svg.select('*:scope > g');
          parent.insertAdjacentHTML('beforeend', '<div class="actionbar"><span class="btn cstyle svg-reset-button action noborder notitle interactive"><button type="button" title="' + window.T_Reset_view + '"><i class="fa-fw fas fa-undo-alt"></i></button></span></div>');
          var wrapper = parent.querySelector('.svg-reset-button');
          var button = wrapper.querySelector('button');
          var zoom = d3.zoom().on('zoom', function (e) {
            inner.attr('transform', e.transform);
            if (e.transform.k == 1 && e.transform.x == 0 && e.transform.y == 0) {
              wrapper.classList.remove('zoomed');
            } else {
              wrapper.classList.add('zoomed');
            }
          });
          button.addEventListener('click', function () {
            this.blur();
            svg.transition().duration(350).call(zoom.transform, d3.zoomIdentity);
            showToast(window.T_View_reset);
          });
          svg.call(zoom);
        });
        // we need to mark again once the SVGs were drawn
        // to mark terms inside an SVG;
        // as we can not determine when all graphs are done,
        // we debounce the call
        debounce(mark, 200)();
      },
      querySelector: '.mermaid.mermaid-render',
      suppressErrors: true,
    });
  }
  if (update) {
    // if the page loads Mermaid but does not contain any
    // graphs, we will not call the above debounced mark()
    // and have to do it at least once here to redo our unmark()
    // call from the beginning of this function
    debounce(mark, 200)();
  }
}
