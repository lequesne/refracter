import * as refracter from '../refracter';
import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import ScrollArea from 'react-scrollbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import RefracterSpinner from '../components/RefracterSpinner';
import TopBar from '../components/TopBar';
import Sidebar from './Sidebar';
import PlayerBar from '../components/PlayerBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import PasswordResetForm from './PasswordResetForm';
import ChangeSource from './ChangeSource';

//
// browser fixes for safari
//
// more responsive support for smaller screens (possibly mobile support for mobiles that work with youtube player, otherwise show incompatability screen)
//
// share linking for playlists and tracks
//
//
//
// TEST
//
// change shuffle toggle to shuffle on and shuffle off functions in app.js, have sorting turn shuffle off -TEST
// clear password query after password reset - TEST
// add loop toggle - TEST
// fix track auto play when clicking new track and player is paused - TEST
// for duplicate track ids in the same playlist, use queue index as well as track id for active track - TEST


class App extends Component {

    constructor(props) {
        super(props);

        //set initial app state
        this.state = {
            pathname: null,
            user: props.route.user ? props.route.user : null, //if user props passed on load set in state
            searchValue: '',
            activeTrack: null,
            playTrack: false,
            playing: false,
            shuffle: false,
            playerLoop: 0, //default mode is 0 for not loop
            alreadyShuffledTracks: [],
            queueLocation: null,
            queue: [],
            showPageSpinner: false
        }

        this.checkForUserEmailActivation = this.checkForUserEmailActivation.bind(this);
        this.checkPasswordReset = this.checkPasswordReset.bind(this);
        this.successfulLogin = this.successfulLogin.bind(this);
        this.logOutUser = this.logOutUser.bind(this);
        this.updateUserPlaylists = this.updateUserPlaylists.bind(this);
        this.updateQueue = this.updateQueue.bind(this);
        //this.playPauseTrack = this.playPauseTrack.bind(this);
        this.playTrack = this.playTrack.bind(this);
        this.pauseTrack = this.pauseTrack.bind(this);
        this.shuffleTracksOn = this.shuffleTracksOn.bind(this);
        this.shuffleTracksOff = this.shuffleTracksOff.bind(this);
        this.togglePlayerLoop = this.togglePlayerLoop.bind(this);
        this.playNextTrackInQueue = this.playNextTrackInQueue.bind(this);
        this.playPreviousTrackInQueue = this.playPreviousTrackInQueue.bind(this);
        this.updateAppPlayState = this.updateAppPlayState.bind(this);
        this.changeTrackSource = this.changeTrackSource.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showPageSpinner = this.showPageSpinner.bind(this);
        this.hidePageSpinner = this.hidePageSpinner.bind(this);

    }
    getChildContext() {
        return {parentState: this};
    }

    componentWillMount(){
        //check if query params exist for new user activation
        this.checkForUserEmailActivation();
        //check if query params exist for user password reset
        this.checkPasswordReset();

        //on route change show page spinner
        this.setState({
            pathname: location.pathname
        });
        browserHistory.listen( location =>  {
            if ( !this.state.pathname || location.pathname !== this.state.pathname ) {
                //this.showPageSpinner();
            }
            this.setState({
                pathname: location.pathname
            });
        });
    }

    componentDidMount(){

        setTimeout(()=>{
            //hide splash
            let splash = document.getElementById('splash');
            splash.classList.remove('showing');
            splash.classList.add('hiding');

            //remove splash after animate out
            setTimeout(()=>{
                splash.remove();
            },1000);

            //will you kindly welcome the user
            if ( this.state.user ){
                toast(`Welcome ${this.state.user.username}.`, {
                  type: toast.TYPE.INFO
                });
            }

        },2000);

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
                    //this.showModal('showLogInForm');
                    toast(`Your account was activated! Please sign in with your username or email.`, {
                      type: toast.TYPE.SUCCESS,
                      autoClose: 15000
                    });
                } else {
                    //possibly show activation error here
                    toast(`Activation error: ${response.errors}`, {
                      type: toast.TYPE.SUCCESS,
                      autoClose: 15000
                    });
                }

                browserHistory.push('/');

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

    updateUserPlaylists(newPlayListArray){
        //updates the user object with new or removed playlists
        let user = this.state.user;
        user.playlists = newPlayListArray;
        this.setState({
            user: user
        });
    }

    updateQueue(track, trackList, queueLocation) {

        if ( !track && trackList ) {
            //only update queue

            this.setState({
                queue: trackList,
            });

        //} else if ( !this.state.activeTrack || this.state.activeTrack.trackID !== track.trackID ) {
        } else if ( track && queueLocation ) {
            //new track and queue

            this.setState({
                queueLocation: queueLocation,
                queue: trackList,
                activeTrack: null
            });

            this.setState({
                activeTrack: track
            });

        }

    }

