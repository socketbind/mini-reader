import {iOS} from "./platform";
import '../css/app.css'
import "regenerator-runtime/runtime";

import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Book} from "./book";
import {BookReader} from "./bookReader";
import {InstallPrompt} from "./installPrompt";
import {FontSizeButton} from "./fontSizeButton";
import {Loading} from "./loading";
import config from "./config";
import {InfoButton} from "./infoButton";
import {GeneralInfoPanel, IOSInfoPanel} from "./infoPanel";

const startupVisible = Date.now();

const installPromise = new Promise((resolve) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    resolve(e);
  });
})

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      deferredPrompt: null,
      shouldPrompt: config.shouldPromptInstall.get(),
      showGeneralInfo: false,
      showIosInfo: false,
      fontSize: config.fontSize.get()
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

  toggleGeneralInfo = () => {
    const showGeneralInfo = !this.state.showGeneralInfo;
    this.setState({showGeneralInfo});
  }

  toggleIosInfo = () => {
    const showIosInfo = !this.state.showIosInfo;
    this.setState({showIosInfo});
  }

  increaseFontSize = () => {
    const fontSize = this.state.fontSize + 10;
    this.setState({ fontSize: fontSize });
    config.fontSize.set(fontSize);
  }

  decreaseFontSize = () => {
    const fontSize = this.state.fontSize > 0 ? this.state.fontSize - 10 : 0;
    this.setState({ fontSize: fontSize });
    config.fontSize.set(fontSize);
  }

  render() {
    return this.state.loading ? <Loading/> : <Fragment>
      {(this.state.deferredPrompt || iOS) && this.state.shouldPrompt && <InstallPrompt
        onInstall={() => (this.state.deferredPrompt && this.state.deferredPrompt.prompt()) || this.toggleIosInfo()}
        onHide={() => {
          this.setState({shouldPrompt: false});
          config.shouldPromptInstall.set(false);
        }}
        onClose={() => {
          this.setState({shouldPrompt: false});
        }}
      />}
      <div className="toolbar">
        <FontSizeButton variant="decrease" onClick={this.decreaseFontSize} />
        <FontSizeButton variant="increase" onClick={this.increaseFontSize} />
        <InfoButton onClick={this.toggleGeneralInfo}/>
      </div>
      <GeneralInfoPanel show={this.state.showGeneralInfo} onClose={this.toggleGeneralInfo}/>
      <IOSInfoPanel show={this.state.showIosInfo} onClose={this.toggleGeneralInfo} />
      <BookReader
      epubUrl={this.state.book.epubUrl}
      title={this.state.book.manifest.name}
      theme={this.state.book.theme}
      uiOverlay={this.state.book.uiOverlay}
      fontSize={this.state.fontSize}
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