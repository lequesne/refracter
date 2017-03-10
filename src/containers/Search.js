import React, {Component} from 'react';
import {Col} from 'react-bootstrap';
import 'whatwg-fetch';
import Spinner from '../components/Spinner';
import Tile from '../components/Tile';

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
            fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchQuery}&api_key=482ff3a9fdfa984bca6a93a8bce32642&format=json`).then(response => {
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
            fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchQuery}&api_key=482ff3a9fdfa984bca6a93a8bce32642&format=json`).then(response => {
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
            fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchQuery}&api_key=482ff3a9fdfa984bca6a93a8bce32642&format=json`).then(response => {
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

        //set results list
        let artistResults = this.state.artists.results.map((artist, index) => {
            if ( index < 10 ) return ( <Col xs={2} key={index} > <Tile mainTitle={artist.name} image={artist.image[0]['#text']} /> </Col> )
        });
        artistResults = this.state.artists.results.length > 0 ? artistResults : 'No matching artists found.';

        let albumResults = this.state.albums.results.map((album, index) => {
            if ( index < 10 ) return ( <Col xs={2} key={index} > <Tile mainTitle={album.name} secondaryTitle={album.artist} image={album.image[0]['#text']} /> </Col> )
        });
        albumResults = this.state.albums.results.length > 0 ? albumResults : 'No matching albums found.';

        let trackResults = this.state.tracks.results.map((track, index) => {
            if ( index < 10 ) return ( <Col xs={2} key={index} > <Tile mainTitle={track.name} secondaryTitle={track.artist} image={track.image[0]['#text']} /> </Col> )
        });
        trackResults = this.state.tracks.results.length > 0 ? trackResults : 'No matching tracks found.';

        return (
            <div className="search page">

                <div className="container">

                    <div className="results-section">
                        <Col xs={12}>
                            <h1>
                                Artists <Spinner hideWhen={this.state.artists.loaded}/>
                            </h1>
                        </Col>
                        <div>
                            { artistResults }
                        </div>
                    </div>

                    <div className="results-section">
                        <Col xs={12}>
                            <h1>
                                Albums <Spinner hideWhen={this.state.albums.loaded}/>
                            </h1>
                        </Col>
                        <div>
                            { albumResults }
                        </div>
                    </div>

                    <div className="results-section">
                        <Col xs={12}>
                            <h1>
                                Tracks <Spinner hideWhen={this.state.tracks.loaded}/>
                            </h1>
                        </Col>
                        <div>
                            { trackResults }
                        </div>
                    </div>

                </div>

            </div>
        );
    }

}

export default Search;
