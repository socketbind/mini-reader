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

  applyManifest() {
    const stringManifest = JSON.stringify({
      ...this.manifest,
      start_url: window.location.origin,
      scope: window.location.origin
    });
    const blob = new Blob([stringManifest], {type: 'application/manifest+json'});
    const manifestURL = URL.createObjectURL(blob);
    document.getElementById('manifest-placeholder').setAttribute('href', manifestURL);
  }

  static load() {
    return fetch(bookManifestUrl)
      .then(res => res.json())
      .then(json => new Book(json));
  }

}