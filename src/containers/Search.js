import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap';
import 'whatwg-fetch';
import Spinner from '../components/Spinner';
import Tile from '../components/Tile';
import * as refracter from '../refracter';

class Search extends Component {

    constructor(props) {
        super(props);

        //reset results
        this.state = {
            artists: {
                loaded: false,
                results: []
            },
            albums: {
                loaded: false,
                results: []
            },
            tracks: {
                loaded: false,
                results: []
            }
        }

        this.performSearch = this.performSearch.bind(this);
    }

    componentWillMount() {
        this.performSearch(this.props.params.query);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.performSearch(nextProps.params.query);
        }
    }

    performSearch(searchQuery) {
        if (searchQuery) {

            //reset results
            this.setState({
                artists: {
                    loaded: false,
                    results: []
                },
                albums: {
                    loaded: false,
                    results: []
                },
                tracks: {
                    loaded: false,
                    results: []
                }
            });

            //fetch artist matches for search
            fetch(`${refracter.lastFmEndpoint}?method=artist.search&artist=${searchQuery}&api_key=${refracter.lastFmApiKey()}&format=json`).then(response => {
                return response.json();
            }).then(json => {

                console.log('Artist: ', json);
                this.setState({
                    artists: {
                        loaded: true,
                        results: json.results.artistmatches.artist
                    }
                })

            }).catch(err => {
                console.log(err);
            });

            //fetch album matches for search
            fetch(`${refracter.lastFmEndpoint}?method=album.search&album=${searchQuery}&api_key=${refracter.lastFmApiKey()}&format=json`).then(response => {
                return response.json();
            }).then(json => {

                console.log('Album: ', json);
                this.setState({
                    albums: {
                        loaded: true,
                        results: json.results.albummatches.album
                    }
                })

            }).catch(err => {
                console.log(err);
            });

            //fetch track matches for search
            fetch(`${refracter.lastFmEndpoint}?method=track.search&track=${searchQuery}&api_key=${refracter.lastFmApiKey()}&format=json`).then(response => {
                return response.json();
            }).then(json => {

                console.log('Track: ', json);
                this.setState({
                    tracks: {
                        loaded: true,
                        results: json.results.trackmatches.track
                    }
                })

            }).catch(err => {
                console.log(err);
            });

        }
    }

    render() {

        let artistResults;
        let albumResults;
        let trackResults;

        //set artist results list
        if (this.state.artists.results.length > 0) {
            artistResults = this.state.artists.results.map((artist, index) => {
                return index < 10
                    ? <Col xs={2} key={index}>
                            <Tile mainTitle={artist.name} image={artist.image[0]['#text']}/>
                        </Col>
                    : null;
            });
        } else {
            artistResults = 'No matching artists found.'
        }

        //set albums results list
        if (this.state.albums.results.length > 0) {
            albumResults = this.state.albums.results.map((album, index) => {
                return index < 10
                    ? <Col xs={2} key={index}>
                            <Tile link={`/album/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.name)}`} mainTitle={album.name} secondaryTitle={album.artist} image={album.image[0]['#text']}/>
                        </Col>
                    : null;
            });
        } else {
            albumResults = 'No matching albums found.'
        }

        //set tracks results list
        //link need to bind to a get track info request to find the album name, then can link to albim/artist/track
        if (this.state.tracks.results.length > 0) {
            trackResults = this.state.tracks.results.map((track, index) => {
                return index < 10
                    ? <Col xs={2} key={index}>
                            <Tile mainTitle={track.name} secondaryTitle={track.artist} image={track.image[0]['#text']}/>
                        </Col>
                    : null;
            });
        } else {
            trackResults = 'No matching tracks found.'
        }

        return (
            <div className="search page">

                <div className="container">

                    <Col xs={10} xsPush={1}>

                        <div className="results-section">
                            <h1>
                                Artists
                                <Spinner hideWhen={this.state.artists.loaded}/>
                            </h1>
                            <Row>
                                {artistResults}
                            </Row>
                        </div>

                        <div className="results-section">
                            <h1>
                                Albums
                                <Spinner hideWhen={this.state.albums.loaded}/>
                            </h1>
                            <Row>
                                {albumResults}
                            </Row>
                        </div>

                        <div className="results-section">
                            <h1>
                                Tracks
                                <Spinner hideWhen={this.state.tracks.loaded}/>
                            </h1>
                            <Row>
                                {trackResults}
                            </Row>
                        </div>

                    </Col>

                </div>

            </div>
        );
    }

}

Search.contextTypes = {
    parentState: React.PropTypes.object
};

export default Search;
