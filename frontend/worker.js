import {bookManifestUrl} from "./js/cdn";
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

self.addEventListener('install', function (event) {
    self.skipWaiting();

    const urlsToCache = [
        '/',
        '/site.webmanifest',
        bookManifestUrl,
        ...Object.values(urls)
    ];

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error("Unable to open cache.")
                throw err;
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
            .catch(err => {
                console.error("Unable to clear old cache keys.")
                throw err;
            })
    );

    self.clients.claim();
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
            .catch(err => {
                console.error("Fetch failed")
                console.trace(event.request);
                throw err;
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data.cacheAssets) {
        const newAssets = event.data.cacheAssets;
        console.log('Adding URLs to cache: ' + newAssets.join(', '));

        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    return cache.addAll(newAssets);
                })
                .catch(err => {
                    console.error("Unable to add URLs to cache: " + newAssets);
                    throw err;
                })
        );
    }
});