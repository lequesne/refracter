import * as refracter from '../refracter';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Button} from 'react-bootstrap';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";

class UserPlaylists extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            playlists: this.props.playlists
        }

        this.createNewPlaylist = this.createNewPlaylist.bind(this);
        this.onPlaylistBlur = this.onPlaylistBlur.bind(this);
        this.onPlaylistEnter = this.onPlaylistEnter.bind(this);
        this.existingPlaylistEdit = this.existingPlaylistEdit.bind(this);
        this.setPlaylist = this.setPlaylist.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
    }

    componentDidUpdate(){
        //focus on newly created playlist to allow user to set name
        if ( this.refs.newPlaylist ) {
            this.refs.newPlaylist.focus();
        }
        //focus on playlist that has been marked for editing
        if ( this.refs.editingPlaylist && this.refs.editingPlaylist !== document.activeElement ) {
            this.refs.editingPlaylist.select();
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

    existingPlaylistEdit(event, playlist, element){
        this.state.playlists[playlist.index].editable = true;
        this.setState({
            playlist: this.state.playlists
        });
    }

    onPlaylistBlur(event){
        this.checkToSetPlaylist(event);
    }

    onPlaylistEnter(event){
        if ( event.charCode === 13 ) {
            this.checkToSetPlaylist(event);
        }
    }

    checkToSetPlaylist(event){

        let playlistID = event.target.dataset.id ? event.target.dataset.id : null;
        let newPlaylistName = event.target.value ? event.target.value : null;

        if ( playlistID ) {
            //existing playlist

            for ( let playlist of this.state.playlists ){
                if ( playlistID === playlist.id ) {
                    if ( newPlaylistName && newPlaylistName !== playlist.name ) {
                        //update existing playlist

                        this.setPlaylist(newPlaylistName, playlistID);
                    } else {
                        //clear empty new playlist input
                        playlist.editable = null;
                    }
                }
            }

            this.setState({
                playlists: this.state.playlists
            });

        } else {
            //new playlist
            if ( newPlaylistName ) {
                //set new playlist
                this.setPlaylist(event.target.value, event.target.dataset.id);
            } else {
                //clear empty new playlist input
                this.setState({
                    newPlaylist: null
                });
            }
        }

    }

    setPlaylist(playlistName, playlistID){
        //playlist id is optional and provided when editing an existing playlist

        if ( playlistName ) {

            if ( !playlistID ){
                playlistID = '';
            }

            //call to server
            refracter.editUserPlaylist(refracter.userKey, playlistName, playlistID).then(response => {
                //return playlist object

                if ( response.newPlaylistID && response.newPlaylistName ){
                    //new playlist was created

                    //create and push new playlist to playlists array
                    this.state.playlists.push({
                        id: response.newPlaylistID,
                        name: response.newPlaylistName
                    });

                    this.context.parentState.updateUserPlaylists(this.state.playlists);

                    //TODO show new playlist success in toast

                } else if ( response.newPlaylistName ) {
                    //playlist name was updated

                    //update existing playlist with new name in state
                    for ( let playlist of this.state.playlists ){
                        if ( playlistID === playlist.id ) {
                            //set new name and disable editing
                            playlist.name = response.newPlaylistName;
                            playlist.editable = null;
                        }
                    }

                    this.context.parentState.updateUserPlaylists(this.state.playlists);

                    //TODO show playlist updated name success in toast

                }

                //reset newPlaylist input
                this.setState({
                    newPlaylist: null
                });

            }).catch(error => {
                //TODO show errors in toast
                console.log('editUserPlaylist: ', error);
                //reset newPlaylist input
                this.setState({
                    newPlaylist: null
                });
            });

        }

    }

    deletePlaylist(event, playlist, element){

        refracter.removeUserPlaylist(refracter.userKey, playlist.id).then(response => {

            //show toast
            console.log('Playlist removed: ', response);

            //remove playlist in state
            for ( let i = this.state.playlists.length -1; i >= 0 ; i-- ){
                if ( this.state.playlists[i].id === playlist.id ) {
                    this.state.playlists.splice(i,1);
                }
            }
            this.setState({
                playlists: this.state.playlists
            });

        }).catch(error => {
            console.log('removeUserPlaylist: ', error);
        });

    }

    linkToPlaylist(playlistID){
        browserHistory.push(`/playlist/${playlistID}`);
    }

    render() {

        return (
            <div className="user-playlists">

                <ContextMenu id="playlists-context">
                    <MenuItem onClick={this.existingPlaylistEdit}>
                        Rename playlist
                    </MenuItem>
                    <MenuItem onClick={this.sharePlaylist}>
                        Share
                    </MenuItem>
                    <MenuItem onClick={this.deletePlaylist}>
                        Delete playlist
                    </MenuItem>
                </ContextMenu>

                {this.state.playlists.map((playlist, playlistIndex) => {
                    if ( playlist.editable ) {
                        return (
                            <input
                                ref="editingPlaylist"
                                className="playlist-link"
                                defaultValue={playlist.name}
                                data-id={playlist.id}
                                onBlur={this.onPlaylistBlur}
                                onKeyPress={this.onPlaylistEnter}
                                key={playlistIndex}
                            />
                        )
                    } else {
                        return (

                            <ContextMenuTrigger
                                renderTag={'a'}
                                id="playlists-context"
                                key={playlistIndex}
                                attributes={{
                                    'data-drag-ndrop-add-tracks': true,
                                    'data-playlist-Id': playlist.id,
                                    'data-playlist-name': playlist.name,
                                    className: 'playlist-link dragNdrop-droppable',
                                    onClick: ()=>this.linkToPlaylist(playlist.id),
                                    //onDoubleClick: () => this.existingPlaylistEdit(playlistIndex)
                                }}
                                collect={()=>{
                                    return {
                                        index: playlistIndex,
                                        id: playlist.id,
                                        name: playlist.name
                                    }
                                }}>
                                {playlist.name}
                            </ContextMenuTrigger>

                        )
                    }

                })}

                {this.state.newPlaylist ?
                    <input
                        ref="newPlaylist"
                        className="playlist-link"
                        placeholder="Enter new playlist name"
                        onBlur={this.onPlaylistBlur}
                        onKeyPress={this.onPlaylistEnter}
                    />
                : null}

                { !this.state.newPlaylist
                ? <Button onClick={this.createNewPlaylist}>Create new playlist</Button>
                : null
                }

            </div>
        );
    }

}

UserPlaylists.contextTypes = {
    parentState: React.PropTypes.object
};

export default UserPlaylists;
