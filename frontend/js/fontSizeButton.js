import React from 'react';

export class FontSizeButton extends React.Component {
    render() {
        const { variant, ...rest }  = this.props;

        return (<button class={`button icon font-${variant || 'increase'}`} {...rest}></button>)
    }
}