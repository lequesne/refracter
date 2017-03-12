import React from 'react';
import { Link } from 'react-router';

const Tile = ({link, mainTitle, secondaryTitle, image}) => {
    return (
        <Link to={link} title={`${mainTitle} - ${secondaryTitle}`} className="Tile">
            <div className="tile-image">

                <img src={image} alt={mainTitle}/>
            </div>
            <div className="tile-main-title">{mainTitle}</div>
            <div className="tile-secondary-title">{secondaryTitle}</div>
        </Link>
    );
}

export default Tile;
