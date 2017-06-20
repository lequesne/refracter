import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {Row, Col, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import TrackList from '../components/TrackList';
import Dropdown from '../components/Dropdown';
import BackgroundArt from '../components/BackgroundArt';

class Album extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            album: {},
            tracks: []
        }

        this.addAlbumToUser = this.addAlbumToUser.bind(this);
    }

    componentWillMount() {

        this.context.parentState.showPageSpinner();

        refracter.findTracksByAlbum(this.props.params.artist, this.props.params.album, refracter.userKey).then(albumData => {

            this.setState({
                albumInLibrary: albumData.albumInLibrary,
                album: albumData.info,
                albumArt: albumData.info.image[4]["#text"] ? albumData.info.image[4]["#text"] : null,
                tracks: albumData.tracks
            });

            //if track name is passed as url param, play this track on load
            if (this.props.params.track) {
                for (let track of albumData.tracks ) {
                    if (track.title === this.props.params.track) {
                        //play track from url
                        this.context.parentState.updateQueue(track, albumData.tracks, location.pathname);
                        //scroll to active track on load
                        //document.querySelectorAll(`[data-track-id~="${track.trackID}"]`)[0].scrollIntoView();
                        break;
                    }
                }
            }

            this.context.parentState.hidePageSpinner();

        }).catch(err => {
            browserHistory.push(`/artist/${this.props.params.artist}`);
            toast(err, {
                type: toast.TYPE.ERROR,
                autoClose: 10000
            });
            console.log('ERROR RETURNED: ', err);
        });

    }

    addAlbumToUser(playlistID, playlistName){
        //pass optional playlist id if added to playlist
        playlistID = playlistID ? playlistID : '';
        playlistName = playlistName ? playlistName : '';

        refracter.addUserTracks(refracter.userKey, this.state.tracks, playlistID, playlistName).then(response => {

            let addContext = playlistName && playlistID ? playlistName : 'library';

            toast(`${this.state.album.name} was added to ${addContext}.`, {
              type: toast.TYPE.SUCCESS
            });
            this.setState({
                albumInLibrary: true
            });

            console.log('Album added to library: ', response);
        }).catch(err => {
            console.log('ERROR RETURNED: ', err);
        });
    }

    render() {

        // let albumTags;
        // if ( this.state.album.tags ) {
        //     albumTags = this.state.album.tags.tag.map((tag, index) => {
        //         if ( tag.name !== 'albums I own' ) {
        //             return (
        //                 <span className="tag" key={index}> #{tag.name} </span>
        //             )
        //         } else {
        //             return null;
        //         }
        //     });
        // }

        return (
            <div className="album page">

                <BackgroundArt art={this.state.albumArt}/>

                <div className="container">

                    <div className="album-info">
                        <img className="album-art" src={this.state.albumArt}/>
                        <h1>{this.state.album.name}</h1>

                        <h2><Link to={`/artist/${encodeURIComponent(this.state.album.artist)}`}>{this.state.album.artist}</Link></h2>

                        {/* {albumTags ? <div className="tags">{albumTags}</div> : null} */}

                        { this.props.user ?
                        //add album drop down
                        <Dropdown label="Add track list">
                            <div onClick={()=>this.addAlbumToUser()}>
                                Library
                            </div>
                            {this.props.user ? this.props.user.playlists.map((playlist, index) => {
                                return (<div key={index} onClick={()=>this.addAlbumToUser(playlist.id, playlist.name)}>{playlist.name}</div>);
                            }):null}
                        </Dropdown>
                        : null}

                    </div>

                    <div className="card">

                        { this.state.tracks.length > 0 ?
                            <TrackList
                                queueLocation={this.props.queueLocation}
                                isAlbum={this.state.album.name}
                                existsInLibrary={this.state.albumInLibrary}
                                user={this.props.user}
                                playTrack={this.props.playTrack}
                                playing={this.props.playing}
                                buffering={this.props.buffering}
                                tracks={this.state.tracks}
                                queueId={this.props.queueId}
                                activeTrack={this.props.activeTrack}
                                updateQueue={this.context.parentState.updateQueue}
                                shuffle={this.props.shuffle}
                            />
                            : <p>Loading or no tracks in state</p>
                        }

                    </div>

                </div>

            </div>
        );
    }

}

Album.contextTypes = {
    parentState: React.PropTypes.object
};

export default Album;
