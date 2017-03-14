import React, {Component} from 'react';
//import {Link} from 'react-router';
import {Col} from 'react-bootstrap';
import * as refracter from '../refracter';
import TrackList from '../components/TrackList';

class Album extends Component {

    constructor(props) {
        super(props);

        //set initial state
        this.state = {
            album: {},
            tracks: {}
        }
    }

    componentWillMount() {

        //console.log(this.context.parentState);

        refracter.findTracksByAlbum(this.props.params.artist, this.props.params.album).then(albumData => {

            this.setState({album: albumData.info, albumArt: albumData.info.image[4]["#text"]
                    ? albumData.info.image[4]["#text"]
                    : null,
                tracks: albumData.tracks
            });

            //if track deeplink, play matching track
            if (this.props.params.track) {
                for (let [i,track]of albumData.tracks.entries()) {
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

                        {albumTags ? albumTags : null}

                        <TrackList
                            playing={this.props.playing}
                            tracks={this.state.tracks}
                            queueId={this.props.queueId}
                            activeTrack={this.props.activeTrack}
                            onTrackDoubleClick={this.context.parentState.onTrackClicked}
                        />

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
