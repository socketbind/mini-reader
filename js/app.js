import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';

import {ReactReader, ReactReaderStyle} from "react-reader";
import {Book} from "./utils";

class BookReader extends React.Component {

  render() {
    const {epubUrl, title, theme} = this.props;

    const customStyle = Object.assign({}, ReactReaderStyle, {
      container: {
        ...ReactReaderStyle.container,
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      },
      readerArea: {
        ...ReactReaderStyle.readerArea,
        background: theme.body.background
      }
    });

    const getRendition = (rendition) => {
      rendition.themes.default(theme);
    };

    return <ReactReader
      className="reader"
      url={epubUrl}
      title={title}
      swipeable={true}
      showToc={false}
      styles={customStyle}
      location={localStorage.getItem('epubLocation')}
      locationChanged={epubcifi => localStorage.setItem('epubLocation', epubcifi)}
      getRendition={getRendition}
    />
  }
}

class Loading extends React.Component {
  render() {
    return "Loading...";
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentDidMount() {
    Book.load().then(book => {
      document.title = book.manifest.title;
      book.setupHead();

      this.setState({loading: false, book});
    });
  }

  render() {

    return this.state.loading ? <Loading/> : <BookReader
      epubUrl={this.state.book.epubUrl}
      title={this.state.book.manifest.title}
      theme={this.state.book.manifest.theme}
    />
  }
}

ReactDOM.render(
  <App/>, document.getElementById('app')
);