import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Col, Button} from 'react-bootstrap';
import TrackList from '../components/TrackList';
import TileList from '../components/TileList';

class Artist extends Component {

    constructor(props){
        super(props);

        this.state = {
            info: {},
            tracks: [],
            albums: []
        }

        this.loadArtist = this.loadArtist.bind(this);
    }

    componentWillMount(){
        this.loadArtist(this.props.params.artist);
    }

    componentWillReceiveProps(nextProps) {
        //only load new artist if new artist in params
        if ( nextProps.params.artist !== this.props.params.artist )
            this.loadArtist(nextProps.params.artist);
    }

    loadArtist(artistName){

        //TODO set loader in state

        refracter.getArtistInfo(artistName).then(artistData => {

            //TODO Hide Loader

            console.log('Artist info: ', artistData);
            this.setState({
                info: artistData.artistInfo,
                tracks: artistData.artistTracks,
                albums: artistData.artistAlbums
            });

        }).catch(err => {
            console.log('ERROR RETURNED: ', err);
        });

    }

    render() {

        let artistTags;
        if ( this.state.info.tags ) {
            artistTags = this.state.info.tags.tag.map((tag, index) => {
                return (
                    <span className="tag" key={index}>  #{tag.name} </span>
                )
            });
        }

        return (
            <div className="artist page">

                <div className="background-art" style={{backgroundImage: `url(${this.state.info.image?this.state.info.image[3]["#text"]:null})`}}></div>

                <div className="container">

                    <Col md={12} mdPush={0} lg={10} lgPush={1} >

                        <div className="artist-intro">

                            <h1>{this.state.info.name}</h1>

                            <div className="artist-bio card">

                                {this.state.info.bio ? this.state.info.bio.summary.replace(`<a href="https://www.last.fm/music/${this.state.info.name.split(' ').join('+')}">Read more on Last.fm</a>`,'') : null}

                                <hr/>

                                {artistTags}

                            </div>

                        </div>

                        <div className="artist-albums card">

                            <h2>Albums</h2>

                            <TileList
                                isArtistPage={true}
                                linkType="album"
                                tiles={this.state.albums}
                                carousel={true}
                                //carouselSlideNumber={12}
                            />

                        </div>

                        <div className="artist-songs card">

                            <h2>Top Songs</h2>

                            <TileList
                                isArtistPage={true}
                                linkType="track"
                                tiles={this.state.tracks}
                                carousel={true}
                            />

                        </div>

                        <div className="artist-songs card">

                            <h2>Related Artists</h2>

                            <TileList
                                isArtistPage={true}
                                linkType="artist"
                                tiles={this.state.info.similar?this.state.info.similar.artist:null}
                            />

                        </div>

                    </Col>

                </div>

            </div>
        );
    }


}

export default Artist;
