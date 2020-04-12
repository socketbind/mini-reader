import React from "react";
import config from "./config";
import {Loading} from "./loading";

export class BookReader extends React.Component {

  state = {
    location: config.epubLocation.get(),
    ReactReader: null,
    ReactReaderStyle: null
  };

  componentDidMount() {
    import('react-reader').then(({ ReactReader, ReactReaderStyle }) => {
      this.setState({ ReactReader, ReactReaderStyle });
    });
  }

  onLocationChanged = (location) => {
    this.setState({location}, () => {
      config.epubLocation.set(location);
    });
  }

  mergeWithStyles(baseStyle, ...overlays) {
    const result = Object.assign({}, baseStyle);

    for (const overlay of overlays) {
      for (const [key, value] of Object.entries(overlay)) {
        if (result.hasOwnProperty(key)) {
          result[key] = { ...result[key], ...value };
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  render() {
    const {epubUrl, title, theme, uiOverlay = {} } = this.props;
    const { ReactReader, ReactReaderStyle, location } = this.state;

    if (ReactReader && ReactReaderStyle) {
      const customStyle = this.mergeWithStyles(
          ReactReaderStyle, {
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
          }, uiOverlay
      )

      const getRendition = (rendition) => {
        rendition.themes.default(theme);
      };

      return <div className="reader"><ReactReader
        url={epubUrl}
        title={title}
        swipeable={true}
        showToc={true}
        styles={customStyle}
        location={location}
        locationChanged={this.onLocationChanged}
        loadingView={<Loading />}
        getRendition={getRendition}
      />
      </div>
    } else {
      return <Loading/>
    }
  }
}