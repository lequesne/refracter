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
        if ( nextProps.params.id !== this.props.params.id )
            this.loadPlaylist(nextProps.params.id);
    }

    loadPlaylist(playlistID){

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

        }).catch(err => {
            console.log('getPlaylist: ', err);
        });

    }

    render() {

        //TODO return user/owner of playlist match to show different message if no tracks have been added yet

        return (
            <div className="playlist page">

                <div className="container">

                    <Col sm={12} smPush={0} md={10} mdPush={1}>

                        <h1>{this.state.playlistName}</h1>

                        { this.state.tracks.length > 0 ?
                            <TrackList
                                playlistID={this.state.playlistID}
                                playlistName={this.state.playlistName}
                                user={this.props.user}
                                playing={this.props.playing}
                                tracks={this.state.tracks}
                                queueId={this.props.queueId}
                                activeTrack={this.props.activeTrack}
                                updateQueue={this.context.parentState.updateQueue}
                            />
                            : <p>It looks like no tracks have been added to this playlist yet. If you are the playlist owner get adding!</p>
                        }

                    </Col>

                </div>
            </div>
        );
    }

}

Playlist.contextTypes = {
    parentState: React.PropTypes.object
};

export default Playlist;
