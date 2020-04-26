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

class BooleanLocalStorageItem extends LocalStorageItem {
  get() {
    return super.get().toUpperCase() === "TRUE";
  }

  set(value) {
    super.set(value.toString().toUpperCase());
  }
}

export default {
  firstTime: new BooleanLocalStorageItem("firstTime", true),
  epubLocation: new LocalStorageItem('epubLocation'),
  shouldPromptInstall: new BooleanLocalStorageItem('shouldPromptInstall', true),
  fontSize: new NumericLocalStorageItem('fontSize', 100)
};
