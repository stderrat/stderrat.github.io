/**
 * yaub-linenums.js – opt-in line numbers for code blocks
 *
 * Usage in AsciiDoc (only blocks with the role get numbers):
 *
 *   [source,yaml,role=linenums]        or   [source.linenums,yaml]
 *   [source,yaml,role="linenums linenums-start-20"]   start counting at 20
 *
 * Asciidoctor puts the role as a CSS class on <div class="listingblock">.
 * (The native AsciiDoc option "linenums" is dropped by Asciidoctor when
 * highlight.js is the source highlighter, hence the role.)
 *
 * How it works: after highlight.js (and mergeHTMLPlugin) have finished,
 * every line of the <code> element is wrapped in <span class="yaub-line">.
 * The newline characters stay as text nodes BETWEEN the spans, so
 * code.textContent – and therefore what the copy button copies – is
 * byte-for-byte identical to before. The numbers themselves are CSS
 * ::before content (see yaub-additions.css), which is neither part of
 * textContent nor of a mouse selection.
 *
 * Highlight.js spans that cross a line break (multi-line strings or
 * comments) are split and re-opened on the next line, so colouring is kept.
 */
var yaubLineNumbersPlugin = (function () {
    'use strict';

    var BLOCK_SELECTOR = '.linenums';
    var START_RE = /(?:^|\s)linenums-start-(\d+)(?:\s|$)/;

    function wantsNumbers(code) {
        return code.closest && code.closest(BLOCK_SELECTOR) !== null;
    }

    function wrapLines(code) {
        if (code.dataset.yaubLinenums === 'done') {
            return;
        }

        var lines = [];
        var origStack = [];   // original ancestor elements (inside <code>)
        var cloneStack = [];  // their shallow clones in the current line
        var line;
        var leaf;             // element that receives the next node

        function newLine() {
            line = document.createElement('span');
            line.className = 'yaub-line';
            lines.push(line);
            leaf = line;
            cloneStack = [];
            for (var i = 0; i < origStack.length; i++) {
                var c = origStack[i].cloneNode(false);
                leaf.appendChild(c);
                cloneStack.push(c);
                leaf = c;
            }
        }

        function walk(parent) {
            for (var node = parent.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === 3) {
                    var parts = node.nodeValue.split('\n');
                    for (var p = 0; p < parts.length; p++) {
                        if (p > 0) {
                            newLine();
                        }
                        if (parts[p] !== '') {
                            leaf.appendChild(document.createTextNode(parts[p]));
                        }
                    }
                } else if (node.nodeType === 1) {
                    var clone = node.cloneNode(false);
                    leaf.appendChild(clone);
                    origStack.push(node);
                    cloneStack.push(clone);
                    leaf = clone;
                    walk(node);
                    origStack.pop();
                    cloneStack.pop();
                    leaf = cloneStack.length ? cloneStack[cloneStack.length - 1] : line;
                }
            }
        }

        newLine();
        walk(code);

        // A trailing newline produces an empty last line – drop it, but keep
        // the newline itself so textContent does not change.
        var trailingNewline = false;
        if (lines.length > 1 && lines[lines.length - 1].textContent === '') {
            lines.pop();
            trailingNewline = true;
        }

        var fragment = document.createDocumentFragment();
        for (var i = 0; i < lines.length; i++) {
            if (i > 0) {
                fragment.appendChild(document.createTextNode('\n'));
            }
            fragment.appendChild(lines[i]);
        }
        if (trailingNewline) {
            fragment.appendChild(document.createTextNode('\n'));
        }

        code.textContent = '';
        code.appendChild(fragment);
        code.classList.add('yaub-linenums');
        code.dataset.yaubLinenums = 'done';

        // Optional start number: role "linenums-start-<n>"
        var block = code.closest(BLOCK_SELECTOR);
        var m = block && START_RE.exec(block.className);
        if (m) {
            code.style.counterReset = 'yaub-line ' + (parseInt(m[1], 10) - 1);
        }
        // Width of the gutter in characters, so 9 and 10 align
        var last = (m ? parseInt(m[1], 10) - 1 : 0) + lines.length;
        code.style.setProperty('--yaub-ln-width', String(last).length + 'ch');
    }

    // Fallback for blocks highlight.js skipped (e.g. no-highlight)
    function processAll() {
        var codes = document.querySelectorAll(BLOCK_SELECTOR + ' pre > code');
        for (var i = 0; i < codes.length; i++) {
            wrapLines(codes[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAll);
    } else {
        processAll();
    }

    return {
        // Must be registered AFTER mergeHTMLPlugin, so callouts are restored
        // before the lines are wrapped.
        'after:highlightElement': function (ctx) {
            if (wantsNumbers(ctx.el)) {
                wrapLines(ctx.el);
            }
        },
        wrapLines: wrapLines
    };
})();
