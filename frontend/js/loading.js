import React from "react";
import loading from '../svg/loading.svg';

export class Loading extends React.Component {
  render() {
    return <div className="system-background">
      <object
          type="image/svg+xml"
          width="100%"
          height="100%"
          alt="Startup animation"
          data={loading}>
      </object>
    </div>;
  }
}