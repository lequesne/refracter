import React from 'react';
import { Link } from 'react-router';

const Tile = ({onTileClick, link, mainTitle, secondaryTitle, image}) => {

    //const linkValue = !onTileClick ? link : null;
    const onClickValue = onTileClick ? onTileClick : null;

    return (
        <Link to={link} onClick={onClickValue} title={`${mainTitle}${secondaryTitle ? ' - '+secondaryTitle:''}`} className="Tile">
            <div className="tile-image">

                { image ? <img src={image} alt={mainTitle}/> : <div className="ion-disc icon absolute"></div> }
            </div>
            <div className="tile-info">
                <div className="tile-main-title">{mainTitle}</div>
                {secondaryTitle ? <div className="tile-secondary-title">{secondaryTitle}</div> : null}
            </div>
        </Link>
    );
}

export default Tile;
