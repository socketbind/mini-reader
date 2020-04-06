import React from "react";

export class InstallPrompt extends React.Component {

  promptInstall(e) {
    e.preventDefault();
    this.props.onClose && this.props.onClose();
    this.props.deferredPrompt && this.props.deferredPrompt.prompt();
  }

  hide(e) {
    e.preventDefault();
    this.props.onHide && this.props.onHide();
  }

  render() {
    return <div className="install-prompt">
      <div className="message">Olvass bárhol, akár Internet nélkül is!</div>
      <button onClick={this.promptInstall.bind(this)}>Telepítés</button>
      <button onClick={this.hide.bind(this)}>Elrejtés</button>
    </div>;
  }

}