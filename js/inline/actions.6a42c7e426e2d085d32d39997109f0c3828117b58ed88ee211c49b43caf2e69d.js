// Click and change handlers that used to be inline attributes (onclick=..., onchange=...).
// Inline event handlers are blocked by a CSP without 'unsafe-inline', so the templates now carry
// data-action / data-action-change attributes and this file handles them with event delegation.
(function () {
  'use strict';

  var actions = {
    'scroll-top': function () {
      if (typeof scrollTopAnimated === 'function') scrollTopAnimated();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    'search-open': function () {
      if (window.SearchModal) window.SearchModal.open();
    },
    'shortcuts-open': function () {
      if (window.ShortcutsModal) window.ShortcutsModal.open();
    },
    'print': function () {
      window.print();
    },
    // tabs shortcode: the button carries data-tab-group and data-tab-item
    'switch-tab': function (el) {
      if (typeof switchTab === 'function') switchTab(el.getAttribute('data-tab-group'), el.getAttribute('data-tab-item'));
    },
    // expand shortcode: same behaviour as the former inline jQuery snippet
    'expand-toggle': function (el) {
      if (typeof jQuery === 'undefined') return;
      var $h = jQuery(el);
      $h.next('div').slideToggle(100, function () {
        $h.children('i').attr('class', $h.next('div').is(':visible') ? 'fas fa-chevron-down' : 'fas fa-chevron-right');
      });
    }
  };

  document.addEventListener('click', function (event) {
    var el = event.target.closest('[data-action]');
    if (!el) return;
    var fn = actions[el.getAttribute('data-action')];
    if (fn) fn(el, event);
  });

  document.addEventListener('change', function (event) {
    var el = event.target.closest('[data-action-change="navigate"]');
    if (el && el.value) window.location = el.value;
  });
})();
