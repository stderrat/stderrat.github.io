// Giscus comments, loaded only after consent (extracted from layouts/partials/custom-comments.html).
// The Giscus settings are rendered by Hugo as data-* attributes on #giscus-container.
(function () {
    const consentBox = document.getElementById('comments-consent');
    const giscusContainer = document.getElementById('giscus-container');
    const loadBtn = document.getElementById('load-comments-btn');
    const rememberCheckbox = document.getElementById('remember-consent');
    const storageKey = 'giscus-consent';
    if (!giscusContainer) return;

    let consent = null;
    try { consent = localStorage.getItem(storageKey); } catch (e) {}
    if (consent === 'granted') loadGiscus();

    if (loadBtn) {
        loadBtn.addEventListener('click', function () {
            if (rememberCheckbox && rememberCheckbox.checked) {
                try { localStorage.setItem(storageKey, 'granted'); } catch (e) {}
            }
            loadGiscus();
        });
    }

    function loadGiscus() {
        if (giscusContainer.querySelector('script')) return;
        if (consentBox) consentBox.style.display = 'none';
        giscusContainer.style.display = 'block';

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        // copy data-repo, data-repo-id, … from the container to the Giscus script tag
        Object.keys(giscusContainer.dataset).forEach(function (key) {
            script.dataset[key] = giscusContainer.dataset[key];
        });
        script.crossOrigin = 'anonymous';
        script.async = true;
        giscusContainer.appendChild(script);
    }
})();
