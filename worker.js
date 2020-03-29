import {epubUrl} from "./js/cdn";
import urls from './assets.urls'

const appVersion = (() => {
  const regex = /app\.([^.]+)\.js/;

  for (const asset of Object.values(urls)) {
    const match = asset.match(regex);
    if (match) {
      return match[1];
    }
  }
  return 'unknown';
})();

const CACHE_NAME = `reader-app-cache-${appVersion}`;

self.addEventListener('install', function(event) {
  self.skipWaiting();

  const urlsToCache = [
    '/',
    epubUrl,
    ...Object.values(urls)
  ];

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('Cleared old caches');
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
  );
});