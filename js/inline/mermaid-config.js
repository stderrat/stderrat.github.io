// Extracted from layouts/partials/footer.html so the page works with a CSP without 'unsafe-inline'.
window.relearn = window.relearn || {};
window.relearn.themeUseMermaid = true;
window.relearn.mermaidConfig = { securityLevel: 'antiscript' };
window.T_Reset_view = 'Reset view';
window.T_View_reset = 'View reset';
window.showToast = window.showToast || function(msg) {
    console.log('Toast:', msg);
};
document.addEventListener('DOMContentLoaded', function () {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'antiscript',
            theme: 'default'
        });
    }
});
