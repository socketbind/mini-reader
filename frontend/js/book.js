import {bookManifestUrl} from './cdn';

export class Book {

  constructor(json) {
    const {manifest, theme, epubUrl, uiOverlay} = json;
    Object.assign(this, {manifest, theme, epubUrl, uiOverlay});
  }

  setupWorker() {
    if ('serviceWorker' in navigator) {
      console.log("Attempting to register service worker");

      navigator.serviceWorker.register('/worker.js', {
        scope: '/'
      }).then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        return navigator.serviceWorker.ready;
      })
      .then((registration) => {
        if (navigator.onLine) {
          console.log("Priming caches...");

          const serviceWorker = registration.active;

          serviceWorker.postMessage({ cacheAssets: [
              this.epubUrl,
              ...this.manifest.icons.map(icon => icon.src)
            ]});
        } else {
          console.log("Not attempting to prime caches, browser is offline.");
        }
      })
      .catch(err => {
        console.error('ServiceWorker registration failed: ', err);
      });
    }
  }

  static load() {
    return fetch(bookManifestUrl)
      .then(res => res.json())
      .then(json => new Book(json));
  }

}