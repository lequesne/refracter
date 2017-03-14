import React from 'react';
import { Link } from 'react-router';

const Tile = ({onTileClick, link, mainTitle, secondaryTitle, image}) => {

    const linkValue = !onTileClick ? link : null;
    const onClickValue = onTileClick ? onTileClick : null;

    return (
        <Link to={linkValue} onClick={onClickValue} title={`${mainTitle} - ${secondaryTitle}`} className="Tile">
            <div className="tile-image">

                <img src={image} alt={mainTitle}/>
            </div>
            <div className="tile-main-title">{mainTitle}</div>
            <div className="tile-secondary-title">{secondaryTitle}</div>
        </Link>
    );
}

export default Tile;
