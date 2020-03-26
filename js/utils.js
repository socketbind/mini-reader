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

  constructor(identifier, manifest) {
    this.manifest = manifest;
    this.epubUrl = `https://content.konyv.site/${identifier}/book.epub`;
  }

  static load() {
    let identifier = determineBookIdentifier();
    const url = `https://content.konyv.site/${identifier}/book.json`;

    return fetch(url)
      .then(res => res.json())
      .then(manifest => new Book(identifier, manifest));
  }

}