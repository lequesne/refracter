import React from 'react';

const Tile = ({link, mainTitle, secondaryTitle, image}) => {
    return (
        <a href={link} title={`${mainTitle} - ${secondaryTitle}`} className="Tile">
            <div className="tile-image">

                <img src={image} alt={mainTitle}/>
            </div>
            <div className="tile-main-title">{mainTitle}</div>
            <div className="tile-secondary-title">{secondaryTitle}</div>
        </a>
    );
}

export default Tile;
