import React from 'react';

const Spinner = ({size, hideWhen}) => {

    let style = {
        display: 'inline-block'
    }

    if ( hideWhen ) {
        style = {
            display: 'none'
        }
    }

    return (
        <div style={style} className="spinner"></div>
    );
}

export default Spinner;
