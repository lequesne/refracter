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

    }



    render() {
        return (
            <div className="Refracter-app">

                <div className="content-window">
                    {this.props.children}
                </div>

                <Sidebar/>

                <PlayerBar playing={this.state.player.playing}/>

            </div>
        );
    }
}

export default App;
