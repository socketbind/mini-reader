const subDomainRegex = /^([^.]+)\.konyv\.site$/;

export function determineBookIdentifier() {
  const host = window.location.host;
  const match = host.match(subDomainRegex);

  let identifier = "moby-dick";

  if (match) {
    identifier = match[1];
  }

  return identifier;
}

export class Book {

  constructor( manifest, contentBase) {
    this.contentBase = contentBase;
    this.manifest = manifest;
    this.epubUrl = `${contentBase}/book.epub`;
  }

  setupHead() {
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="apple-touch-icon" sizes="180x180" href="${this.contentBase}/icons/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="${this.contentBase}/icons/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="${this.contentBase}/icons/favicon-16x16.png">
      <link rel="manifest" href="${this.contentBase}/site.webmanifest">
      <link rel="mask-icon" href="${this.contentBase}/icons/safari-pinned-tab.svg" color="#5bbad5">
      <meta name="apple-mobile-web-app-title" content="${this.manifest.title}">
      <meta name="application-name" content="${this.manifest.title}">
      <meta name="theme-color" content="#ffffff">
    `.trim();

    document.head.appendChild(template.content);
  }

  static load() {
    const identifier = determineBookIdentifier();
    const contentBase = `https://content.konyv.site/${identifier}`;
    const url = `${contentBase}/book.json`;

    return fetch(url)
      .then(res => res.json())
      .then(manifest => new Book(manifest, contentBase));
  }

}