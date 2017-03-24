import * as refracter from '../refracter';
import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import {Col} from 'react-bootstrap';
import TrackList from '../components/TrackList';

//TODO library quick type filter (possibly update queue with only filtered tracks)
//TODO add library song, artist, album filters

class Library extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            tracks: []
        }
    }

    componentWillMount(){

        if ( this.props.user ) {

            this.context.parentState.showPageSpinner();

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

                this.context.parentState.hidePageSpinner();

            }).catch(err => {
                this.context.parentState.hidePageSpinner();
                toast(err, {
                    type: toast.TYPE.ERROR,
                    autoClose: 10000
                });
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

                    <div className="card">

                        <h1><span className="library refracter-repo"></span> Library</h1>

                        { this.state.tracks.length > 0 ?
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

                    </div>

                </div>
            </div>
        );
    }

}

Library.contextTypes = {
    parentState: React.PropTypes.object
};

export default Library;
