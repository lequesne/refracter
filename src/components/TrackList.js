import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Table, Col, Button} from 'react-bootstrap';

class TrackList extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            sortName: this.props.defaultSortName ? this.props.defaultSortName : 'number',
            sortOrder: this.props.defaultSortOrder ? this.props.defaultSortOrder : 'desc',
            tracks: this.props.tracks
        };

        //bindings
        this.trackPlayButtonClicked = this.trackPlayButtonClicked.bind(this);
        this.trackClicked = this.trackClicked.bind(this);
        this.playTrack = this.playTrack.bind(this);
        this.activeTrackClass = this.activeTrackClass.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            queueId: this.props.queueId
        });
    }

    componentDidMount(){
        //run initial sort based off initial state/props
        this.onSortChange(this.state.sortName,this.state.sortOrder);
    }

    trackPlayButtonClicked(track){
        console.log(track);
    }

    trackClicked(track) {
        //select track
    }

    playTrack(track) {
        this.props.updateQueue(track, this.state.tracks);
    }

    onSort(sortName){

        let sortOrder = this.state.sortOrder === 'desc' ? 'asc' : 'desc';

        this.setState({
            sortName: sortName,
            sortOrder: sortOrder
        });

        this.onSortChange(sortName, sortOrder);
    }

    onSortChange(sortName, sortOrder) {

        //first sort list based off provided sortName
        let tracks = this.state.tracks;
        let albums = {};
        let sortedByAlbumTrackData = [];
        let sortedTrackList;

        for (let [index, track] of tracks.entries() ) {

            //sort numbers
            if ( sortName === 'number' || sortName === 'duration' ) {

                if ( sortOrder === 'desc' ) {
                    tracks.sort(function(a, b) {
                        return a[sortName] - b[sortName];
                    });
                } else if ( sortOrder === 'asc' ) {
                    tracks.sort(function(a, b) {
                        return b[sortName] - a[sortName];
                    });
                }

            }

            //sort alpha
            if ( sortName === 'title' || sortName === 'album' || sortName === 'artist' ) {

                if ( sortOrder === 'desc' ) {
                    tracks.sort(function(a, b) {
                        if(a[sortName] < b[sortName]) return -1;
                        if(a[sortName] > b[sortName]) return 1;
                        return 0;
                    });
                } else if ( sortOrder === 'asc' ) {
                    tracks.sort(function(a, b) {
                        if(b[sortName] < a[sortName]) return -1;
                        if(b[sortName] > a[sortName]) return 1;
                        return 0;
                    });
                }

            }

        }

        if ( sortName === 'album' || sortName === 'artist' ) {

            for (let [index, track] of tracks.entries() ) {
                //album and artist track number retainer
                //moves freshly sorted tracks into album groups
                if ( sortName === 'album' || sortName === 'artist' ) {

                    if ( albums[track.album] && albums[track.album].length > 0 ) {
                        albums[track.album].push(track);
                    } else {
                        //not the same as last track album so create new album array for this
                        albums[track.album] = [];
                        albums[track.album].push(track);
                    }

                }

            }

            //sort each album array by track number
            Object.keys(albums).forEach(function(key,index) {
                let album = albums[key];
                //sort each album by track numbers
                album.sort(function(a,b){
                    return parseInt(a.number) - parseInt(b.number);
                });
                //stitch albums back to together
                for ( let track of album ) {
                    sortedByAlbumTrackData.push(track);
                }
            });

        }

        //set sorted track data to sorted album data if applicable or regular sorted tracks
        sortedTrackList = sortedByAlbumTrackData.length === 0 ? tracks : sortedByAlbumTrackData

        //set sorted tracks in state
        this.setState({
            tracks: sortedTrackList
        })
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

    render() {

        const playIconClass = this.props.playing ? 'play-icon ion-play equalizer' : 'play-icon ion-play';
        let sortAscIcon = <span className="sort-icon ion-arrow-up-b"></span>;
        let sortDescIcon = <span className="sort-icon ion-arrow-down-b"></span>;

        return (
            <div className="track-list">

                {this.state.tracks && this.state.tracks.length > 0 ?

                <Table>
                    <thead>
                        <tr>
                            <th className="play-btn-col"></th>
                            { this.props.librarySort
                            ?   <th className="number-col">#</th>
                            :   <th className="number-col pointer" onClick={()=>this.onSort('number')}>
                                    {this.state.sortName==='number'&&this.state.sortOrder==='asc'?sortAscIcon:null}
                                    {this.state.sortName==='number'&&this.state.sortOrder==='desc'?sortDescIcon:null}
                                    #
                                </th>
                            }
                            <th className="name-col pointer" onClick={()=>this.onSort('title')}>
                                {this.state.sortName==='title'&&this.state.sortOrder==='asc'?sortAscIcon:null}
                                {this.state.sortName==='title'&&this.state.sortOrder==='desc'?sortDescIcon:null}
                                Name
                            </th>
                            { !this.props.librarySort
                            ?   <th className="album-col">Album</th>
                            :   <th className="album-col pointer" onClick={()=>this.onSort('album')}>
                                    {this.state.sortName==='album'&&this.state.sortOrder==='asc'?sortAscIcon:null}
                                    {this.state.sortName==='album'&&this.state.sortOrder==='desc'?sortDescIcon:null}
                                    Album
                                </th>
                            }
                            { !this.props.librarySort
                            ?   <th className="artist-col">Artist</th>
                            :    <th className="artist-col pointer" onClick={()=>this.onSort('artist')}>
                                    {this.state.sortName==='artist'&&this.state.sortOrder==='asc'?sortAscIcon:null}
                                    {this.state.sortName==='artist'&&this.state.sortOrder==='desc'?sortDescIcon:null}
                                    Artist
                                </th>
                            }
                            <th className="duration-col pointer" onClick={()=>this.onSort('duration')}>
                                {this.state.sortName==='duration'&&this.state.sortOrder==='asc'?sortAscIcon:null}
                                {this.state.sortName==='duration'&&this.state.sortOrder==='desc'?sortDescIcon:null}
                                Duration
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.tracks.map((track, trackIndex) => {
                            return (
                                <tr key={trackIndex} onDoubleClick={()=>this.playTrack(track)} className={this.props.activeTrack&&track.trackID===this.props.activeTrack.trackID ? 'active-track' : null}>
                                    <td className={`play-btn-col ${playIconClass}`} onClick={()=>this.playTrack(track)}></td>
                                    <td className="number-col">{track.number}</td>
                                    <td className="name-col">{track.title}</td>
                                    <td className="album-col">{track.album}</td>
                                    <td className="artist-col">{track.artist}</td>
                                    <td className="duration-col">{refracter.secondsToMinutes(track.duration)}</td>
                                </tr>
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
