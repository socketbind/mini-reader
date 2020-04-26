import React from 'react';

export class FontSizeButton extends React.Component {
    render() {
        const { variant, ...rest }  = this.props;

        return (<button className={`button icon font-${variant || 'increase'}`} {...rest}/>)
    }
}