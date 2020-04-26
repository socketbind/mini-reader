const startupVisible = Date.now();

import config from "./config";
import ReactDOM from "react-dom";
import React from "react";
import {App} from "./app";

const readyToRender = Date.now();
const elapsed = readyToRender - startupVisible;

const earyLoadElement = document.getElementById('early-load')

function fadeOutEarlyLoad() {
    earyLoadElement.addEventListener('transitionend', () => {
        earyLoadElement.remove();
        document.getElementById('early-styles').remove();
    });
    earyLoadElement.classList.add('fade-out');
}

if (config.firstTime.get() && elapsed < 2500) {
    const diff = 2500 - elapsed;

    setTimeout(fadeOutEarlyLoad, diff);
} else {
    earyLoadElement.remove();
}

config.firstTime.set(false);

ReactDOM.render(
    <App/>, document.getElementById('app')
);