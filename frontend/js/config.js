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

class NumericLocalStorageItem extends LocalStorageItem {
  get() {
    return parseInt(super.get());
  }

  set(value) {
    super.set(value.toString());
  }
}

export default {
  epubLocation: new LocalStorageItem('epubLocation'),
  shouldPromptInstall: new LocalStorageItem('shouldPromptInstall', true),
  fontSize: new NumericLocalStorageItem('fontSize', 100)
};
