import React, {Component} from 'react';
import * as refracter from '../refracter';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';

class App extends Component {

    constructor(props) {
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
            activeTrack: null,
            queue: [],
            player: {
                playing: false,
                trackLength: 0,
                trackProgress: 0
            }
        }

        this.onTrackClicked = this.onTrackClicked.bind(this);
        this.playNextTrackInQueue = this.playNextTrackInQueue.bind(this);
        this.playPreviousTrackInQueue = this.playPreviousTrackInQueue.bind(this);

    }
    getChildContext() {
        return {parentState: this};
    }

    onTrackClicked(track, trackList) {

        if ( !this.state.activeTrack || this.state.activeTrack.trackID !== track.trackID) {

            this.setState({
                queue: trackList,
                activeTrack: track
            });

        }

    }

    playNextTrackInQueue(){
        for (let [i,track] of this.state.queue.entries()) {
            if ( track.trackID === this.state.activeTrack.trackID ) {
                this.setState({
                    activeTrack: this.state.queue[i+1]
                });
                return;
            }
        }
    }

    playPreviousTrackInQueue(){
        for (let [i,track] of this.state.queue.entries()) {
            if ( track.trackID === this.state.activeTrack.trackID ) {
                this.setState({
                    activeTrack: this.state.queue[i-1]
                });
                return;
            }
        }
    }

    render() {

        return (
            <div className="Refracter-app">

                <TopBar/>

                <Sidebar
                    activeTrack={this.state.activeTrack}
                />

                <PlayerBar
                    track={this.state.activeTrack}
                    onNextTrack={this.playNextTrackInQueue}
                    onPrevTrack={this.playPreviousTrackInQueue}
                />

                <div className="content-window">
                    {/* {this.props.children} */}
                    {React.cloneElement(this.props.children, { activeTrack: this.state.activeTrack })}
                </div>

            </div>
        );
    }
}

App.childContextTypes = {
    parentState: React.PropTypes.object
};

export default App;
