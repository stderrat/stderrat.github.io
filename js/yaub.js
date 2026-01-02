/**
 * ============================================================================
 * YAUB Theme JavaScript
 * Yet Another Useless Blog - Main JavaScript file
 * ============================================================================
 * 
 * This file contains all custom JavaScript for the YAUB Hugo theme.
 * 
 * TABLE OF CONTENTS:
 * ------------------
 * 1. CONFIGURATION & GLOBALS
 * 2. UTILITY FUNCTIONS
 * 3. TOC SCROLL SPY
 * 4. BACK TO TOP BUTTON
 * 5. TOAST NOTIFICATIONS
 * 6. IMAGE HANDLING (Featherlight & URL Parameters)
 * 7. HEADING ANCHORS & CLIPBOARD
 * 8. KEYBOARD NAVIGATION
 * 9. EXTERNAL LINK ICONS
 * 10. SIDEBAR & MENU
 * 11. MERMAID DIAGRAMS
 * 
 * ============================================================================
 */

/* ============================================================================
   1. CONFIGURATION & GLOBALS
   ============================================================================
   Global variables and configuration settings used throughout the theme.
*/

var theme = true;
var isPrint = document.querySelector('body').classList.contains('print');
var isPrintPreview = false;

// RTL (Right-to-Left) language support
var isRtl = document.querySelector('html').getAttribute('dir') == 'rtl';
var lang = document.querySelector('html').getAttribute('lang');

// Direction-aware settings for RTL support
var dir_padding_start = 'padding-left';
var dir_padding_end = 'padding-right';
var dir_key_start = 37;  // Left arrow key
var dir_key_end = 39;    // Right arrow key
var dir_scroll = 1;

if (isRtl) {
  dir_padding_start = 'padding-right';
  dir_padding_end = 'padding-left';
  dir_key_start = 39;
  dir_key_end = 37;
  dir_scroll = -1;
}

/* ============================================================================
   2. UTILITY FUNCTIONS
   ============================================================================
   Helper functions used by other parts of the code.
*/

/**
 * Parse URL query parameters into an object
 * Used primarily for image URL parameters (width, height, classes, featherlight)
 * 
 * @param {string} sPageURL - The URL to parse
 * @returns {Object} - Object containing key-value pairs of parameters
 * 
 * @example
 * // URL: image.jpg?width=500&height=300
 * getUrlParameter('image.jpg?width=500&height=300')
 * // Returns: { width: '500', height: '300' }
 */
var getUrlParameter = function getUrlParameter(sPageURL) {
  var url = sPageURL.split('?');
  var obj = {};
  if (url.length == 2) {
    var sURLVariables = url[1].split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      obj[sParameterName[0]] = sParameterName[1];
    }
  }
  return obj;
};

/**
 * Smooth scroll to top of page
 * Called by the back-to-top button
 */
function scrollTopAnimated() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ============================================================================
   3. TOC SCROLL SPY
   ============================================================================
   Tracks the currently visible section and highlights it in the Table of Contents.
   Uses IntersectionObserver for efficient scroll tracking.
*/

