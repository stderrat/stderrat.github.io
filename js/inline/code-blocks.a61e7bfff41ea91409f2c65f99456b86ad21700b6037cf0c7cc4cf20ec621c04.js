// Extracted from layouts/partials/custom-footer.html so the page works with a CSP without 'unsafe-inline'.
(function() {
    var knownLanguages = ['yaml', 'yml', 'bash', 'shell', 'sh', 'javascript', 'js', 'typescript', 'ts',
        'python', 'py', 'go', 'golang', 'json', 'html', 'css', 'dockerfile', 'docker', 'ruby', 'rb',
        'java', 'sql', 'xml', 'markdown', 'md', 'rust', 'rs', 'terraform', 'tf', 'hcl', 'ansible', 'helm',
        'c', 'cpp', 'csharp', 'php', 'perl', 'lua', 'r', 'scala', 'kotlin', 'swift', 'groovy', 'powershell',
        'ini', 'toml', 'nginx', 'apache', 'diff', 'plaintext', 'text', 'console', 'log'];

    function detectLanguage(codeBlock) {
        if (!codeBlock) return null;
        var classes = codeBlock.className.split(' ');
        var i, cls;
        for (i = 0; i < classes.length; i++) {
            cls = classes[i];
            if (cls.indexOf('language-') === 0) {
                return cls.slice('language-'.length);
            }
            if (knownLanguages.indexOf(cls.toLowerCase()) !== -1) {
                return cls;
            }
        }
        return codeBlock.getAttribute('data-lang') || null;
    }

    function listingTitleEl(listingblock) {
        if (!listingblock) return null;
        var kids = listingblock.children;
        var i;
        for (i = 0; i < kids.length; i++) {
            if (kids[i].classList && kids[i].classList.contains('title')) {
                return kids[i];
            }
        }
        return null;
    }

    function wrapPre(pre, language, skipLangBadge) {
        if (!pre || pre.tagName !== 'PRE') return;
        if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) return;
        if (pre.querySelector('code.language-mermaid, code.mermaid')) return;

        var listingblock = pre.closest ? pre.closest('.listingblock') : null;
        var titleEl = listingTitleEl(listingblock);
        var titleText = titleEl ? String(titleEl.textContent || '').replace(/^\s+|\s+$/g, '').replace(/:+$/, '') : '';
        var showLang = !!(language && String(language).toLowerCase() !== 'mermaid' && !skipLangBadge);
        var showTitle = !!titleText;
        if (!showLang && !showTitle) return;

        var wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        var tabbar = document.createElement('div');
        tabbar.className = 'code-block-tabbar';

        if (showTitle) {
            wrapper.className += ' has-title';
            var titleBadge = document.createElement('span');
            titleBadge.className = 'code-title-badge';
            titleBadge.textContent = titleText;
            tabbar.appendChild(titleBadge);
            if (titleEl && titleEl.parentNode) {
                titleEl.parentNode.removeChild(titleEl);
            }
        }

        if (showLang) {
            wrapper.className += ' has-language';
            var badge = document.createElement('span');
            badge.className = 'code-language-badge';
            badge.textContent = String(language).toUpperCase();
            tabbar.appendChild(badge);
        }

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(tabbar);
        wrapper.appendChild(pre);
    }

    document.querySelectorAll('pre code[class*="language-"], pre code[class*="hljs"]').forEach(function(codeBlock) {
        var language = detectLanguage(codeBlock);
        if (language && String(language).toLowerCase() === 'mermaid') return;
        var pre = codeBlock.parentElement;
        var listingblock = pre && pre.closest ? pre.closest('.listingblock') : null;
        // AsciiDoc: [source,lang,role=nolangbadge] → div.listingblock.nolangbadge (same idea as role=nocopy)
        var skipLangBadge = !!(listingblock && listingblock.classList.contains('nolangbadge'));
        wrapPre(pre, language, skipLangBadge);
    });

    document.querySelectorAll('.listingblock').forEach(function(listingblock) {
        var titleEl = listingTitleEl(listingblock);
        if (!titleEl) return;
        var pre = listingblock.querySelector('pre');
        if (!pre) return;
        var skipLangBadge = listingblock.classList.contains('nolangbadge');
        wrapPre(pre, detectLanguage(pre.querySelector('code')), skipLangBadge);
    });

    /* Keyboard: overflowed code blocks must be focusable to scroll (axe scrollable-region-focusable).
       Run after hljs (DOMContentLoaded) so highlight wrappers do not drop attributes. */
    function makeCodeBlocksFocusable() {
        document.querySelectorAll('#body-inner pre, .highlightable pre, article pre, .listingblock pre').forEach(function(pre) {
            if (pre.querySelector('code.language-mermaid, code.mermaid')) return;
            if (pre.closest && pre.closest('.mermaid, .mermaid-container')) return;
            pre.setAttribute('tabindex', '0');
            if (!pre.getAttribute('role')) {
                pre.setAttribute('role', 'region');
            }
            if (!pre.getAttribute('aria-label')) {
                var lang = detectLanguage(pre.querySelector('code'));
                pre.setAttribute('aria-label', lang ? ('Code block: ' + lang) : 'Code block');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', makeCodeBlocksFocusable);
    } else {
        makeCodeBlocksFocusable();
    }
    // hljs.highlightAll also binds DOMContentLoaded; run once more after it
    window.addEventListener('load', makeCodeBlocksFocusable);
})();
