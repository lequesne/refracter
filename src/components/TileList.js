import * as refracter from '../refracter';
import React, {Component} from 'react';
//import {Link} from 'react-router';
import {Row,Col} from 'react-bootstrap';
import Slider from 'react-slick';
import Tile from '../components/Tile';

class TileList extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            tiles: []
        };

    }

    componentDidUpdate(){
        // var evt = window.document.createEvent('UIEvents');
        // evt.initUIEvent('resize', true, false, window, 0);
        // window.dispatchEvent(evt);
    }

    render() {

        let tiles = this.props.tiles ? this.props.tiles.map((tile, index) => {

            let link;
            let onTileClick;
            let secondaryTitle;

            if ( this.props.isArtistPage ){
                secondaryTitle = tile.artist ? tile.artist.name : tile.name;
            } else {
                secondaryTitle = tile.artist ? tile.artist : null;
            }

            if ( this.props.linkType === 'album' ) {
                link = `/album/${encodeURIComponent(secondaryTitle)}/${encodeURIComponent(tile.name)}`;
            }
            if ( this.props.linkType === 'artist' ) {
                link = `/artist/${encodeURIComponent(tile.name)}`;
            }
            if ( this.props.linkType === 'track' ) {
                onTileClick = () => refracter.getLastFMTrackLink(tile.name,secondaryTitle);
            }

            // let openingGroupTag;
            // let closingGroupTag;
            // if ( this.props.carouselSlideNumber && (index+1) % this.props.carouselSlideNumber === 0 ) {
            // }

            return (
                <Col xs={12} sm={6} md={4} lg={3} key={index}>
                    <Tile
                        link={ link ? link : null }
                        onTileClick={ onTileClick ? onTileClick : null }
                        mainTitle={tile.name}
                        secondaryTitle={!this.props.isArtistPage ? secondaryTitle : null}
                        image={tile.image[2]['#text']}
                    />
                </Col>
            )
        }) : null;

        const leftArrow = () =>{
            return <div className="ion-arrow-left-b icon"></div>;
        }

        const rightArrow = () =>{
            return <div className="ion-arrow-right-b icon"></div>;
        }

        var carouselSettings = {
            infinite: false,
            speed: 500,
            slidesToShow: 6,
            slidesToScroll: 6,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 1600,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }
            ]
        };

        return (
            <div className="tile-list">

                { this.props.carousel && tiles && tiles.length > 0
                    ? <Slider {...carouselSettings}>{tiles}</Slider>
                    : <Row>{tiles}</Row>
                }

            </div>
        );
    }

}

export default TileList;
