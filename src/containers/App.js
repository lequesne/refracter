import React, {Component} from 'react';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';

class App extends Component {

    constructor(props){
        super(props);

        //set initial app state
        this.state = {
            searchValue: '',
            user: {
                loggedIn: false,
                userName: '',
                email: '',
                library: [], //array of all users tracks (playlist and library)
                playlists: [
                    {
                        id: 1, //id used to fetch users playlist
                        name: 'Playlist 1'
                    }
                ]
            },
            //active queue is list of tracks that the app is currently playing in queue
            queue: {
                currentTrack: {
                    id: 1,
                    name: '',
                    artist: '',
                    album: ''
                },
                allTracks: [
                    {
                        id: 1,
                        name: '',
                        artist: '',
                        album: ''
                    },
                    {
                        id: 1,
                        name: '',
                        artist: '',
                        album: ''
                    }
                ]
            },
            player: {
                playing: false,
                trackLength: 0,
                trackProgress: 0
            }
        }

        this.secondsToMinutes = this.secondsToMinutes.bind(this);

    }

    secondsToMinutes( seconds ){

        //only show hours if they exist
        if ( Math.floor(((seconds/86400)%1)*24) !== 0 ) {
            var hours = Math.floor(((seconds/86400)%1)*24)+':';
        } else {
            var hours = '';
        }

        //show 2 digits for seconds less than double digits
        var sec = Math.round(((seconds/60)%1)*60);
        if ( sec < 10 ) {
            sec = '0' + sec
        }

        return(
            hours +
            Math.floor(((seconds/3600)%1)*60)+':'+
            sec
        );

    }


    render() {

        //example track object
        const track = {
            id: 1,
            title: 'Idioteque',
            artist: 'Radiohead',
            album: 'Kid A',
            duration: '2:30'
        }

        return (
            <div className="Refracter-app">

                <div className="content-window">
                    {this.props.children}
                </div>

                <Sidebar/>

                <PlayerBar
                    secondsToMinutes={this.secondsToMinutes}
                    playing={this.state.player.playing}
                    track={track}
                />

            </div>
        );
    }
}

export default App;