(function() {
  'use strict';

  /**
   * Initialize TOC scroll spy functionality
   * - Highlights current section in TOC as user scrolls
   * - Provides smooth scrolling when clicking TOC links
   * - Respects URL hash on page load
   */
  function initTocScrollSpy() {
    const toc = document.getElementById('TableOfContents');
    if (!toc) return;

    const tocLinks = toc.querySelectorAll('a');
    if (tocLinks.length === 0) return;

    // Get all headings that are linked in the TOC
    const headingIds = Array.from(tocLinks).map(link => {
      const href = link.getAttribute('href');
      return href ? href.substring(1) : null;
    }).filter(id => id);

    const headings = headingIds.map(id => document.getElementById(id)).filter(el => el);
    
    if (headings.length === 0) return;

    // Track active heading
    let activeId = null;
    let updateTimeout = null;
    
    /**
     * Update active TOC item with optional debouncing
     * @param {string} id - The heading ID to activate
     * @param {boolean} immediate - Skip debounce delay if true
     */
    function setActiveTocItem(id, immediate) {
      if (activeId === id) return;
      
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      
      const delay = immediate ? 0 : 100;
      
      updateTimeout = setTimeout(function() {
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
      }, delay);
    }

    // Use IntersectionObserver for efficient scroll tracking
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
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

    // Fallback scroll tracking for edge cases
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        let closestHeading = null;
        let closestDistance = Infinity;

        headings.forEach(heading => {
          const rect = heading.getBoundingClientRect();
          const distance = Math.abs(rect.top - 100);
          
          if (rect.top <= 150 && distance < closestDistance) {
            closestDistance = distance;
            closestHeading = heading;
          }
        });

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
            setActiveTocItem(href.substring(1), true);
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            history.pushState(null, null, href);
          }
        }
      });
    });

    // Set initial active item based on URL hash or first heading
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      if (headingIds.includes(hashId)) {
        setActiveTocItem(hashId, true);
      }
    } else if (headings.length > 0) {
      setActiveTocItem(headings[0].id, true);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTocScrollSpy);
  } else {
    initTocScrollSpy();
  }
})();

// Add highlight class to TOC links for hover animation
$('#toc-field a:not(:has(img)):not(.btn):not(.nav-prev):not(.nav-next):not(.no-highlight)').addClass('highlight');

/* ============================================================================
   4. BACK TO TOP BUTTON
   ============================================================================
   Floating button with scroll progress indicator that appears after scrolling
   down the page. Shows reading progress as a circular ring around the button.
*/

(function($) {
  $(document).ready(function() {
    var topBtn = document.getElementById('myBtn');
    
    // Create SVG progress ring around button
    if (topBtn && !topBtn.querySelector('.top-btn-progress')) {
      var progressRing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      progressRing.setAttribute('class', 'top-btn-progress');
      progressRing.setAttribute('viewBox', '0 0 36 36');
      
      var bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bgCircle.setAttribute('class', 'top-btn-progress-bg');
      bgCircle.setAttribute('cx', '18');
      bgCircle.setAttribute('cy', '18');
      bgCircle.setAttribute('r', '16');
      
      var progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      progressCircle.setAttribute('class', 'top-btn-progress-bar');
      progressCircle.setAttribute('cx', '18');
      progressCircle.setAttribute('cy', '18');
      progressCircle.setAttribute('r', '16');
      
      progressRing.appendChild(bgCircle);
      progressRing.appendChild(progressCircle);
      topBtn.appendChild(progressRing);
    }
    
    // Update progress and visibility on scroll
    $(window).scroll(function() {
      var scrollTop = $(this).scrollTop();
      var docHeight = $(document).height() - $(window).height();
      var scrollPercent = (scrollTop / docHeight) * 100;
      
      // Toggle visibility after 100px threshold
      if (scrollTop > 100) {
        $(".top-btn").addClass('sticky');
      } else {
        $(".top-btn").removeClass('sticky');
      }
      
      // Update progress ring stroke
      var progressBar = document.querySelector('.top-btn-progress-bar');
      if (progressBar) {
        var circumference = 2 * Math.PI * 16; // r=16
        var offset = circumference - (scrollPercent / 100) * circumference;
        progressBar.style.strokeDashoffset = offset;
      }
    });
  });
})(jQuery);

/* ============================================================================
   5. TOAST NOTIFICATIONS
   ============================================================================
   Non-intrusive toast notifications for copy actions and other feedback.
   Appears briefly at the bottom of the screen and auto-dismisses.
*/

