import React, {Component} from 'react';
//import {Link} from 'react-router';
import {Col, Button} from 'react-bootstrap';
import * as refracter from '../refracter';
import TrackList from '../components/TrackList';

class Album extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            album: {}
        }
    }

    componentWillMount() {

        refracter.findTracksByAlbum(this.props.params.artist, this.props.params.album, refracter.userKey).then(albumData => {

            this.setState({
                albumInLibrary: albumData.albumInLibrary,
                album: albumData.info, albumArt: albumData.info.image[4]["#text"] ? albumData.info.image[4]["#text"] : null,
                tracks: albumData.tracks
            });

            //if track deeplink, play matching track
            if (this.props.params.track) {
                for (let track of albumData.tracks ) {
                    if (track.title === this.props.params.track) {
                        this.context.parentState.onTrackClicked(track, albumData.tracks);
                        return;
                    }
                }
            }

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
                        <span className="tag" key={index}> / {tag.name} / </span>
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

                    <Col sm={12} smPush={0} md={10} mdPush={1}>

                        <h1>{this.state.album.name}</h1>

                        <h2>{this.state.album.artist}</h2>

                        {albumTags ? <div className="tags">{albumTags}</div> : null}

                        { this.props.user && !this.state.albumInLibrary
                            ? <Button className="add-album-btn" onClick={() => this.context.parentState.addUserTracks(this.state.tracks)}>Add album to library</Button>
                            : null
                        }

                        { this.state.tracks && this.state.tracks.length > 0 ?
                            <TrackList
                                user={this.props.user}
                                playing={this.props.playing}
                                tracks={this.state.tracks}
                                queueId={this.props.queueId}
                                activeTrack={this.props.activeTrack}
                                updateQueue={this.context.parentState.updateQueue}
                            />
                            : <p>Loading or no tracks in state</p>
                        }

                    </Col>

                </div>
            </div>
        );
    }

}

Album.contextTypes = {
    parentState: React.PropTypes.object
};

export default Album;
