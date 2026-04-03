const CACHE_NAME = 'msuvenirov-v1';

// Install — cache minimal shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, no aggressive caching
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
