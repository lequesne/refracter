import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Col, Button} from 'react-bootstrap';
import TrackList from '../components/TrackList';

class Artist extends Component {

    constructor(props){
        super(props);
        console.log(props.params.artist);

        this.state = {
        }

        this.loadArtist = this.loadArtist.bind(this);
    }

    componentWillMount(){
        this.loadArtist();
    }

    loadArtist(){

        refracter.getArtistInfo(this.props.params.artist).then(artistData => {
            console.log('Artist info: ', artistData);
            this.setState(artistData);

        }).catch(err => {
            console.log('ERROR RETURNED: ', err);
        });

    }

    render() {

        let artistTags;
        if ( this.state.tags ) {
            artistTags = this.state.tags.tag.map((tag, index) => {
                return (
                    <span className="tag" key={index}>  #{tag.name} </span>
                )
            });
        }

        return (
            <div className="artist page">

                <div className="background-art" style={{backgroundImage: `url(${this.state.image?this.state.image[3]["#text"]:null})`}}></div>

                <div className="container">

                    <Col sm={12} smPush={0} md={10} mdPush={1}>

                        <div className="artist-intro">

                            <h1>{this.state.name}</h1>

                            <div className="artist-bio card">

                                {this.state.bio ? this.state.bio.summary.replace(`<a href="https://www.last.fm/music/${this.state.name.split(' ').join('+')}">Read more on Last.fm</a>`,'') : null}

                                <hr/>

                                {artistTags}

                            </div>

                            <div className="artist-songs card">




                            </div>

                        </div>

                    </Col>

                </div>

            </div>
        );
    }


}

export default Artist;
