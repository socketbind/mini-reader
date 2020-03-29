export const cdnBase = 'https://content.konyv.site/';
export const subDomainRegex = /^([^.]+)\.konyv\.site$/;

function determineBookIdentifier() {
  const host = self.location.hostname || window.location.host;
  const match = host.match(subDomainRegex);

  let identifier = "moby-dick";

  if (match) {
    identifier = match[1];
  }

  return identifier;
}

const identifier = determineBookIdentifier();
const contentBase = `${cdnBase}${identifier}`;

export const bookManifestUrl = `${contentBase}/book.json`;
export const epubUrl = `${contentBase}/book.epub`;