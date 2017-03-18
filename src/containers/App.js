import React, {Component} from 'react';
import * as refracter from '../refracter';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import PasswordResetForm from './PasswordResetForm';

class App extends Component {

    constructor(props) {
        super(props);

        //set initial app state
        this.state = {
            user: props.route.user ? props.route.user : null, //if user props passed on load set in state
            searchValue: '',
            activeTrack: null,
            playing: false,
            queueId: 0,
            queue: []
        }

        //this.loadUser = this.loadUser.bind(this);
        this.checkForUserEmailActivation = this.checkForUserEmailActivation.bind(this);
        this.checkPasswordReset = this.checkPasswordReset.bind(this);
        this.successfulLogin = this.successfulLogin.bind(this);
        this.logOutUser = this.logOutUser.bind(this);
        this.updateQueue = this.updateQueue.bind(this);
        this.playNextTrackInQueue = this.playNextTrackInQueue.bind(this);
        this.playPreviousTrackInQueue = this.playPreviousTrackInQueue.bind(this);
        this.updateAppPlayState = this.updateAppPlayState.bind(this);
        this.showSignUpForm = this.showSignUpForm.bind(this);
        this.closeSignUpForm = this.closeSignUpForm.bind(this);
        this.showLogInForm = this.showLogInForm.bind(this);
        this.closeLogInForm = this.closeLogInForm.bind(this);
        this.showForgotPasswordForm = this.showForgotPasswordForm.bind(this);
        this.closeForgotPasswordForm = this.closeForgotPasswordForm.bind(this);
        this.showPasswordResetForm = this.showPasswordResetForm.bind(this);
        this.closePasswordResetForm = this.closePasswordResetForm.bind(this);
        this.addUserTracks = this.addUserTracks.bind(this);

    }
    getChildContext() {
        return {parentState: this};
    }

    componentWillMount(){

        //check if query params exist for new user activation
        this.checkForUserEmailActivation();
        //check if query params exist for user password reset
        this.checkPasswordReset();

        //check cookie or php session with api to see if user is logged in, returns user data
        //this.loadUser(); // -- moved to index.js before app init
    }

    componentDidMount(){
        console.log(refracter.getQueryString('test'));
    }

    checkForUserEmailActivation(){
        if ( refracter.getQueryString('userID') && refracter.getQueryString('active') ) {

            let userID = refracter.getQueryString('userID');
            let active = refracter.getQueryString('active');

            fetch(`${refracter.refracterEndpoint}userEmailActivation.php?userID=${userID}&active=${active}`).then(response => {
                return response.json();
            }).then(response => {

                if ( response.success ) {
                    // NOTE: account activated and show login pane and message telling user to login, possible auto log in

                } else {
                    //possibly show activation error here
                }

            }).catch(error => {
                console.log(error);
            });
        }
    }

    checkPasswordReset(){
        if ( refracter.getQueryString('pwReset') ) {
            //show password reset formData
            this.showPasswordResetForm();
        }
    }

    successfulLogin( user ) {

        if ( user && user.cookie ) {

            //set returned cookie as userKey
            refracter.userKey = user.cookie;

            //set user data in state
            this.setState({
                user: user
            })

            //set login cookie
            refracter.setCookie( refracter.loginCookieName, user.cookie, 14 );

            //display login alert/toast
            console.log('User logged in: ', this.state.user);

        } else {
            console.error('User data object and cookie name required for login.');
        }

    }

    logOutUser(){
        //log out user procedure

        //delete login cookie
        refracter.deleteCookie( refracter.loginCookieName );

        //request session destroy on api and on response perform an app reload
        fetch(`${refracter.refracterEndpoint}logout.php`).then(response => {
            return response.json();
        }).then(response => {
            //reload app
            document.location.href = '/';
        }).catch(error => {
            console.log(error);
        });

    }

    updateQueue(track, trackList) {

        if ( !track && trackList ) {
            //only update queue
            this.setState({
                queue: trackList,
            });
        } else if ( !this.state.activeTrack || this.state.activeTrack.trackID !== track.trackID) {
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

    showForgotPasswordForm(){
        this.setState({
            showForgotPasswordForm: true
        });
    }

    closeForgotPasswordForm(){
        this.setState({
            showForgotPasswordForm: false
        });
    }

    showPasswordResetForm(){
        this.setState({
            showPasswordResetForm: true
        });
    }

    closePasswordResetForm(){
        this.setState({
            showPasswordResetForm: false
        });
    }

    addUserTracks(tracks, playlistID){
        //requires tracks and user to be logged in
        //playlistID is optional and will add the tracks to a matching playlist if given

        if ( tracks && refracter.userKey ) {

            let playlistID = playlistID ? playlistID : null;

            refracter.addUserTracksToDb(refracter.userKey, tracks, playlistID).then(youTubeId => {

                this.youTubePlayer.loadVideoById(youTubeId);

            }).catch(err => {
                console.log('ERROR RETURNED: ', err);
            });

        } else {
            console.error('addUserTracksToDb requires userKey and tracks arguements.');
        }

    }

    render() {

        return (
            <div className="Refracter-app">

                <TopBar
                    user={this.state.user}
                    logOutUser={this.logOutUser}
                />

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
                    {React.cloneElement( this.props.children, {
                        //appState: this.state
                        user: this.state.user,
                        playing: this.state.playing,
                        activeTrack: this.state.activeTrack
                    })}
                </div>

                <SignUpForm
                    onHide={this.closeSignUpForm}
                    show={this.state.showSignUpForm}
                />

                <LogInForm
                    onHide={this.closeLogInForm}
                    show={this.state.showLogInForm}
                    showForgotPassword={this.showForgotPasswordForm}
                    successfulLogin={this.successfulLogin}
                />

                <ForgotPasswordForm
                    onHide={this.closeForgotPasswordForm}
                    show={this.state.showForgotPasswordForm}
                />

                <PasswordResetForm
                    onHide={this.closePasswordResetForm}
                    show={this.state.showPasswordResetForm}
                />

            </div>
        );
    }
}

App.childContextTypes = {
    parentState: React.PropTypes.object
};

export default App;
