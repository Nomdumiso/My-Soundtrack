const CACHE_NAME = 'my-soundtrack-static-v1';
const ASSETS = [
  '/',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', event => {
  // Simple cache-first strategy for navigation and static assets
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(res => {
      // Optionally cache responses
      return res;
    }).catch(() => cached);
  }));
});
