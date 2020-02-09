import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';

import { ReactReader, ReactReaderStyle } from "react-reader";

import mobyDick from '../moby-dick.epub';

console.log(mobyDick);

const customStyle = Object.assign({}, ReactReaderStyle, {
    container: {
        overflow: 'hidden',
        width: '100%',
        height: '100%'
    }
});

class App extends React.Component {
    render() {
        return <ReactReader
            className="reader"
            url={mobyDick}
            title={"Moby Dick"}
            swipeable={true}
            showToc={false}
            styles={customStyle}
            location={localStorage.getItem('epubLocation')}
            locationChanged={epubcifi => localStorage.setItem('epubLocation', epubcifi)}
        />
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app')
);