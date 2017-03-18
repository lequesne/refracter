import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        //setup state
        this.state = {
            playlists: []
        }

        this.createNewPlaylist = this.createNewPlaylist.bind(this);
        this.onNewPlaylistBlur = this.onNewPlaylistBlur.bind(this);
        this.onNewPlaylistEnter = this.onNewPlaylistEnter.bind(this)
        this.setPlaylist = this.setPlaylist.bind(this);
    }

    componentDidUpdate(){
        //focus on newly created playlist to allow user to set name
        if ( this.refs.newPlaylist ) {
            this.refs.newPlaylist.focus();
        }
    }

    createNewPlaylist(){

        let playlist = {
            editable: true,
            name: null,
            id: null
        }

        this.setState({
            newPlaylist: playlist
        });

    }

    onNewPlaylistBlur(event){
        this.setPlaylist(event.target.value);
    }

    onNewPlaylistEnter(event){
        if ( event.charCode === 13 ) {
            this.setPlaylist(event.target.value);
        }
    }

    setPlaylist(playlistName, playlistID){
        //playlist id is optional and provided when editing an existing playlist

        if ( playlistName ) {
            //TODO save playlist name in db

            //lock down new playlist input and show spinner on it
            console.log(playlistName);

            fetch(`${refracter.refracterEndpoint}editPlaylists.php?key=${refracter.userKey}&name=${playlistName}&playlistID=${playlistID?playlistID:''}`).then(response => {
                return response.json();
            }).then(response => {

                if ( response.success ){
                    if ( response.newPlaylistName ) {
                        //playlist name was updated
                        //update existing playlist with new name in state
                        for ( let playlist of this.state.playlists ){
                            if ( playlistID === playlist.playlistID ) {
                                playlist.name = response.newPlaylistName;
                            }
                        }
                        this.setState({
                            playlists: this.state.playlists
                        })
                        //show playlist updated name success in toast
                    } else if ( response.newPlaylistID && response.newPlaylistName ){
                        //new playlist
                        //create and push new playlist to playlists array
                        let playlist = {
                            id: response.newPlaylistID,
                            name: response.newPlaylistName
                        }
                        this.setState({
                            playlists: this.state.playlists.push(playlist)
                        });
                        //show new playlist success in toast
                    }
                } else {
                    //show errors in toast
                    console.log( response.errors );
                }

                //reset newPlaylist input
                this.setState({
                    newPlaylist: null
                });

            }).catch(error => {
                //reset newPlaylist input
                console.log('editPlaylists: ', error);
            });

        }

    }

    render() {

        return (
            <div className="sidebar">
                <div className="padded-inner">

                    { this.props.user
                        ?
                        <div className="logged-in">

                            <Link to={'/library'}>
                                Library
                            </Link>

                            <div className="user-playlists">

                                {this.state.playlists.map((playlist, playlistIndex) => {
                                    return (
                                        <input className="playlist-link" value={playlist.name} disabled={true} key={playlistIndex}></input>
                                    )
                                })}

                                {this.state.newPlaylist ?
                                    <input
                                        ref="newPlaylist"
                                        className="playlist-link"
                                        placeholder="Enter new playlist name"
                                        onBlur={this.onNewPlaylistBlur}
                                        onKeyPress={this.onNewPlaylistEnter}
                                    />
                                : null}


                            </div>

                            { !this.state.newPlaylist
                            ? <Button onClick={this.createNewPlaylist}>Create new playlist</Button>
                            : null
                            }

                        </div>
                        :
                        <div className="logged-out">

                            <div className="login-signup">
                                Log in or sign up to save tracks and albums to your library and create custom playlists.
                                <Link onClick={this.props.showLogIn} className="button-standard">Sign In</Link>
                                <Link onClick={this.props.showSignUp} className="button-standard">Sign Up</Link>
                            </div>

                        </div>
                    }

                    <div className="album-art">
                        {this.props.activeTrack
                            ? <img src={this.props.activeTrack.art} alt="Artwork"/>
                            : null}
                    </div>

                </div>
            </div>
        );
    }

}

export default Sidebar;