(function() {
  'use strict';
  
  var toastContainer = null;
  
  /**
   * Get or create the toast container element
   * @returns {HTMLElement} The toast container
   */
  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'copy-toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }
  
  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - The type of toast ('success' by default)
   */
  window.showCopyToast = function(message, type) {
    message = message || 'Copied to clipboard!';
    type = type || 'success';
    
    var container = getToastContainer();
    var toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = '<span class="copy-toast-icon"><i class="fas fa-check"></i></span>' +
                      '<span>' + message + '</span>';
    
    container.appendChild(toast);
    
    // Auto-remove after 2.5 seconds with fade-out animation
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

/* ============================================================================
   6. IMAGE HANDLING (Featherlight & URL Parameters)
   ============================================================================
   - Wraps images in lightbox links for full-size viewing
   - Applies custom styles from URL parameters (width, height, classes)
   
   Usage in Markdown/AsciiDoc:
   ![Image](photo.jpg?width=400px&height=300px&classes=shadow,rounded)
   
   To disable lightbox for an image:
   ![Image](photo.jpg?featherlight=false)
*/

/* ============================================================================
   7. HEADING ANCHORS & CLIPBOARD
   ============================================================================
   - Adds link icons to headings for easy sharing
   - Provides copy-to-clipboard functionality for heading URLs
*/

/* ============================================================================
   8. KEYBOARD NAVIGATION
   ============================================================================
   Enables keyboard shortcuts for navigating between articles:
   - Left Arrow (←): Go to previous article
   - Right Arrow (→): Go to next article
   
   Arrow keys are disabled in input/textarea fields to allow normal editing.
*/

/**
 * Initialize keyboard navigation for prev/next article links
 * Uses the .nav-prev and .nav-next elements from the page
 */
function initKeyboardNavigation() {
  // Make nav links clickable
  jQuery('.nav-prev').click(function() {
    location.href = jQuery(this).attr('href');
  });
  jQuery('.nav-next').click(function() {
    location.href = jQuery(this).attr('href');
  });

  // Prevent arrow keys from triggering navigation in input fields
  jQuery('input, textarea').keydown(function(e) {
    if (e.which == '37' || e.which == '39') {
      e.stopPropagation();
    }
  });

  // Global keyboard navigation
  jQuery(document).keydown(function(e) {
    // Skip if user is typing in an input field
    var activeElement = document.activeElement;
    var isInputField = activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );
    
    if (isInputField) return;

    // Left arrow key - previous article
    if (e.which == '37') {
      jQuery('.nav.nav-prev').click();
    }

    // Right arrow key - next article
    if (e.which == '39') {
      jQuery('.nav.nav-next').click();
    }
  });
}

/* ============================================================================
   9. EXTERNAL LINK ICONS
   ============================================================================
   Adds visual indicator (arrow icon) to external links so users know
   the link will take them to another website.
   
   Excludes:
   - Links with images
   - Button links
   - Footnote links
   - Links to stderr.at (same site)
   - Links to localhost (development)
*/

/**
 * Add external link icons to links pointing outside the blog
 */
function addExternalLinkIcons() {
  $('#body-inner a[href^="http"]:not(:has(img)):not(.btn):not(a[rel="footnote"]):not(.no-highlight):not([href*="stderr.at"]):not([href*="localhost"])').each(function() {
    if (!$(this).find('.external-link-icon').length) {
      $(this).append('<i class="fas fa-arrow-up-right-from-square external-link-icon" aria-hidden="true"></i>');
      if (!$(this).attr('title')) {
        $(this).attr('title', 'Opens external site');
      }
    }
  });
}

/**
 * Add highlight class to links for hover animation effect
 */
function addLinkHighlights() {
  $('#top-bar a:not(:has(img)):not(.btn):not(.no-highlight)').addClass('highlight');
  $('#body-inner a:not(:has(img)):not(.btn):not(a[rel="footnote"]):not(.no-highlight)').addClass('highlight');
}

/* ============================================================================
   10. SIDEBAR & MENU
   ============================================================================
   - Sidebar collapse/expand toggle with localStorage persistence
   - Menu expand/collapse for nested navigation items
   - Chevron click handlers for submenu toggling
*/

/* ============================================================================
   11. MERMAID DIAGRAMS
   ============================================================================
   Initializes and renders Mermaid diagrams with:
   - Theme support (including print themes)
   - Zoom/pan functionality with D3.js
   - YAML frontmatter parsing for diagram configuration
*/

/**
 * Initialize Mermaid diagram rendering
 * @param {boolean} update - True if updating existing diagrams (e.g., on theme change)
 * @param {Object} attrs - Configuration attributes (theme, etc.)
 */
function initMermaid(update, attrs) {
  if (!window.relearn || !window.relearn.themeUseMermaid) {
    return;
  }
  
  var doBeside = true;
  var isImageRtl = isRtl;

  // HTML encoding/decoding helpers
  var decodeHTML = function(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  
  var encodeHTML = function(text) {
    var html = document.createElement('textarea');
    html.textContent = text;
    return html.innerHTML;
  };

  /**
   * Parse Mermaid graph with YAML frontmatter and init directives
   * @param {string} graph - The raw graph content
   * @returns {Object} Parsed graph with yaml, dir, and content properties
   */
  var parseGraph = function(graph) {
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
    return { yaml: yaml, dir: dir, content: content.trim() };
  };

  /**
   * Serialize graph back to string with frontmatter
   */
  var serializeGraph = function(graph) {
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

  /**
   * Initialize Mermaid elements on first load
   */
  var init_func = function(attrs) {
    var is_initialized = false;
    var theme = attrs.theme;
    
    document.querySelectorAll('.mermaid').forEach(function(element) {
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
      
      Array.from(element.attributes).forEach(function(attr) {
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

  /**
   * Update existing Mermaid elements (e.g., on theme change)
   */
  var update_func = function(attrs) {
    var is_initialized = false;
    var theme = attrs.theme;
    
    document.querySelectorAll('.mermaid-container').forEach(function(e) {
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

  // Setup print event listeners on first init
  if (!state.is_initialized) {
    state.is_initialized = true;
    window.addEventListener('beforeprint', function() {
      isPrintPreview = true;
      initMermaid(true, {
        theme: getColorValue('PRINT-MERMAID-theme'),
      });
    }.bind(this));
    
    window.addEventListener('afterprint', function() {
      isPrintPreview = false;
      initMermaid(true);
    }.bind(this));
  }

  attrs = attrs || {
    theme: getColorValue('MERMAID-theme'),
  };

  if (update) {
    unmark();
  }

  var is_initialized = update ? update_func(attrs) : init_func(attrs);
  
  if (is_initialized) {
    mermaid.initialize(Object.assign(
      { securityLevel: 'antiscript', startOnLoad: false },
      window.relearn.mermaidConfig,
      { theme: attrs.theme }
    ));
    
    mermaid.run({
      postRenderCallback: function(id) {
        // Add zoom/pan functionality with D3.js
        var svgs = d3.selectAll('body:not(.print) .mermaid-container.zoomable > .mermaid > #' + id);
        svgs.each(function() {
          var parent = this.parentElement;
          parent.style.maxWidth = this.style.maxWidth || this.getAttribute('width');
          parent.style.maxWidth = parent.style.maxWidth || 'calc( ' + this.getAttribute('width') + 'px + 1rem )';
          
          var svg = d3.select(this);
          svg.html('<g>' + svg.html() + '</g>');
          var inner = svg.select('*:scope > g');
          
          // Add reset button
          parent.insertAdjacentHTML('beforeend', '<div class="actionbar"><span class="btn cstyle svg-reset-button action noborder notitle interactive"><button type="button" title="' + window.T_Reset_view + '"><i class="fa-fw fas fa-undo-alt"></i></button></span></div>');
          
          var wrapper = parent.querySelector('.svg-reset-button');
          var button = wrapper.querySelector('button');
          
          var zoom = d3.zoom().on('zoom', function(e) {
            inner.attr('transform', e.transform);
            if (e.transform.k == 1 && e.transform.x == 0 && e.transform.y == 0) {
              wrapper.classList.remove('zoomed');
            } else {
              wrapper.classList.add('zoomed');
            }
          });
          
          button.addEventListener('click', function() {
            this.blur();
            svg.transition().duration(350).call(zoom.transform, d3.zoomIdentity);
            showToast(window.T_View_reset);
          });
          
          svg.call(zoom);
        });
        
        // Re-mark search terms after SVG rendering
        debounce(mark, 200)();
      },
      querySelector: '.mermaid.mermaid-render',
      suppressErrors: true,
    });
  }
  
  if (update) {
    debounce(mark, 200)();
  }
}

/* ============================================================================
   DOCUMENT READY - MAIN INITIALIZATION
   ============================================================================
   Initialize all features when the DOM is ready.
*/

jQuery(document).ready(function() {
  
  // ------------------------------------------------------------------------
  // Sticky Top Navigation
  // Makes the top nav bar fixed when scrolled past its position
  // Preserves original width to prevent layout shifts
  // ------------------------------------------------------------------------
  (function() {
    var topNav = document.getElementById('top-nav');
    if (!topNav) return;
    
    // Create placeholder to prevent content jump
    var placeholder = document.createElement('div');
    placeholder.id = 'top-nav-placeholder';
    topNav.parentNode.insertBefore(placeholder, topNav);
    
    var navTop = topNav.offsetTop;
    var navHeight = topNav.offsetHeight;
    var navWidth = topNav.offsetWidth;
    var navLeft = topNav.getBoundingClientRect().left;
    
    function handleScroll() {
      if (window.scrollY >= navTop) {
        if (!topNav.classList.contains('is-sticky')) {
          // Capture current dimensions before going sticky
          navWidth = topNav.offsetWidth;
          navLeft = topNav.getBoundingClientRect().left;
          
          topNav.classList.add('is-sticky');
          topNav.style.width = navWidth + 'px';
          topNav.style.left = navLeft + 'px';
          topNav.style.right = 'auto';
          
          placeholder.style.height = navHeight + 'px';
          placeholder.classList.add('active');
        }
      } else {
        if (topNav.classList.contains('is-sticky')) {
          topNav.classList.remove('is-sticky');
          topNav.style.width = '';
          topNav.style.left = '';
          topNav.style.right = '';
          placeholder.classList.remove('active');
        }
      }
    }
    
    // Recalculate position and dimensions on resize
    function handleResize() {
      var wasSticky = topNav.classList.contains('is-sticky');
      
      // Temporarily remove sticky to get accurate measurements
      if (wasSticky) {
        topNav.classList.remove('is-sticky');
        topNav.style.width = '';
        topNav.style.left = '';
        topNav.style.right = '';
      }
      
      navTop = topNav.offsetTop;
      navHeight = topNav.offsetHeight;
      navWidth = topNav.offsetWidth;
      navLeft = topNav.getBoundingClientRect().left;
      
      // Re-apply sticky if it was active
      if (wasSticky && window.scrollY >= navTop) {
        topNav.classList.add('is-sticky');
        topNav.style.width = navWidth + 'px';
        topNav.style.left = navLeft + 'px';
        topNav.style.right = 'auto';
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial check
    handleScroll();
  })();

  // ------------------------------------------------------------------------
  // Image Featherlight & URL Parameter Styling
  // ------------------------------------------------------------------------
  var images = $("div#body-inner img").not(".inline");
  
  // Wrap images in featherlight lightbox links
  images.wrap(function() {
    var image = $(this);
    var o = getUrlParameter(image[0].src);
    var f = o['featherlight'];
    
    if (f != 'false') {
      if (!image.parent("a").length) {
        return "<a href='" + image[0].src + "' data-featherlight='image'></a>";
      }
    }
  });

  // Apply custom styles from URL parameters
  images.each(function(index) {
    var image = $(this);
    var o = getUrlParameter(image[0].src);
    
    if (typeof o !== "undefined") {
      var h = o["height"];
      var w = o["width"];
      var c = o["classes"];
      
      image.css("width", typeof w !== "undefined" ? w : "auto");
      image.css("height", typeof h !== "undefined" ? h : "auto");
      
      if (typeof c !== "undefined") {
        var classes = c.split(',');
        for (var i = 0; i < classes.length; i++) {
          image.addClass(classes[i]);
        }
      }
    }
  });

  // ------------------------------------------------------------------------
  // Heading Anchors & Clipboard
  // ------------------------------------------------------------------------
  var text, clip = new ClipboardJS('.anchor');
  
  $("h2,h3,h4,h5,h6,archive").append(function(index, html) {
    var element = $(this);
    var url = encodeURI(document.location.origin + document.location.pathname);
    var link = url + "#" + element[0].id;
    
    // Get heading text (without anchor icon)
    var headingText = element.clone().children('.anchor').remove().end().text().trim();
    if (headingText.length > 40) {
      headingText = headingText.substring(0, 40) + '...';
    }

    // Skip certain heading types
    if (!(element[0].classList.contains('recentlist')) && 
        !(element[0].classList.contains('shortcut-title'))) {
      return " <span class='anchor' data-clipboard-text='" + link + "' data-section-title='" + headingText.replace(/'/g, "&#39;") + "' title='Copy link to section'>" +
        "<i class='fas fa-link fa-lg'></i>" +
        "</span>";
    }
  });

  $(".anchor").on('mouseleave', function(e) {
    $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
  });

  clip.on('success', function(e) {
    e.clearSelection();
    $(e.trigger).attr('aria-label', 'Link copied!').addClass('tooltipped tooltipped-s');
    
    if (window.showCopyToast) {
      var sectionTitle = $(e.trigger).data('section-title');
      if (sectionTitle) {
        window.showCopyToast('Copied link to "' + sectionTitle + '"');
      } else {
        window.showCopyToast('Link copied to clipboard!');
      }
    }
  });

  // ------------------------------------------------------------------------
  // Keyboard Navigation & External Links
  // ------------------------------------------------------------------------
  initKeyboardNavigation();
  addLinkHighlights();
  addExternalLinkIcons();

  // ------------------------------------------------------------------------
  // Mermaid Diagram Processing
  // ------------------------------------------------------------------------
  $('code.language-mermaid').each(function(index, element) {
    var content = $(element).text();
    var preElement = $('<pre class="mermaid actionbar-wrapper zoomable" align="center"></pre>').text(content);
    $(element).parent().replaceWith(preElement);
  });
  
  if (typeof initMermaid === 'function' && window.relearn && window.relearn.themeUseMermaid) {
    setTimeout(function() {
      try {
        initMermaid(false, { theme: 'default' });
      } catch (e) {
        console.error('Mermaid initialization error:', e);
      }
    }, 100);
  }

  // ------------------------------------------------------------------------
  // Sidebar Toggle
  // ------------------------------------------------------------------------
  $('.sidebar-toggle-btn').on('click', function() {
    var sidebar = $('#sidebar');
    var body = $('#body');
    
    if (sidebar.hasClass('collapsed')) {
      sidebar.removeClass('collapsed');
      body.removeClass('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', 'false');
    } else {
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

  // ------------------------------------------------------------------------
  // Menu Expand/Collapse
  // ------------------------------------------------------------------------
  // Auto-expand menus for current page ancestors
  $('#sidebar ul.topics li.dd-item.parent, #sidebar ul.topics li.dd-item.active').addClass('menu-expanded');
  
  // Cleanup old inline styles
  $('#sidebar ul.topics ul').removeAttr('style');

  // Chevron click handler for submenu toggle
  $('#sidebar ul.topics').on('click', '.menu-chevron', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('li.dd-item').toggleClass('menu-expanded');
  });

  // Menu link click handler
  $('#sidebar ul.topics').on('click', 'a.has-children', function(e) {
    var $li = $(this).closest('li.dd-item');
    
    // If active page and collapsed, expand instead of navigating
    if ($li.hasClass('active') && !$li.hasClass('menu-expanded')) {
      e.preventDefault();
      $li.addClass('menu-expanded');
      return false;
    }
    
    // Expand collapsed menus on click
    if (!$li.hasClass('menu-expanded')) {
      $li.addClass('menu-expanded');
    }
  });
});
