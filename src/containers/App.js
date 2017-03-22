import * as refracter from '../refracter';
import React, {Component} from 'react';
import ScrollArea from 'react-scrollbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import TopBar from '../components/TopBar';
import Sidebar from './Sidebar';
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

        this.checkForUserEmailActivation = this.checkForUserEmailActivation.bind(this);
        this.checkPasswordReset = this.checkPasswordReset.bind(this);
        this.successfulLogin = this.successfulLogin.bind(this);
        this.logOutUser = this.logOutUser.bind(this);
        this.updateQueue = this.updateQueue.bind(this);
        this.playNextTrackInQueue = this.playNextTrackInQueue.bind(this);
        this.playPreviousTrackInQueue = this.playPreviousTrackInQueue.bind(this);
        this.updateAppPlayState = this.updateAppPlayState.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);

    }
    getChildContext() {
        return {parentState: this};
    }

    componentWillMount(){
        //check if query params exist for new user activation
        this.checkForUserEmailActivation();
        //check if query params exist for user password reset
        this.checkPasswordReset();
    }

    componentDidMount(){

        //will you kindly welcome the user
        if ( this.state.user ){
            toast(`Welcome ${this.state.user.username}.`, {
              type: toast.TYPE.INFO
            });
        }
    }

    checkForUserEmailActivation(){
        if ( refracter.getQueryString('userID') && refracter.getQueryString('active') ) {

            let userID = refracter.getQueryString('userID');
            let active = refracter.getQueryString('active');

            fetch(`${refracter.refracterEndpoint}userEmailActivation.php?userID=${userID}&active=${active}`).then(response => {
                return response.json();
            }).then(response => {

                if ( response.success ) {
                    //account activated and show login pane and message telling user to sign in
                    this.showModal('showLogInForm');
                    toast(`Your account was activated! Please sign in.`, {
                      type: toast.TYPE.SUCCESS
                    });
                } else {
                    //possibly show activation error here
                    toast(`Activation error: ${response}`, {
                      type: toast.TYPE.SUCCESS
                    });
                }

            }).catch(error => {
                console.log(error);
            });
        }
    }

    checkPasswordReset(){
        if ( refracter.getQueryString('pwReset') ) {
            //show password reset formData
            this.showModal('showPasswordResetForm');
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

    showModal(modal){
        this.setState({
            [modal]: true
        });
    }

    hideModal(modal){
        this.setState({
            [modal]: false
        });
    }

    updateUserPlaylists(newPlayListArray){
        //updates the user object with new or removed playlists
        let user = this.state.user;
        user.playlists = newPlayListArray;
        this.setState({
            user: user
        });
    }

    render() {

        return (
            <div className="Refracter-app">

                <ToastContainer autoClose={5000} position="top-right"/>

                <TopBar
                    user={this.state.user}
                    logOutUser={this.logOutUser}
                />

                <Sidebar
                    user={this.state.user}
                    activeTrack={this.state.activeTrack}
                />

                <PlayerBar
                    updateAppPlayState={this.updateAppPlayState}
                    queueId={this.state.queueId}
                    track={this.state.activeTrack}
                    onNextTrack={this.playNextTrackInQueue}
                    onPrevTrack={this.playPreviousTrackInQueue}
                />

                <div className="content-window">
                    <ScrollArea className="scrollable" smoothScrolling={true} speed={1.2} >
                        <div>
                            {React.cloneElement( this.props.children, {
                                //appState: this.state
                                user: this.state.user,
                                playing: this.state.playing,
                                activeTrack: this.state.activeTrack
                            })}
                        </div>
                    </ScrollArea>
                </div>

                <SignUpForm
                    onHide={()=>this.hideModal('showSignUpForm')}
                    show={this.state.showSignUpForm}
                />

                <LogInForm
                    onHide={()=>this.hideModal('showLogInForm')}
                    show={this.state.showLogInForm}
                    showForgotPassword={()=>this.showModal('showForgotPasswordForm')}
                    successfulLogin={this.successfulLogin}
                />

                <ForgotPasswordForm
                    onHide={()=>this.hideModal('showForgotPasswordForm')}
                    show={this.state.showForgotPasswordForm}
                />

                <PasswordResetForm
                    onHide={()=>this.hideModal('showPasswordResetForm')}
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
