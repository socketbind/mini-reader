import React from "react";
import {ReactReader, ReactReaderStyle} from "react-reader";
import config from "./config";

export class BookReader extends React.Component {

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

    return <div className="reader"><ReactReader
      url={epubUrl}
      title={title}
      swipeable={true}
      showToc={false}
      styles={customStyle}
      location={config.epubLocation.get()}
      locationChanged={epubcifi => config.epubLocation.set(epubcifi)}
      getRendition={getRendition}
    />
    </div>
  }
}