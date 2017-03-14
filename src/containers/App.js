import React, {Component} from 'react';
import * as refracter from '../refracter';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import SignUpForm from './SignUpForm';

class App extends Component {

    constructor(props) {
        super(props);

        //set initial app state
        this.state = {
            searchValue: '',
            // user: {
            //     loggedIn: false,
            //     userName: '',
            //     email: '',
            //     library: [], //array of all users tracks (playlist and library)
            //     playlists: [
            //         {
            //             id: 1, //id used to fetch users playlist
            //             name: 'Playlist 1'
            //         }
            //     ]
            // },
            user: null,
            activeTrack: null,
            playing: false,
            queueId: 0,
            queue: [],
            showSignUpPage: true
        }

        this.onTrackClicked = this.onTrackClicked.bind(this);
        this.playNextTrackInQueue = this.playNextTrackInQueue.bind(this);
        this.playPreviousTrackInQueue = this.playPreviousTrackInQueue.bind(this);
        this.updateAppPlayState = this.updateAppPlayState.bind(this);
        this.showSignUpForm = this.showSignUpForm.bind(this);
        this.closeSignUpForm = this.closeSignUpForm.bind(this);

    }
    getChildContext() {
        return {parentState: this};
    }

    componentDidMount(){
    }

    onTrackClicked(track, trackList) {

        if ( !this.state.activeTrack || this.state.activeTrack.trackID !== track.trackID) {

            this.setState({
                queueId: this.state.queueId++,
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

    updateAppPlayState(playState){
        this.setState({
            playing: playState
        });
    }

    showSignUpForm(){
        this.setState({
            showSignUpPage: true
        });
    }

    closeSignUpForm(){
        this.setState({
            showSignUpPage: false
        });
    }

    render() {

        return (
            <div className="Refracter-app">

                <TopBar/>

                <Sidebar
                    user={this.state.user}
                    activeTrack={this.state.activeTrack}
                    showSignUp={this.showSignUpForm}
                />

                <PlayerBar
                    updateAppPlayState={this.updateAppPlayState}
                    queueId={this.state.queueId}
                    track={this.state.activeTrack}
                    onNextTrack={this.playNextTrackInQueue}
                    onPrevTrack={this.playPreviousTrackInQueue}
                />

                <div className="content-window">
                    {React.cloneElement(this.props.children, { activeTrack: this.state.activeTrack, playing: this.state.playing })}
                </div>

                <SignUpForm
                    onHide={this.closeSignUpForm}
                    show={this.state.showSignUpPage}
                />

            </div>
        );
    }
}

App.childContextTypes = {
    parentState: React.PropTypes.object
};

export default App;
