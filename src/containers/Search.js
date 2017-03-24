import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap';
import 'whatwg-fetch';
import Spinner from '../components/Spinner';
import TileList from '../components/TileList';
import * as refracter from '../refracter';

class Search extends Component {

    constructor(props) {
        super(props);

        //reset results
        this.state = {
            artists: [],
            albums: [],
            tracks: []
        }

        this.performSearch = this.performSearch.bind(this);
    }

    componentWillMount() {
        this.performSearch(this.props.params.query);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.query !== this.props.params.query ) {
            this.performSearch(nextProps.params.query);
        }
    }

    performSearch(searchQuery) {

        this.context.parentState.showPageSpinner();

        refracter.search(searchQuery).then(searchData => {

            console.log('Search results: ', searchData);

            this.setState({
                artists: searchData.artists,
                albums: searchData.albums,
                tracks: searchData.tracks
            });

            this.context.parentState.hidePageSpinner();

        }).catch(err => {
            this.context.parentState.hidePageSpinner();
            toast(err, {
                type: toast.TYPE.ERROR,
                autoClose: 10000
            });
            console.log('ERROR RETURNED: ', err);
        });

    }

    render() {

        return (
            <div className="search page">

                <div className="container">

                    <Col md={12} mdPush={0} lg={10} lgPush={1} >

                        <div className="results-artists card">

                            <h2>Artists</h2>

                            <TileList
                                //isArtist={true}
                                linkType="artist"
                                tiles={this.state.artists}
                                carousel={true}
                            />

                        </div>

                        <div className="results-albums card">

                            <h2>Albums</h2>

                            <TileList
                                linkType="album"
                                tiles={this.state.albums}
                                carousel={true}
                            />

                        </div>

                        <div className="results-tracks card">

                            <h2>Tracks</h2>

                            <TileList
                                linkType="track"
                                tiles={this.state.tracks}
                                carousel={true}
                            />

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
