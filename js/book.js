import {bookManifestUrl} from './cdn';

export class Book {

  constructor(json) {
    const {manifest, theme, epubUrl} = json;
    Object.assign(this, {manifest, theme, epubUrl});
  }

  setupWorker() {
    if ('serviceWorker' in navigator) {
      console.log("Attempting to register service worker");

      navigator.serviceWorker.register('/worker.js', {
        scope: '/'
      }).then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);

        if (registration.active) {
          const serviceWorker = registration.active;

          serviceWorker.postMessage({ cacheAssets: [
              this.epubUrl,
              ...this.manifest.icons.map(icon => icon.src)
          ]});
        }
      }, (err) => {
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