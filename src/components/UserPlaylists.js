import * as refracter from '../refracter';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Col, Button} from 'react-bootstrap';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import {toast} from 'react-toastify';

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
        let playlists = this.state.playlists;
        playlists[playlist.index].editable = true;
        this.setState({
            playlist: playlists
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

                    //update the app user playlists state
                    this.props.updateUserPlaylists(this.state.playlists);

                    //show new playlist success in toast
                    toast(`The playlist '${response.newPlaylistName}' was just created.`, {
                      type: toast.TYPE.SUCCESS
                    });

                } else if ( response.newPlaylistName ) {
                    //playlist name was edited

                    //update existing playlist with new name in state
                    for ( let playlist of this.state.playlists ){
                        if ( playlistID === playlist.id ) {
                            //set new name and disable editing
                            playlist.name = response.newPlaylistName;
                            playlist.editable = null;
                        }
                    }

                    //update the app user playlists state
                    this.props.updateUserPlaylists(this.state.playlists);

                    //show playlist updated name success in toast
                    toast(`Changed playlist name to '${response.newPlaylistName}'.`, {
                      type: toast.TYPE.SUCCESS
                    });

                }

                //reset newPlaylist input
                this.setState({
                    newPlaylist: null
                });

            }).catch(error => {
                //show errors in toast
                toast(`${error}`, {
                  type: toast.TYPE.ERROR
                });
                //reset newPlaylist input
                this.setState({
                    newPlaylist: null
                });

                console.log('editUserPlaylist: ', error);
            });

        }

    }

    deletePlaylist(event, playlist, element){

        refracter.removeUserPlaylist(refracter.userKey, playlist.id).then(response => {

            //remove playlist in state
            for ( let i = this.state.playlists.length -1; i >= 0 ; i-- ){
                if ( this.state.playlists[i].id === playlist.id ) {
                    this.state.playlists.splice(i,1);
                }
            }
            this.setState({
                playlists: this.state.playlists
            });

            //update the app user playlists state
            this.props.updateUserPlaylists(this.state.playlists);

            //show toast
            toast(`${playlist.name} was deleted.`, {
              type: toast.TYPE.INFO
            });

            console.log('Playlist removed: ', response);

        }).catch(error => {

            //show toast
            toast(`${playlist.name} was unable to be deleted.`, {
              type: toast.TYPE.ERROR
            });

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
                    {/* <MenuItem onClick={this.sharePlaylist}>
                        Share
                    </MenuItem> */}
                    <MenuItem onClick={this.deletePlaylist}>
                        Delete playlist
                    </MenuItem>
                </ContextMenu>

                {this.state.playlists.map((playlist, playlistIndex) => {
                    if ( playlist.editable ) {
                        return (
                            <input
                                ref="editingPlaylist"
                                className="link"
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
                                key={playlistIndex}
                                renderTag={'a'}
                                id="playlists-context"
                                attributes={{
                                    'title': `Playlist - ${playlist.name}`,
                                    'data-drag-ndrop-add-tracks': true,
                                    'data-playlist-Id': playlist.id,
                                    'data-playlist-name': playlist.name,
                                    className: 'link dragNdrop-droppable',
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
                                <span className="text">
                                    <span className="playlist-icon refracter-book-audio">
                                        {/* <span className="list ion-ios-list-outline"></span>
                                        <span className="notes ion-ios-musical-notes"></span> */}
                                    </span>
                                    {playlist.name}
                                </span>
                            </ContextMenuTrigger>

                        )
                    }

                })}

                {this.state.newPlaylist ?
                    <input
                        ref="newPlaylist"
                        className="link"
                        placeholder="Enter new playlist name"
                        onBlur={this.onPlaylistBlur}
                        onKeyPress={this.onPlaylistEnter}
                    />
                : null}

                { !this.state.newPlaylist ?
                    <div className="col-padding">
                        <Button block className="new-playlist" onClick={this.createNewPlaylist}>Create new playlist</Button>
                    </div>
                : null}

            </div>
        );
    }

}

UserPlaylists.contextTypes = {
    parentState: React.PropTypes.object
};

export default UserPlaylists;
