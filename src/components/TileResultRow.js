import React from 'react';
import Tile from './Tile';

const TileResultRow = ({rowTitle, rowTiles}) => {
    return (
        <div className="result-tile-row">
            <h1>
                {rowTitle}
            </h1>
            {rowTiles.map((tile) => {
                console.log(tile);
                return <Tile link={`/artist/${tile.artist}`} mainTitle={} secondaryTitle={} key={tile.name} />
            })}
        </div>
    );
}

export default TileResultRow;
