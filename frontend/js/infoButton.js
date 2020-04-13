import React from 'react';

export class InfoButton extends React.Component{
    render() {
        return (<button className="button icon info" {...this.props}></button>)
    }
}