import React, {Component} from 'react';
import * as refracter from '../refracter';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';

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
            showSignUpForm: false,
            showLogInForm: false
        }

        this.checkForUserEmailActivation = this.checkForUserEmailActivation.bind(this);
        this.successfulLogin = this.successfulLogin.bind(this);
        this.onTrackClicked = this.onTrackClicked.bind(this);
        this.playNextTrackInQueue = this.playNextTrackInQueue.bind(this);
        this.playPreviousTrackInQueue = this.playPreviousTrackInQueue.bind(this);
        this.updateAppPlayState = this.updateAppPlayState.bind(this);
        this.showSignUpForm = this.showSignUpForm.bind(this);
        this.closeSignUpForm = this.closeSignUpForm.bind(this);
        this.showLogInForm = this.showLogInForm.bind(this);
        this.closeLogInForm = this.closeLogInForm.bind(this);

    }
    getChildContext() {
        return {parentState: this};
    }

    componentWillMount(){
        //check if query params exist for new user activation
        this.checkForUserEmailActivation();

        // TODO: Have on load logged in/cookie check. Need to work out if have it all managed in php (cookie is in php on login with central fetch call on load to check logged in service)
    }

    componentDidMount(){
    }

    checkForUserEmailActivation(){
        if ( refracter.getQueryString('userID') && refracter.getQueryString('active') ) {

            let userID = refracter.getQueryString('userID');
            let active = refracter.getQueryString('active');

            fetch(`${refracter.refracterEndpoint}userEmailActivation.php?userID=${userID}&active=${active}`).then(response => {
                return response.json();
            }).then(response => {

                if ( response.success ) {
                    // NOTE: account activated and show login pane and message telling user to login

                } else {
                    //possibly show activation error here
                }

            }).catch(error => {
                console.log(error);
            })
        }
    }

    successfulLogin( user, cookie, cookieName ) {

        if ( user && cookie && cookieName ) {

            user.cookie = cookie;

            this.setState({
                user: user
            })

            //login to refracter db

            //set login cookie
            refracter.setCookie( cookieName, cookie, 14 );

            //display login alert/toast
            console.log('User logged in: ', this.state.user);

        } else {
            console.error('User, cookie or cookie name not provided to login.');
        }

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
            showSignUpForm: true
        });
    }

    closeSignUpForm(){
        this.setState({
            showSignUpForm: false
        });
    }

    showLogInForm(){
        this.setState({
            showLogInForm: true
        });
    }

    closeLogInForm(){
        this.setState({
            showLogInForm: false
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
                    showLogIn={this.showLogInForm}
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
                    show={this.state.showSignUpForm}
                    successfulLogin={this.successfulLogin}
                />

                <LogInForm
                    onHide={this.closeLogInForm}
                    show={this.state.showLogInForm}
                    successfulLogin={this.successfulLogin}
                />

            </div>
        );
    }
}

App.childContextTypes = {
    parentState: React.PropTypes.object
};

export default App;
