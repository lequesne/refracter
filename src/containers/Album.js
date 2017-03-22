import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {Row, Col, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import TrackList from '../components/TrackList';

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

        refracter.findTracksByAlbum(this.props.params.artist, this.props.params.album, refracter.userKey).then(albumData => {

            this.setState({
                albumInLibrary: albumData.albumInLibrary,
                album: albumData.info, albumArt: albumData.info.image[4]["#text"] ? albumData.info.image[4]["#text"] : null,
                tracks: albumData.tracks
            });

            //if track name is passed as url param, play this track on load
            if (this.props.params.track) {
                for (let track of albumData.tracks ) {
                    if (track.title === this.props.params.track) {
                        //play track from url
                        this.context.parentState.updateQueue(track, albumData.tracks);
                        //scroll to active track on load
                        document.querySelectorAll(`[data-track-id~="${track.trackID}"]`)[0].scrollIntoView();
                        return;
                    }
                }
            }

        }).catch(err => {
            //TODO show error to use and redirect
            browserHistory.push(`/artist/${this.props.params.artist}`);

            console.log('ERROR RETURNED: ', err);
        });

    }

    addAlbumToUser(playlistID){
        //pass optional playlist id if added to playlist
        playlistID = playlistID ? playlistID : '';

        refracter.addUserTracks(refracter.userKey, this.state.tracks, playlistID).then(response => {

            console.log('Album added to library: ', response);

            //let addContext = playlistID ? playlistID : null;

            toast(`${this.state.album.name} was added to your library.`, {
              type: toast.TYPE.SUCCESS
            });

            this.setState({
                albumInLibrary: true
            });

        }).catch(err => {
            console.log('ERROR RETURNED: ', err);
        });
    }

    render() {

        let albumTags;
        if ( this.state.album.tags ) {
            albumTags = this.state.album.tags.tag.map((tag, index) => {
                if ( tag.name !== 'albums I own' ) {
                    return (
                        <span className="tag" key={index}> #{tag.name} </span>
                    )
                } else {
                    return null;
                }
            });
        }

        return (
            <div className="album page">

                <div className="background-art" style={{backgroundImage: `url(${this.state.albumArt})`}}></div>

                <div className="container">

                    <Row>

                        <Col md={12} mdPush={0} lg={10} lgPush={1} >

                            <div className="album-info">
                                <img className="album-art" src={this.state.albumArt}/>
                                <h1>{this.state.album.name}</h1>

                                <h2><Link to={`/artist/${encodeURIComponent(this.state.album.artist)}`}>{this.state.album.artist}</Link></h2>

                                {albumTags ? <div className="tags">{albumTags}</div> : null}

                                { this.props.user && !this.state.albumInLibrary
                                    ? <Button className="add-album-btn" onClick={()=>this.addAlbumToUser()}>Add album to library</Button>
                                    : null
                                }
                            </div>

                            <div className="card">

                                { this.state.tracks.length > 0 ?
                                    <TrackList
                                        isAlbum={this.state.album.name}
                                        existsInLibrary={this.state.albumInLibrary}
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

                        </Col>

                    </Row>

                </div>
            </div>
        );
    }

}

Album.contextTypes = {
    parentState: React.PropTypes.object
};

export default Album;
