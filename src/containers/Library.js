import * as refracter from '../refracter';
import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import {Col} from 'react-bootstrap';
import TrackList from '../components/TrackList';

//TODO library quick type filter (possibly update queue with only filtered tracks)
//TODO add library song, artist, album sorting

class Library extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
        }
    }

    componentWillMount(){

        if ( this.props.user ) {

            fetch(`${refracter.refracterEndpoint}getUserTracks.php?key=${refracter.userKey}`).then(response => {
                return response.json();
            }).then(response => {
                console.log(response);
                if ( response.success ) {
                    //set user tracks in library state
                    this.setState({
                        tracks: response.userTracks
                    });
                }
            }).catch(error => {
                console.log('getUserTracks: ', error);
            });

        } else {
            //not logged in, redirect to home
            browserHistory.push('/');
        }
    }
    render() {

        return (
            <div className="library page">

                <div className="container">

                    <Col sm={12} smPush={0} md={10} mdPush={1}>

                        <h1>Library</h1>

                        { this.state.tracks && this.state.tracks.length > 0 ?
                            <TrackList
                                defaultSortName="artist"
                                defaultSortOrder="desc"
                                isLibrary={true}
                                user={this.props.user}
                                playing={this.props.playing}
                                tracks={this.state.tracks}
                                queueId={this.props.queueId}
                                activeTrack={this.props.activeTrack}
                                updateQueue={this.context.parentState.updateQueue}
                            />
                            : <p>Loading or no tracks in state</p>
                        }

                    </Col>

                </div>
            </div>
        );
    }

}

Library.contextTypes = {
    parentState: React.PropTypes.object
};

export default Library;
