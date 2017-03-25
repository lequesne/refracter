import * as refracter from '../refracter';
import React, {Component} from 'react';
//import {Link} from 'react-router';
import {Col} from 'react-bootstrap';
import TrackList from '../components/TrackList';

class Playlist extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            tracks: []
        };

        this.loadPlaylist = this.loadPlaylist.bind(this);
    }

    componentWillMount() {
        this.loadPlaylist(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        //only load new playlist if new playlist id
        if ( nextProps.params.id !== this.props.params.id ) {
            this.loadPlaylist(nextProps.params.id);
        }

        //update playlist name
        for ( let playlist of nextProps.user.playlists ) {
            if ( playlist.id === this.state.playlistID ) {
                this.setState({
                    playlistName: playlist.name
                });
                break;
            }
        }
    }

    loadPlaylist(playlistID){

        this.context.parentState.showPageSpinner();

        refracter.getPlaylist(playlistID).then(playlistData => {

            //format playlist tracks to playlist order from db
            for ( let [i,track] of playlistData.playlistTracks.entries() ) {
                track.number = i+1;
            }

            this.setState({
                playlistID: playlistData.playlistID,
                playlistName: playlistData.playlistName,
                tracks: playlistData.playlistTracks
            });

            this.context.parentState.hidePageSpinner();

        }).catch(err => {
            this.context.parentState.hidePageSpinner();
            toast(err, {
                type: toast.TYPE.ERROR,
                autoClose: 10000
            });
            console.log('getPlaylist: ', err);
        });

    }

    render() {

        //TODO return user/owner of playlist match to show different message if no tracks have been added yet

        return (
            <div className="playlist page">

                <div className="container">

                    <div className="card">

                        <h1>
                            <span className="playlist-icon refracter-book-audio"></span>
                            {this.state.playlistName}
                        </h1>

                        { this.state.tracks.length > 0 ?
                            <TrackList
                                queueLocation={this.props.queueLocation}
                                isPlaylist={true}
                                playlistID={this.state.playlistID}
                                playlistName={this.state.playlistName}
                                user={this.props.user}
                                playPauseTrack={this.context.parentState.playPauseTrack}
                                playing={this.props.playing}
                                tracks={this.state.tracks}
                                queueId={this.props.queueId}
                                activeTrack={this.props.activeTrack}
                                updateQueue={this.context.parentState.updateQueue}
                                shuffle={this.props.shuffle}
                            />
                            : <p>It looks like no tracks have been added to this playlist yet. If you are the playlist owner get adding!</p>
                        }

                    </div>

                </div>
            </div>
        );
    }

}

Playlist.contextTypes = {
    parentState: React.PropTypes.object
};

export default Playlist;
