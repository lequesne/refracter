import * as refracter from '../refracter';
import React, {Component} from 'react';
import { Link } from 'react-router';
import {Table} from 'react-bootstrap';
import {ContextMenu, MenuItem, ContextMenuTrigger, SubMenu} from "react-contextmenu";
import {toast} from 'react-toastify';

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
        this.shuffleTracks = this.shuffleTracks.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.addSelectedTracksToUser = this.addSelectedTracksToUser.bind(this);
        this.removeSelectedTracksForUser = this.removeSelectedTracksForUser.bind(this);
        this.updateTrackListStateAfterDelete = this.updateTrackListStateAfterDelete.bind(this);
        this.trackContextOpen = this.trackContextOpen.bind(this);
        this.handleContextPlayTrack = this.handleContextPlayTrack.bind(this);

        this.dragNdropInit = this.dragNdropInit.bind(this);
        this.dragNdropStart = this.dragNdropStart.bind(this);
        this.dragNdropMove = this.dragNdropMove.bind(this);
        this.dragNdropEnd = this.dragNdropEnd.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        //condition for playlist page where the component does not remount on changing playlists
        if ( nextProps.playlistID ) {
            this.setState({
                tracks: nextProps.tracks
            });
        }

        //if shuffle was enabled and then gets disabled, reset the queue in the app with a fresh list
        if ( !this.props.shuffle && nextProps.shuffle ) {
            this.shuffleTracks();
        } else if ( this.props.shuffle && !nextProps.shuffle ) {
            this.onSortChange(this.state.sortName, this.state.sortOrder);
        }
    }

    componentDidMount() {
        //run initial sort based off initial state/props
        if ( this.props.shuffle ) {
            this.shuffleTracks();
        } else {
            this.onSortChange(this.state.sortName, this.state.sortOrder, true);
        }
    }

    componentDidUpdate(){
        this.dragNdropInit();
    }

    dragNdropInit(){
        //window bindings for dragNdrop mouse events
        window.addEventListener('mousemove',this.dragNdropMove);
        window.addEventListener('mouseup',this.dragNdropEnd);
    }

    dragNdropStart(event){
        this.context.rdyForDrag = true;
        this.context.dragStartX = event.pageX;
        this.context.dragStartY = event.pageY;
    }

    dragNdropMove(event){
        let offsetAmount = 10; //amount of movment needed from origin coord to start the drag
        let inputX = event.pageX;
        let inputY = event.pageY;

        //check to start drag
        if ( this.context.rdyForDrag ) {
            if ( inputX > this.context.dragStartX + offsetAmount || inputX < this.context.dragStartX - offsetAmount ||
                 inputY > this.context.dragStartY + offsetAmount || inputY < this.context.dragStartY - offsetAmount ) {

                //set context dragging variable
                this.context.isDragging = true;

                //apply drag class to html
                document.getElementsByTagName('html')[0].classList.add('dragNdrop-isDragging');

                //position and show drag preview
                this.setState({
                    dragNdrop: true,
                    dragNdropX: inputX + 5,
                    dragNdropY: inputY + 5
                });

                //drop area hover detection
                [].forEach.call(document.getElementsByClassName('dragNdrop-droppable'), function(el) {
                    el.classList.remove('dragNdrop-hover');
                });
                if (document.elementFromPoint(inputX, inputY).classList.contains('dragNdrop-droppable')) {
                    document.elementFromPoint(inputX, inputY).classList.add('dragNdrop-hover');
                }

            }
        }
    }

    dragNdropEnd(event){

        //only if items have been dragged
        if (this.context.rdyForDrag){

            //remove drag class from html
            document.getElementsByTagName('html')[0].classList.remove('dragNdrop-isDragging');
            //remove dragHover classes from droppable elements
            [].forEach.call(document.getElementsByClassName('dragNdrop-droppable'), function(el) {
                el.classList.remove('dragNdrop-hover');
            });

            if ( this.context.isDragging ) {
                let dropElement = document.elementFromPoint(event.pageX, event.pageY);

                //drop area detection
                if (dropElement.classList.contains('dragNdrop-droppable')) {
                    if ( dropElement.dataset.dragNdropAddTracks ) {
                        //dropped onto add tracks, add to tracks
                        if ( dropElement.dataset.playlistId && dropElement.dataset.playlistName ) {
                            this.addSelectedTracksToUser(dropElement.dataset.playlistId, dropElement.dataset.playlistName);
                        } else {
                            this.addSelectedTracksToUser();
                        }
                    }
                }
            }

            //reset dragNdrop variables and state
            this.context.rdyForDrag = false;
            this.context.isDragging = false;
            this.context.dragStartX = null;
            this.context.dragStartY = null;

            this.setState({
                dragNdrop: false,
                dragNdropX: null,
                dragNdropY: null
            })
        }
    }

    playTrack(track) {
        if ( this.props.activeTrack && track.trackID === this.props.activeTrack.trackID ) {
            //toggle play/pause
            this.props.playPauseTrack();
        } else {
            //newly clicked track, update active track and queue
            this.props.updateQueue(track, this.state.tracks, location.pathname);
        }
    }

    shuffleTracks(){

        let shuffledTracks = refracter.shuffleArray( this.state.tracks );

        this.setState({
            tracks: shuffledTracks
        });

        this.props.updateQueue(null, shuffledTracks);
    }

    selectTrack(event, selectedTrack, clickedIndex, mouseUp) {

        //set dragNdrop context
        this.context.rdyForDrag = true;
        this.context.dragStartX = event.pageX;
        this.context.dragStartY = event.pageY;

        let stateTracks = this.state.tracks;

        //select tracks based off click, ctrl click, and shift click
        if (event.ctrlKey) {
            //ctrl multiple select
            stateTracks[clickedIndex].selected = true;

        } else if (!event.ctrlKey && !event.shiftKey) {

            if ( event.button === 2 ) {
                //track was right clicked

                if (!stateTracks[clickedIndex].selected) {
                    //clicked track is not already already selected
                    for (let [i,track]of stateTracks.entries()) {
                        if (i === clickedIndex) {
                            track.selected = true;
                        } else {
                            track.selected = false;
                        }
                    }
                }

            } else {
                //track was left clicked

                if ( mouseUp && !this.context.isDragging ) {

                    //every track is already selected
                    for (let [i,track]of stateTracks.entries()) {

                        if (i === clickedIndex ) {
                            track.selected = true;
                        } else {
                            track.selected = false;
                        }

                    }

                } else{
                    //normal track select

                    if (!stateTracks[clickedIndex].selected) {
                        for (let [i,track]of stateTracks.entries()) {

                            if (i === clickedIndex ) {
                                track.selected = true;
                            } else {
                                track.selected = false;
                            }

                        }
                    }

                }

            }

        } else if (event.shiftKey && !event.ctrlKey) {
            //shift click
            if (clickedIndex > this.state.lastClickedTrackIndex) {
                for (let [i,track]of stateTracks.entries()) {
                    if (i >= this.state.lastClickedTrackIndex && i <= clickedIndex) {
                        track.selected = true;
                    } else {
                        track.selected = false;
                    }
                }
            } else if (clickedIndex < this.state.lastClickedTrackIndex) {
                for (let [i,track]of stateTracks.entries()) {
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
        for (let track of stateTracks) {
            if (track.selected)
                selectedTracks.push(track);
            }

        //update selected tracks in state
        this.setState({
            lastClickedTrackIndex: clickedIndex,
            tracks: stateTracks,
            selectedTracks: selectedTracks
        });

    }

    trackContextOpen(event, data, element) {
        this.context.contextMenuOpened = true;
        document.elementFromPoint(event.detail.position.x, event.detail.position.y).click();
        this.context.contextMenuOpened = false;
    }

    addSelectedTracksToUser(playlistID, playlistName) {
        //pass playlist id and name if adding to playlist

        playlistID = playlistID
            ? playlistID
            : '';
        playlistName = playlistName
            ? playlistName
            : '';

        if (this.state.selectedTracks && this.state.selectedTracks.length > 0) {
            refracter.addUserTracks(refracter.userKey, this.state.selectedTracks, playlistID, playlistName).then(response => {

                if (response.success) {
                    //show toast

                    let addContext = playlistName && playlistID ? playlistName : 'library';

                    toast(`${this.state.selectedTracks.length} track${this.state.selectedTracks.length>1?'s were':' was'} added to ${addContext}.`, {
                      type: toast.TYPE.SUCCESS
                    });
                    console.log('Tracks added to library or playlist: ', response);
                }

            }).catch(err => {
                console.log('ERROR RETURNED: ', err);
            });
        }

    }

    removeSelectedTracksForUser(playlistID, playlistName) {
        //pass playlist id if removing from playlist

        playlistID = playlistID
            ? playlistID
            : '';

        playlistName = playlistName
            ? playlistName
            : '';

        if (this.state.selectedTracks && this.state.selectedTracks.length > 0) {
            refracter.removeUserTracks(refracter.userKey, this.state.selectedTracks, playlistID, playlistName).then(response => {

                if (response.success) {
                    //show toast
                    let addContext = playlistName ? playlistName : 'library';
                    toast(`${this.state.selectedTracks.length} track${this.state.selectedTracks.length>1?'s where':' was'} removed from ${addContext}.`, {
                      type: toast.TYPE.SUCCESS
                    });
                    console.log('Tracks removed from library or playlist: ', response);
                    //update state
                    if ( !this.props.isAlbum ) {
                        this.updateTrackListStateAfterDelete();
                    }

                }

            }).catch(err => {
                console.log('ERROR RETURNED: ', err);
            });
        }
    }

    updateTrackListStateAfterDelete() {
        for (let i = this.state.tracks.length - 1; i >= 0; i--) {
            if (this.state.tracks[i].selected) {
                this.state.tracks.splice(i, 1);
            }
        }
        this.setState({tracks: this.state.tracks});
    }

    onSort(sortName) {

        let sortOrder = this.state.sortOrder === 'desc'
            ? 'asc'
            : 'desc';

        this.setState({sortName: sortName, sortOrder: sortOrder});

        this.onSortChange(sortName, sortOrder);
    }

    onSortChange(sortName, sortOrder, isInitialSort) {

        //first sort list based off provided sortName
        let tracks = this.state.tracks;
        let albums = {};
        let sortedByAlbumTrackData = [];
        let sortedTrackList;

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

        //special sort for artists and album to retain album orders
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
                    return Number(a.number) - Number(b.number);
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
        if ( !isInitialSort ) {
            this.props.updateQueue(null, sortedTrackList);
        }
    }

    handleContextPlayTrack(event, track, element) {
        if (track)
            this.playTrack(track);
    }

    render() {

        // const playIconClass = this.props.playing
        //     ? 'play-icon equalizer'
        //     : 'play-icon refracter-play';
        let sortAscIcon = <span className="sort-icon refracter-arrow-up-b"></span>;
        let sortDescIcon = <span className="sort-icon refracter-arrow-down-b"></span>;

        let dragNdropPreviewStyle = {
            display: this.state.dragNdrop ? 'block' : 'none',
            left: this.state.dragNdropX ? this.state.dragNdropX : '0',
            top: this.state.dragNdropY ? this.state.dragNdropY : '0'
        }

        let trackListSource;
        if ( this.props.playlistName ) {
            trackListSource = this.props.playlistName;
        } else if ( this.props.isLibrary ) {
            trackListSource = 'library';
        } else if ( this.props.isAlbum ) {
            trackListSource = this.props.isAlbum;
        }

        let playPauseContextMenuLabal = 'Play/Pause';
        // if ( this.props.activeTrack && this.state.selectedTracks && this.props.activeTrack.trackID === this.state.selectedTracks[this.state.selectedTracks.length - 1].trackID ) {
        //     playPauseContextMenuLabal = this.props.playing ? 'Pause Track' : 'Play Track';
        // } else {
        //     playPauseContextMenuLabal = 'Play Track';
        // }

        return (
            <div className="track-list">

                <div className="dragNdrop-preview" style={dragNdropPreviewStyle}>
                    { this.state.selectedTracks.length === 1
                        ? this.state.selectedTracks[0].title
                        : `${this.state.selectedTracks.length} tracks from ${trackListSource}`
                    }
                </div>

                <ContextMenu id="track-context" onShow={this.trackContextOpen}>
                    <MenuItem onClick={this.handleContextPlayTrack}>
                        {playPauseContextMenuLabal}
                    </MenuItem>
                    {/* <MenuItem onClick={this.handleContextChangeSource}>
                        Change source
                    </MenuItem> */}
                    <MenuItem divider/>
                    {this.props.playlistID
                        ? <MenuItem onClick={() => this.removeSelectedTracksForUser(this.props.playlistID,this.props.playlistName)}>
                                Remove {this.state.selectedTracks.length > 1
                                    ? ` ${this.state.selectedTracks.length} tracks `
                                    : ' '}
                                from {this.props.playlistName}
                            </MenuItem>
                        : null
                    }
                    {this.props.isLibrary || this.props.existsInLibrary
                        ? <MenuItem onClick={() => this.removeSelectedTracksForUser()}>
                                Remove {this.state.selectedTracks.length > 1
                                    ? ` ${this.state.selectedTracks.length} tracks `
                                    : ' '}
                                from library
                            </MenuItem>
                        : <MenuItem onClick={() => this.addSelectedTracksToUser()}>
                            Add {this.state.selectedTracks.length > 1
                                ? ` ${this.state.selectedTracks.length} tracks `
                                : ' '}
                            to library
                        </MenuItem>
                    }
                    <SubMenu title='Add to playlist'>
                        {/*
                        TODO add new playlist creation trigger and pass tracks to be added
                        <MenuItem onClick={this.handleContextNewPlaylist}>
                            New playlist
                        </MenuItem> */}
                        {this.props.user ? this.props.user.playlists.map((playlist, playlistIndex) => {
                            return (
                                <MenuItem key={playlistIndex} onClick={() => this.addSelectedTracksToUser(playlist.id, playlist.name)}>
                                    {playlist.name}
                                </MenuItem>
                            )
                        }):null}
                    </SubMenu>
                </ContextMenu>

                <Table>
                    <thead>
                        <tr>
                            <th className="play-btn-col"></th>
                            {this.props.isLibrary
                                ? <th className="number-col"><span>#</span></th>
                                : <th className="number-col pointer" onClick={() => this.onSort('number')}>
                                    <span>
                                        {this.state.sortName === 'number' && this.state.sortOrder === 'asc'
                                            ? sortAscIcon
                                            : null}
                                        {this.state.sortName === 'number' && this.state.sortOrder === 'desc'
                                            ? sortDescIcon
                                            : null}
                                        #
                                    </span>
                                </th>
                            }
                            <th className="name-col pointer" onClick={() => this.onSort('title')}>
                                <span>
                                    {this.state.sortName === 'title' && this.state.sortOrder === 'asc'
                                        ? sortAscIcon
                                        : null}
                                    {this.state.sortName === 'title' && this.state.sortOrder === 'desc'
                                        ? sortDescIcon
                                        : null}
                                    Name
                                </span>
                            </th>
                            { this.props.isLibrary || this.props.isPlaylist
                                ? <th className="album-col pointer" onClick={() => this.onSort('album')}>
                                    <span>
                                        {this.state.sortName === 'album' && this.state.sortOrder === 'asc'
                                            ? sortAscIcon
                                            : null}
                                        {this.state.sortName === 'album' && this.state.sortOrder === 'desc'
                                            ? sortDescIcon
                                            : null}
                                        Album
                                    </span>
                                </th>
                                : null
                            }
                            {!this.props.isLibrary
                                ? <th className="artist-col"><span>Artist</span></th>
                                : <th className="artist-col pointer" onClick={() => this.onSort('artist')}>
                                    <span>
                                        {this.state.sortName === 'artist' && this.state.sortOrder === 'asc'
                                            ? sortAscIcon
                                            : null}
                                        {this.state.sortName === 'artist' && this.state.sortOrder === 'desc'
                                            ? sortDescIcon
                                            : null}
                                        Artist
                                    </span>
                                </th>
                            }
                            <th className="duration-col pointer" onClick={() => this.onSort('duration')}>
                                <span>
                                    {this.state.sortName === 'duration' && this.state.sortOrder === 'asc'
                                        ? sortAscIcon
                                        : null}
                                    {this.state.sortName === 'duration' && this.state.sortOrder === 'desc'
                                        ? sortDescIcon
                                        : null}
                                    Duration
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.tracks.map((track, trackIndex) => {

                            let activeClass = '';
                            if ( this.props.queueLocation && this.props.queueLocation === location.pathname ) {
                                if ( this.props.activeTrack && track.trackID === this.props.activeTrack.trackID ) {
                                    activeClass = 'active-track';
                                }
                            }

                            let selectedClass = track.selected
                                ? 'selected-track'
                                : '';

                            let trackClasses = `track-row ${activeClass} ${selectedClass}`;

                            return (
                                <ContextMenuTrigger renderTag={'tr'} id="track-context" key={trackIndex} attributes={{
                                    'data-track-ID': track.trackID,
                                    className: trackClasses,
                                    //onClick: (event) => this.selectTrack(event, track, trackIndex),
                                    onDoubleClick: () => this.playTrack(track)
                                }} collect={() => {
                                    return track;
                                }}>
                                    <td title="Play/Pause"
                                        className={`play-btn-col`}
                                        onClick={() => this.playTrack(track)}
                                        onMouseDown={(event) => this.selectTrack(event, track, trackIndex)}
                                        >
                                        {this.props.playing && this.props.activeTrack.trackID === track.trackID && this.props.queueLocation && this.props.queueLocation === location.pathname
                                        ? <div><div className="equalizer"></div><span className="refracter-pause icon"></span></div>
                                        : <span className="refracter-play icon"></span>
                                        }
                                    </td>
                                    <td title="Number"
                                        className="number-col"
                                        onMouseDown={(event) => this.selectTrack(event, track, trackIndex)}
                                        onMouseUp={(event) => this.selectTrack(event, track, trackIndex, true)}
                                        >
                                        <span>{track.number}</span>
                                    </td>
                                    <td title={track.title}
                                        className="name-col"
                                        onMouseDown={(event) => this.selectTrack(event, track, trackIndex)}
                                        onMouseUp={(event) => this.selectTrack(event, track, trackIndex, true)}
                                        >
                                        <span>{track.title}</span>
                                    </td>
                                    { this.props.isLibrary || this.props.isPlaylist ?
                                        <td title={track.album}
                                            className="album-col"
                                            onMouseDown={(event) => this.selectTrack(event, track, trackIndex)}
                                            onMouseUp={(event) => this.selectTrack(event, track, trackIndex, true)}
                                            >
                                            <span>
                                                {this.props.isAlbum ? track.album : <Link to={`/album/${encodeURIComponent(track.artist)}/${encodeURIComponent(track.album)}`}>{track.album}</Link>}
                                            </span>
                                        </td>
                                        :null
                                    }
                                    <td title={track.artist}
                                        className="artist-col"
                                        onMouseDown={(event) => this.selectTrack(event, track, trackIndex)}
                                        onMouseUp={(event) => this.selectTrack(event, track, trackIndex, true)}
                                        >
                                        <span>
                                        {this.props.isArtist ? track.artist : <Link to={`/artist/${encodeURIComponent(track.artist)}`}>{track.artist}</Link>}
                                        </span>
                                    </td>
                                    <td
                                        className="duration-col"
                                        onMouseDown={(event) => this.selectTrack(event, track, trackIndex)}
                                        onMouseUp={(event) => this.selectTrack(event, track, trackIndex, true)}
                                        >
                                        <span>
                                            {refracter.secondsToMinutes(track.duration)}
                                        </span>
                                    </td>
                                </ContextMenuTrigger>
                            )
                        })}
                    </tbody>
                </Table>
            </div>

        );
    }

}

TrackList.contextTypes = {
    parentState: React.PropTypes.object
};

export default TrackList;
