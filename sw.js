/*
 * Service worker for blog.stderr.at – offline page only.
 *
 * What it does:
 *   - Page navigations go to the network as usual. The response is passed through unchanged,
 *     so a 404 stays a 404 and a 5xx stays a 5xx.
 *   - Only when the network is not reachable at all, the cached /offline/ page is shown.
 *   - Fingerprinted CSS and JS (name.<64 hex>.css|js) are immutable: the content never changes
 *     under the same URL. GitHub Pages sends them with max-age=600 only, so the browser
 *     revalidates them every ten minutes. This worker serves them cache-first instead.
 *     The cache is limited to ASSET_LIMIT entries; the oldest entries are removed first.
 *   - Nothing else is intercepted or cached: HTML, images, feeds and cross-origin requests
 *     are left to the browser's HTTP cache.
 *
 * On activation it deletes every other cache, including the ones of the previous service
 * worker (assets-v4, content-v4, offline-v4, 404-v4), which could grow without limit.
 *
 * Bump VERSION when the offline page changes.
 */
const VERSION = 'v6';
const CACHE = 'offline-' + VERSION;
const ASSET_CACHE = 'assets-immutable-v1';
const ASSET_LIMIT = 60;
const OFFLINE_URL = '/offline/';
const FINGERPRINTED = /\.[0-9a-f]{64}\.(?:css|js)$/;

async function trimAssetCache() {
  const cache = await caches.open(ASSET_CACHE);
  const keys = await cache.keys();   // insertion order
  await Promise.all(keys.slice(0, Math.max(0, keys.length - ASSET_LIMIT)).map((k) => cache.delete(k)));
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    await cache.put(request, response.clone());
    trimAssetCache();
  }
  return response;
}

// The offline page brings its styles inline (accent.css only adds the accent colour),
// so caching the HTML is enough.
async function cacheOfflinePage() {
  const cache = await caches.open(CACHE);
  const response = await fetch(OFFLINE_URL, { cache: 'reload' });
  if (!response.ok) throw new Error('offline page returned ' + response.status);
  await cache.put(OFFLINE_URL, response);
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheOfflinePage().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE && key !== ASSET_CACHE).map((key) => caches.delete(key)));
    // Lets the browser start the page request while the worker boots (no extra latency).
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Page navigations: network as usual, offline page only if the network fails.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloaded = await event.preloadResponse;
        return preloaded || await fetch(request);
      } catch (e) {
        const cached = await caches.match(OFFLINE_URL, { cacheName: CACHE });
        return cached || Response.error();
      }
    })());
    return;
  }

  // Immutable fingerprinted assets of this site: cache-first.
  const url = new URL(request.url);
  if (url.origin === self.location.origin && FINGERPRINTED.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});
