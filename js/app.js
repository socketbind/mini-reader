import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';

import { ReactReader, ReactReaderStyle } from "react-reader";

import mobyDick from '../moby-dick.epub';

const customStyle = Object.assign({}, ReactReaderStyle, {
    container: {
        ...ReactReaderStyle.container,
        overflow: 'hidden',
        width: '100%',
        height: '100%'
    },
    readerArea: {
        ...ReactReaderStyle.readerArea,
        background: '#f4ddb9'
    }
});

class App extends React.Component {
    getRendition = (rendition) => {
        rendition.themes.default({
            body: {
                background: '#f4ddb9',
                color: '#000'
            }
        });
    };

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
            getRendition={this.getRendition}
        />
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app')
);