    playTrack(){
        this.setState({
            playTrack: true
        });
    }

    pauseTrack(){
        this.setState({
            playTrack: false
        });
    }

    // playPauseTrack(){
    //
    //     if ( !this.state.playTrack ) {
    //         this.setState({
    //             playTrack: true
    //         });
    //     } else {
    //         this.setState({
    //             playTrack: false
    //         });
    //     }
    //
    // }

    shuffleTracksOn(){
        this.setState({
            shuffle: true
        });
    }

    shuffleTracksOff(){
        this.setState({
            shuffle: false
        });
    }

    togglePlayerLoop(){

        if ( this.state.playerLoop === 0 ) {
            //no loop, set to loop queue
            this.setState({
                playerLoop: 1
            });
        } else if ( this.state.playerLoop === 1 ) {
            //loop queue, set to loop single track
            this.setState({
                playerLoop: 2
            });
        } else if ( this.state.playerLoop === 2 ) {
            //loop single track, reset and turn loop off
            this.setState({
                playerLoop: 0
            });
        }

    }

    playNextTrackInQueue(){

        let activeTrackIndex;
        for (let [i,track] of this.state.queue.entries()) {
            if ( track.index === this.state.activeTrack.index ) {
                activeTrackIndex = i;
                break;
            }
        }

        if ( this.state.playerLoop === 2 ) {
            //loop single track
            this.setState({
                activeTrack: null
            });
            this.setState({
                activeTrack: this.state.queue[activeTrackIndex]
            });
        } else if ( this.state.playerLoop === 1 && activeTrackIndex === (this.state.queue.length-1) ) {
            //loop is enabled and end of queue
            this.setState({
                activeTrack: this.state.queue[0]
            });
        } else if ( activeTrackIndex === (this.state.queue.length-1) ) {
            //no loop and end of queue, remove active track
            this.setState({
                activeTrack: null
            });
        } else {
            //no loop, play next in queue
            this.setState({
                activeTrack: this.state.queue[activeTrackIndex+1]
            });
        }

    }

    playPreviousTrackInQueue(){
        for (let [i,track] of this.state.queue.entries()) {
            if ( track.index === this.state.activeTrack.index ) {
                this.setState({
                    activeTrack: this.state.queue[i-1]
                });
                return;
            }
        }
    }

    updateAppPlayState(playState, bufferingState){
        this.setState({
            playing: playState,
            buffering: bufferingState
        });
    }

    changeTrackSource(track) {
        this.pauseTrack();
        this.setState({
            changeSourceTrack: track ? track : this.state.activeTrack,
            showChangeSource: true
        })
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

    showPageSpinner(){
        this.setState({showPageSpinner:true});
    }

    hidePageSpinner(){
        // this.refs.pageScrollArea.scrollTop();
        this.setState({showPageSpinner:false});
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
                    updateUserPlaylists={this.updateUserPlaylists}
                    activeTrack={this.state.activeTrack}
                    queueLocation={this.state.queueLocation}
                />

                <PlayerBar
                    playing={this.state.playing}
                    playTrack={this.state.playTrack}
                    updateAppPlayState={this.updateAppPlayState}
                    track={this.state.activeTrack}
                    queueLocation={this.state.queueLocation}
                    onNextTrack={this.playNextTrackInQueue}
                    onPrevTrack={this.playPreviousTrackInQueue}
                    shuffle={this.state.shuffle}
                    playerLoop={this.state.playerLoop}
                    changeTrackSource={this.changeTrackSource}
                />

                <div className="content-window">
                    <ScrollArea ref="pageScrollArea" className="scrollable" >
                        {React.cloneElement( this.props.children, {
                            //appState: this.state
                            user: this.state.user,
                            playTrack: this.state.playTrack,
                            playing: this.state.playing,
                            buffering: this.state.buffering,
                            activeTrack: this.state.activeTrack,
                            queueLocation: this.state.queueLocation,
                            shuffle: this.state.shuffle
                        })}
                    </ScrollArea>
                    <RefracterSpinner show={this.state.showPageSpinner} size={150}/>
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

                <ChangeSource
                    onHide={()=>this.hideModal('showChangeSource')}
                    show={this.state.showChangeSource}
                    changeSourceTrack={this.state.changeSourceTrack}
                    queue={this.state.queue}
                    queueLocation={this.state.queueLocation}
                    activeTrack={this.state.activeTrack}
                />

            </div>
        );
    }
}

App.contextTypes = {
    pathname: React.PropTypes.string
};

App.childContextTypes = {
    parentState: React.PropTypes.object
};

export default App;
