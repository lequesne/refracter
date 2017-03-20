import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {ContextMenu, MenuItem, ContextMenuTrigger, SubMenu} from "react-contextmenu";

class TrackList extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            sortName: this.props.defaultSortName
                ? this.props.defaultSortName
                : 'number',
            sortOrder: this.props.defaultSortOrder
                ? this.props.defaultSortOrder
                : 'desc',
            tracks: this.props.tracks,
            selectedTracks: []
        };

        //bindings
        this.playTrack = this.playTrack.bind(this);
        this.activeTrackClass = this.activeTrackClass.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.addSelectedTracksToUser = this.addSelectedTracksToUser.bind(this);
        this.removeSelectedTracksForUser = this.removeSelectedTracksForUser.bind(this);
        this.updateTrackListStateAfterDelete = this.updateTrackListStateAfterDelete.bind(this);
        this.trackContextOpen = this.trackContextOpen.bind(this);
        this.handleContextPlayTrack = this.handleContextPlayTrack.bind(this);

    }

    componentWillMount() {
        this.setState({queueId: this.props.queueId});
    }

    componentDidMount() {
        //run initial sort based off initial state/props
        this.onSortChange(this.state.sortName, this.state.sortOrder);
    }

    playTrack(track) {
        this.props.updateQueue(track, this.state.tracks);
    }

    selectTrack(event, selectedTrack, clickedIndex) {


        //select tracks based off click, ctrl click, and shift click
        if ( event.ctrlKey ) {
            //ctrl multiple select
            this.state.tracks[clickedIndex].selected = true;

        } else if (!event.ctrlKey && !event.shiftKey) {

            if ( this.context.contextMenuOpened ) {
                //track was right clicked

                if ( !this.state.tracks[clickedIndex].selected ) {
                    //clicked track is not already already selected
                    for (let [i, track] of this.state.tracks.entries()) {
                        if ( i === clickedIndex ) {
                            track.selected = true;
                        } else {
                            track.selected = false;
                        }
                    }
                }

            } else {
                //track was left clicked
                for (let [i, track] of this.state.tracks.entries()) {
                    if ( i === clickedIndex ) {
                        track.selected = true;
                    } else {
                        track.selected = false;
                    }
                }
            }

        } else if ( event.shiftKey && !event.ctrlKey ){
            //shift click
            if ( clickedIndex > this.state.lastClickedTrackIndex ) {
                for (let [i, track] of this.state.tracks.entries()) {
                    if (i >= this.state.lastClickedTrackIndex && i <= clickedIndex) {
                        track.selected = true;
                    } else {
                        track.selected = false;
                    }
                }
            } else if (clickedIndex < this.state.lastClickedTrackIndex) {
                for (let [i, track] of this.state.tracks.entries()) {
                    if (i >= clickedIndex && i <= this.state.lastClickedTrackIndex) {
                        track.selected = true;
                    } else {
                        track.selected = false;
                    }
                }
            }
        }

        //push selected tracks to a selected tracks array in state
        let selectedTracks = [];
        for (let track of this.state.tracks) {
            if ( track.selected )
                selectedTracks.push(track);
        }

        //update selected tracks in state
        this.setState({
            lastClickedTrackIndex: clickedIndex,
            tracks: this.state.tracks,
            selectedTracks: selectedTracks
        });

    }

    trackContextOpen(event, data, element){
        this.context.contextMenuOpened = true;
        document.elementFromPoint(event.detail.position.x, event.detail.position.y).click();
        this.context.contextMenuOpened = false;
    }

    addSelectedTracksToUser(playlistID, playlistName){
        //pass playlist id and name if adding to playlist

        playlistID = playlistID ? playlistID : '';
        playlistName = playlistName ? playlistName : '';

        if ( this.state.selectedTracks && this.state.selectedTracks.length > 0 ) {
            refracter.addUserTracks(refracter.userKey, this.state.selectedTracks, playlistID, playlistName).then(response => {

                if ( response.success ) {
                    //show toast
                    console.log('Tracks added to library or playlist: ', response);
                }

            }).catch(err => {
                console.log('ERROR RETURNED: ', err);
            });
        }

    }

    removeSelectedTracksForUser(playlistID){
        //pass playlist id if removing from playlist

        playlistID = playlistID ? playlistID : '';

        if ( this.state.selectedTracks && this.state.selectedTracks.length > 0 ) {
            refracter.removeUserTracks(refracter.userKey, this.state.selectedTracks, playlistID).then(response => {

                if ( response.success ) {
                    //show toast
                    console.log('Tracks removed from library or playlist: ', response);
                    //update state
                    this.updateTrackListStateAfterDelete();
                }

            }).catch(err => {
                console.log('ERROR RETURNED: ', err);
            });
        }
    }

    updateTrackListStateAfterDelete(){
        for ( let i = this.state.tracks.length -1; i >= 0 ; i-- ){
            if ( this.state.tracks[i].selected ) {
                this.state.tracks.splice(i,1);
            }
        }
        this.setState({
            tracks: this.state.tracks
        });
    }

    onSort(sortName) {

        let sortOrder = this.state.sortOrder === 'desc'
            ? 'asc'
            : 'desc';

        this.setState({sortName: sortName, sortOrder: sortOrder});

        this.onSortChange(sortName, sortOrder);
    }

    onSortChange(sortName, sortOrder) {

        //first sort list based off provided sortName
        let tracks = this.state.tracks;
        let albums = {};
        let sortedByAlbumTrackData = [];
        let sortedTrackList;

        for (let track of tracks ) {

            //sort numbers
            if (sortName === 'number' || sortName === 'duration') {

                if (sortOrder === 'desc') {
                    tracks.sort(function(a, b) {
                        return a[sortName] - b[sortName];
                    });
                } else if (sortOrder === 'asc') {
                    tracks.sort(function(a, b) {
                        return b[sortName] - a[sortName];
                    });
                }

            }

            //sort alpha
            if (sortName === 'title' || sortName === 'album' || sortName === 'artist') {

                if (sortOrder === 'desc') {
                    tracks.sort(function(a, b) {
                        if (a[sortName] < b[sortName])
                            return -1;
                        if (a[sortName] > b[sortName])
                            return 1;
                        return 0;
                    });
                } else if (sortOrder === 'asc') {
                    tracks.sort(function(a, b) {
                        if (b[sortName] < a[sortName])
                            return -1;
                        if (b[sortName] > a[sortName])
                            return 1;
                        return 0;
                    });
                }

            }

        }

        if (sortName === 'album' || sortName === 'artist') {

            for (let track of tracks) {
                //album and artist track number retainer
                //moves freshly sorted tracks into album groups
                if (sortName === 'album' || sortName === 'artist') {

                    if (albums[track.album] && albums[track.album].length > 0) {
                        albums[track.album].push(track);
                    } else {
                        //not the same as last track album so create new album array for this
                        albums[track.album] = [];
                        albums[track.album].push(track);
                    }

                }

            }

            //sort each album array by track number
            Object.keys(albums).forEach(function(key, index) {
                let album = albums[key];
                //sort each album by track numbers
                album.sort(function(a, b) {
                    return parseInt(a.number) - parseInt(b.number);
                });
                //stitch albums back to together
                for (let track of album) {
                    sortedByAlbumTrackData.push(track);
                }
            });

        }

        //set sorted track data to sorted album data if applicable or regular sorted tracks
        sortedTrackList = sortedByAlbumTrackData.length === 0
            ? tracks
            : sortedByAlbumTrackData

        //set sorted tracks in state
        this.setState({tracks: sortedTrackList})
        //update app queue with newly sorted tracklist
        this.props.updateQueue(null, sortedTrackList);
    }

    activeTrackClass(track) {
        if (this.props.activeTrack) {
            //NOTE come back and test it works correctly with lists that share the same track id (should only be active on original queue)
            //if ( this.state.queueId === this.props.queueId ) {
            return track.trackID === this.props.activeTrack.trackID
                ? 'active-track'
                : '';
            //}
        }
    }

    handleContextPlayTrack(event, track, element){
        if ( track )
            this.playTrack(track);
    }

    handleContextAddToPlaylist(event, data, element){
        console.log(data);
    }

    render() {

        const playIconClass = this.props.playing
            ? 'play-icon ion-play equalizer'
            : 'play-icon ion-play';
        let sortAscIcon = <span className="sort-icon ion-arrow-up-b"></span>;
        let sortDescIcon = <span className="sort-icon ion-arrow-down-b"></span>;

        return (
            <div className="track-list">

                <ContextMenu id="track-context" onShow={this.trackContextOpen}>
                    <MenuItem onClick={this.handleContextPlayTrack}>
                        Play Track
                    </MenuItem>
                    <MenuItem onClick={this.handleContextChangeSource}>
                        Change source
                    </MenuItem>
                    <MenuItem divider/>
                    { this.props.playlistID ?
                    <MenuItem onClick={()=>this.removeSelectedTracksForUser(this.props.playlistID)}>
                        Remove
                        {this.state.selectedTracks.length > 1 ? ` ${this.state.selectedTracks.length} tracks ` : ' '}
                        from playlist
                    </MenuItem>
                    : null
                    }
                    { this.props.isLibrary || this.props.existsInLibrary ?
                    <MenuItem onClick={()=>this.removeSelectedTracksForUser()}>
                        Remove
                        {this.state.selectedTracks.length > 1 ? ` ${this.state.selectedTracks.length} tracks ` : ' '}
                        from library
                    </MenuItem>
                    :
                    <MenuItem onClick={()=>this.addSelectedTracksToUser()}>
                        Add
                        {this.state.selectedTracks.length > 1 ? ` ${this.state.selectedTracks.length} tracks ` : ' '}
                        to library
                    </MenuItem>
                    }
                    <SubMenu title='Add to playlist'>
                        <MenuItem onClick={this.handleContextNewPlaylist}>
                            New playlist
                        </MenuItem>
                        {this.props.user.playlists.map((playlist, playlistIndex) => {
                            return (
                                <MenuItem key={playlistIndex} onClick={()=>this.addSelectedTracksToUser(playlist.id, playlist.name)}>
                                    {playlist.name}
                                </MenuItem>
                            )
                        })}
                    </SubMenu>
                </ContextMenu>

                {this.state.tracks && this.state.tracks.length > 0
                    ? <Table>
                            <thead>
                                <tr>
                                    <th className="play-btn-col"></th>
                                    {this.props.isLibrary
                                        ? <th className="number-col">#</th>
                                        : <th className="number-col pointer" onClick={() => this.onSort('number')}>
                                            {this.state.sortName === 'number' && this.state.sortOrder === 'asc'
                                                ? sortAscIcon
                                                : null}
                                            {this.state.sortName === 'number' && this.state.sortOrder === 'desc'
                                                ? sortDescIcon
                                                : null}
                                            #
                                        </th>
                                    }
                                    <th className="name-col pointer" onClick={() => this.onSort('title')}>
                                        {this.state.sortName === 'title' && this.state.sortOrder === 'asc'
                                            ? sortAscIcon
                                            : null}
                                        {this.state.sortName === 'title' && this.state.sortOrder === 'desc'
                                            ? sortDescIcon
                                            : null}
                                        Name
                                    </th>
                                    {!this.props.isLibrary
                                        ? <th className="album-col">Album</th>
                                        : <th className="album-col pointer" onClick={() => this.onSort('album')}>
                                            {this.state.sortName === 'album' && this.state.sortOrder === 'asc'
                                                ? sortAscIcon
                                                : null}
                                            {this.state.sortName === 'album' && this.state.sortOrder === 'desc'
                                                ? sortDescIcon
                                                : null}
                                            Album
                                        </th>
                                    }
                                    {!this.props.isLibrary
                                        ? <th className="artist-col">Artist</th>
                                        : <th className="artist-col pointer" onClick={() => this.onSort('artist')}>
                                            {this.state.sortName === 'artist' && this.state.sortOrder === 'asc'
                                                ? sortAscIcon
                                                : null}
                                            {this.state.sortName === 'artist' && this.state.sortOrder === 'desc'
                                                ? sortDescIcon
                                                : null}
                                            Artist
                                        </th>
                                    }
                                    <th className="duration-col pointer" onClick={() => this.onSort('duration')}>
                                        {this.state.sortName === 'duration' && this.state.sortOrder === 'asc'
                                            ? sortAscIcon
                                            : null}
                                        {this.state.sortName === 'duration' && this.state.sortOrder === 'desc'
                                            ? sortDescIcon
                                            : null}
                                        Duration
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tracks.map((track, trackIndex) => {
                                    let activeClass = this.props.activeTrack && track.trackID === this.props.activeTrack.trackID
                                        ? 'active-track'
                                        : '';
                                    let selectedClass = track.selected
                                        ? 'selected-track'
                                        : '';
                                    let trackClasses = `${activeClass} ${selectedClass}`;
                                    return (
                                        <ContextMenuTrigger
                                            renderTag={'tr'}
                                            id="track-context"
                                            key={trackIndex}
                                            attributes={{
                                                className: trackClasses,
                                                onClick: (event) => this.selectTrack(event, track, trackIndex),
                                                onDoubleClick: () => this.playTrack(track)
                                            }}
                                            collect={()=>{
                                                return track;
                                            }}
                                            >
                                                <td className={`play-btn-col ${playIconClass}`} onClick={() => this.playTrack(track)}></td>
                                                <td className="number-col">{track.number}</td>
                                                <td className="name-col">{track.title}</td>
                                                <td className="album-col">{track.album}</td>
                                                <td className="artist-col">{track.artist}</td>
                                                <td className="duration-col">{refracter.secondsToMinutes(track.duration)}</td>
                                        </ContextMenuTrigger>
                                    )
                                })}
                            </tbody>
                        </Table>

                    : null}
            </div>

        );
    }

}

TrackList.contextTypes = {
    parentState: React.PropTypes.object
};

export default TrackList;
