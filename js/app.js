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
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.setState({deferredPrompt: e});
    });

    Book.load().then(book => {
      document.title = book.manifest.name;

      book.applyManifest();

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
      />}
      <BookReader
      epubUrl={this.state.book.epubUrl}
      title={this.state.book.manifest.name}
      theme={this.state.book.theme}
    /></Fragment>
  }
}

ReactDOM.render(
  <App/>, document.getElementById('app')
);