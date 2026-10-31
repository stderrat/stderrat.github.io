// Extracted from layouts/partials/footer.html so the page works with a CSP without 'unsafe-inline'.
// Runs after deferred scripts above (DOMContentLoaded waits for defer)
document.addEventListener('DOMContentLoaded', function () {
  if (typeof hljs === 'undefined') return;
  hljs.configure({ ignoreUnescapedHTML: true });
  if (typeof mergeHTMLPlugin !== 'undefined') hljs.addPlugin(mergeHTMLPlugin);
  if (typeof yaubLineNumbersPlugin !== 'undefined') hljs.addPlugin(yaubLineNumbersPlugin);
  hljs.highlightAll();
});
