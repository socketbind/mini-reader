import React from "react";
import loading from '../svg/loading.svg';

export class Loading extends React.Component {
  render() {
    return <div className="system-background"><img src={loading} width="100%" height="100%" /></div>;
  }
}