import React, {Component} from 'react';
import {Link} from 'react-router';
import {Col, Row} from 'react-bootstrap';
import * as refracter from '../refracter';
import TrackList from '../components/TrackList';

class Album extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            album: {},
            tracks: {}
        }

        console.log(props);
    }

    componentWillMount() {

        //console.log(this.context.parentState);

        refracter.findTracksByAlbum( this.props.params.artist, this.props.params.album ).then(albumData => {

            this.setState({
                album: albumData.info,
                tracks: albumData.tracks
            });

            console.log(this.state);

        }).catch(err => {
            console.log('ERROR RETURNED: ',err );
        });

    }

    render() {

        return (
            <div className="album page">

                <div className="container">

                    <Col xs={10} xsPush={1}>

                        <h1>{this.state.album.name}</h1>

                        <TrackList
                            tracks={this.state.tracks}
                            activeTrack={this.props.activeTrack}
                            onTrackDoubleClick={this.context.parentState.onTrackClicked}
                        />

                    </Col>

                </div>
            </div>
        );
    }

}

Album.contextTypes = {
    parentState: React.PropTypes.object
};

export default Album;
