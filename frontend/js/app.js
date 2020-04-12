const startupVisible = Date.now();

const installPromise = new Promise((resolve) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    resolve(e);
  });
})

import '../css/app.css'
import "regenerator-runtime/runtime";

import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Book} from "./book";
import {BookReader} from "./bookReader";
import {InstallPrompt} from "./installPrompt";
import {Loading} from "./loading";
import config from "./config";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      deferredPrompt: null,
      shouldPrompt: config.shouldPromptInstall.get()
    };
  }

  componentDidMount() {
    installPromise.then(e => {
      console.log('Install promise resolved.');
      this.setState({deferredPrompt: e});
    });

    Book.load().then(book => {
      book.setupWorker();

      this.setState({loading: false, book});
    });
  }

  render() {
    return this.state.loading ? <Loading/> : <Fragment>
      {this.state.deferredPrompt && this.state.shouldPrompt && <InstallPrompt
        deferredPrompt={this.state.deferredPrompt}
        onHide={() => {
          this.setState({shouldPrompt: false});
          config.shouldPromptInstall.set(false);
        }}
        onClose={() => {
          this.setState({shouldPrompt: false});
        }}
      />}
      <BookReader
      epubUrl={this.state.book.epubUrl}
      title={this.state.book.manifest.name}
      theme={this.state.book.theme}
      uiOverlay={this.state.book.uiOverlay}
    /></Fragment>
  }
}

const readyToRender = Date.now();
const elapsed = readyToRender - startupVisible;

function fadeOutEarlyLoad() {
  const elem = document.getElementById('early-load')
  elem.addEventListener('transitionend', () => {
    elem.remove();
    document.getElementById('early-styles').remove();
  });
  elem.classList.add('fade-out');
}

if (elapsed < 2500) {
  const diff = 2500 - elapsed;

  setTimeout(fadeOutEarlyLoad, diff);
} else {
  fadeOutEarlyLoad()
}

ReactDOM.render(
  <App/>, document.getElementById('app')
);