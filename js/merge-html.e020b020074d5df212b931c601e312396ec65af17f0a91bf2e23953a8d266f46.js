/**
 * Restore HTML inside highlighted code blocks (AsciiDoc callouts / conums).
 *
 * Highlight.js 11 removed the built-in HTML merge that 10.x used
 * (nodeStream / mergeStreams). Asciidoctor emits
 *   <i class="conum" data-value="N"></i><b>(N)</b>
 * inside <code> before highlighting. Without this plugin, v11 highlights
 * textContent only and those tags disappear, leaving "(N)" as plain text.
 *
 * Source: highlight.js 10.x merge_html plugin, adapted for v11
 * (capture original DOM in before:highlightElement; write back afterwards).
 * https://github.com/highlightjs/highlight.js/issues/2889
 */
var mergeHTMLPlugin = (function () {
    'use strict';

    var originalStreams = new WeakMap();

    function escapeHTML(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    function tag(node) {
        return node.nodeName.toLowerCase();
    }

    function nodeStream(node) {
        var result = [];
        (function walk(current, offset) {
            for (var child = current.firstChild; child; child = child.nextSibling) {
                if (child.nodeType === 3) {
                    offset += child.nodeValue.length;
                } else if (child.nodeType === 1) {
                    result.push({ event: 'start', offset: offset, node: child });
                    offset = walk(child, offset);
                    if (!tag(child).match(/br|hr|img|input/)) {
                        result.push({ event: 'stop', offset: offset, node: child });
                    }
                }
            }
            return offset;
        })(node, 0);
        return result;
    }

    function mergeStreams(original, highlighted, value) {
        var processed = 0;
        var result = '';
        var nodeStack = [];

        function selectStream() {
            if (!original.length || !highlighted.length) {
                return original.length ? original : highlighted;
            }
            if (original[0].offset !== highlighted[0].offset) {
                return (original[0].offset < highlighted[0].offset) ? original : highlighted;
            }
            return highlighted[0].event === 'start' ? original : highlighted;
        }

        function open(node) {
            function attributeString(attr) {
                return ' ' + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
            }
            result += '<' + tag(node) + [].map.call(node.attributes, attributeString).join('') + '>';
        }

        function close(node) {
            result += '</' + tag(node) + '>';
        }

        function render(event) {
            (event.event === 'start' ? open : close)(event.node);
        }

        while (original.length || highlighted.length) {
            var stream = selectStream();
            result += escapeHTML(value.substring(processed, stream[0].offset));
            processed = stream[0].offset;
            if (stream === original) {
                nodeStack.reverse().forEach(close);
                do {
                    render(stream.splice(0, 1)[0]);
                    stream = selectStream();
                } while (stream === original && stream.length && stream[0].offset === processed);
                nodeStack.reverse().forEach(open);
            } else {
                if (stream[0].event === 'start') {
                    nodeStack.push(stream[0].node);
                } else {
                    nodeStack.pop();
                }
                render(stream.splice(0, 1)[0]);
            }
        }
        return result + escapeHTML(value.substr(processed));
    }

    return {
        'before:highlightElement': function (ctx) {
            originalStreams.set(ctx.el, nodeStream(ctx.el));
        },
        'after:highlightElement': function (ctx) {
            var originalStream = originalStreams.get(ctx.el) || [];
            if (!originalStream.length) {
                return;
            }
            var resultNode = document.createElement('div');
            resultNode.innerHTML = ctx.result.value;
            ctx.result.value = mergeStreams(originalStream, nodeStream(resultNode), ctx.text);
            ctx.el.innerHTML = ctx.result.value;
        }
    };
})();
