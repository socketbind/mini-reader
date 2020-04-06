class LocalStorageItem {
  constructor(key, defaultValue) {
    this.key = key;

    if (defaultValue && !localStorage[key]) {
      this.set(defaultValue);
    }
  }

  get() {
    return localStorage.getItem(this.key);
  }

  set(value) {
    localStorage.setItem(this.key, value)
  }
}

export default {
  epubLocation: new LocalStorageItem('epubLocation'),
  shouldPromptInstall: new LocalStorageItem('shouldPromptInstall', true)
};
