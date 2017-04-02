import React, {Component} from 'react';
import * as refracter from '../refracter';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import YouTube from 'react-youtube';
import {toast} from 'react-toastify';

// NOTE Update progress bar and volume with simple from scratch percent/width functionality

class PlayerBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            setVolume: 70,
            setProgress: 0,
            trackDuration: 0,
            trackProgress: 0
        }

        this.loadTrack = this.loadTrack.bind(this);
        this.playTrack = this.playTrack.bind(this);
        this.pauseTrack = this.pauseTrack.bind(this);
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.toggleMuteBtn = this.toggleMuteBtn.bind(this);
        this.toggleShuffle = this.toggleShuffle.bind(this)
        this.setProgress = this.setProgress.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.onPrevious = this.onPrevious.bind(this);

        this.youTubeReady = this.youTubeReady.bind(this);
        this.youTubeStateChange = this.youTubeStateChange.bind(this);
        this.youTubeStateChange = this.youTubeStateChange.bind(this);
        //this.youTubePlayed = this.youTubePlayed.bind(this);
        //this.youTubePaused = this.youTubePaused.bind(this);
        //this.youTubeEnded = this.youTubeEnded.bind(this);
        this.youTubeError = this.youTubeError.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        //play pause controls
        if ( this.props.track && this.props.playTrack !== nextProps.playTrack ) {

            if ( nextProps.playTrack) {
                this.playTrack();
            } else {
                this.pauseTrack();
            }
        }

        //load new track
        if (this.youTubePlayer && nextProps.track ) {

            if ( !this.props.track || nextProps.track.trackID !== this.props.track.trackID || nextProps.track.index !== this.props.track.index || nextProps.queueLocation !== this.props.queueLocation ) {
                this.context.parentState.pauseTrack();
                this.setProgress(0);
                this.loadTrack(nextProps.track, nextProps.playTrack);
            }

        }

    }

    loadTrack(track, playTrack) {
        if (track) {
            refracter.getTrackSource(track, refracter.userKey).then(youTubeId => {
                this.youTubePlayer.loadVideoById(youTubeId);
                this.context.parentState.playTrack();
            }).catch(err => {

                //go to next track
                this.props.onNextTrack();

                //show toast
                toast(`A YouTube source for ${track.title} by ${track.artist} could not be found.`, {
                  type: toast.TYPE.ERROR,
                  autoClose: 10000
                });

            });
        }
    }

    playTrack() {
        //play youtube
        if (this.youTubePlayer) {
            this.youTubePlayer.playVideo();
        } else {
            setTimeout(()=>{
                this.youTubePlayer.playVideo();
            },1000);
        }
    }

    pauseTrack() {
        //pause youtube
        this.youTubePlayer.pauseVideo();
    }

    togglePlayPause() {
        if (this.props.playTrack) {
            this.context.parentState.pauseTrack();
        } else {
            this.context.parentState.playTrack();
        }
    }

    setProgress(value) {
        let progressInSeconds = this.youTubePlayer.getDuration() / 100 * value;
        this.youTubePlayer.seekTo(progressInSeconds);
    }

    updateProgress() {

        let youTubeDuration = this.youTubePlayer.getDuration();
        let youTubeProgress = this.youTubePlayer.getCurrentTime();

        if (youTubeDuration && youTubeProgress) {

            let progressPercent = youTubeProgress / youTubeDuration * 100;

            this.setState({
                setProgress: progressPercent < 100
                    ? progressPercent
                    : 100, //in percent
                trackDuration: this.youTubePlayer.getDuration(),
                trackProgress: this.youTubePlayer.getCurrentTime()
            });
        } else {
            this.setState({
                setProgress: 0,
                trackDuration: 0,
                trackProgress: 0
            });
        }

    }

    toggleMuteBtn() {
        if (this.state.setVolume) {
            //mute
            this.setState({lastSetVolume: this.state.setVolume, setVolume: 0});
            this.youTubePlayer.setVolume(0);
        } else {
            //unmute
            this.setState({
                setVolume: this.state.lastSetVolume
                    ? this.state.lastSetVolume
                    : 60
            });
            this.youTubePlayer.setVolume(this.state.lastSetVolume
                ? this.state.lastSetVolume
                : 60);
        }
    }

    toggleShuffle(){
        if ( this.props.shuffle ) {
            this.context.parentState.shuffleTracksOff();
        } else {
            this.context.parentState.shuffleTracksOn();
        }
    }

    setVolume(value) {

        value = value > 90
            ? 100
            : value;

        this.setState({setVolume: value});
        this.youTubePlayer.setVolume(value);
    }

    youTubeReady(event) {
        //define youtube player in this
        this.youTubePlayer = event.target;
        //setup progress tracker function
        setInterval(this.updateProgress, 100);
        //load active track on first load
        //this.loadTrack(this.props.track, this.props.playTrack);
    }

    youTubeStateChange(event) {
        //console.log(event);

        if ( event.data === 1 ) {
            this.setState({playing: true});
            this.props.updateAppPlayState(true, false);
        } else {
            this.setState({playing: false});
            this.props.updateAppPlayState(false, false);
        }

        switch (event.data) {
            case 0: //ended
                //
                this.props.onNextTrack();
                break;
            case 1: //started
                break;
            case 2: //paused
                //
                break;
            case 3: //buffering
                this.props.updateAppPlayState(false, true);
                break;
            case 5: //cued
                //
                break;
            default:
                //
                break;
        }

    }

    // youTubePlayed(event){
    //     console.log(event);
    // }
    //
    // youTubePaused(event){
    //     console.log(event);
    // }
    //
    // youTubeEnded(event){
    //     console.log(event);
    // }

    youTubeError(event) {
        // toast(`There was an error with the Youtube player: ${event}`, {
        //     type: toast.TYPE.ERROR,
        //     autoClose: 10000
        // });
    }

    onPrevious(){
        if ( this.youTubePlayer.getCurrentTime() > 5 ) {
            this.youTubePlayer.seekTo(0);
        } else {
            this.props.onPrevTrack();
        }
    }

    render() {

        const youTubeOpts = {
            height: '180',
            width: '320',
            playerVars: {
                autoplay: 0,
                showinfo: 0,
                controls: 0,
                autohide: 1
            }
        };

        //set volume icon absolutes based off volume range
        let volumeAmountClass = 'refracter-volume-mute icon absolute';
        if (this.state.setVolume > 75) {
            volumeAmountClass = 'refracter-volume-high icon absolute';
        } else if (this.state.setVolume > 50) {
            volumeAmountClass = 'refracter-volume-medium icon absolute';
        } else if (this.state.setVolume > 0) {
            volumeAmountClass = 'refracter-volume-low icon absolute';
        }

        return (
            <div className="PlayerBar">

                <YouTube id="yt-container" opts={youTubeOpts} onReady={this.youTubeReady} onStateChange={this.youTubeStateChange} onError={this.youTubeError}/>

                <div className="player-controls-lhs">

                    <div onClick={this.onPrevious} title="Previous track" className="prev-track player-btn">
                        <div className="refracter-ios-skipbackward icon absolute"></div>
                    </div>
                    <div onClick={this.togglePlayPause} title="Play / Pause" className="player-play-pause player-btn">
                        {this.state.playing
                            ? <div className="refracter-pause icon absolute"></div>
                            : <div className="refracter-play icon absolute"></div>
                        }
                    </div>
                    <div onClick={this.props.onNextTrack} title="Next track" className="next-track player-btn">
                        <div className="refracter-ios-skipforward icon absolute"></div>
                    </div>
                    <div className="volume-mute">
                        <div onClick={this.toggleMuteBtn.bind(this)} title="Mute / Unmute" className="mute-unmute player-btn">
                            <div className={volumeAmountClass}></div>
                        </div>
                        <InputRange formatLabel={value => ``} maxValue={100} minValue={0} value={this.state.setVolume} onChange={this.setVolume.bind(this)}/>
                    </div>

                </div>

                <div className="progress-bar-container">
                    <InputRange formatLabel={value => ``} maxValue={100} minValue={0} value={this.state.setProgress} onChange={this.setProgress.bind(this)}/>
                    <div className="track-details">
                        <div className="track-title">
                            {this.props.track
                                ? this.props.track.title
                                : null}
                        </div>
                        {this.props.track
                            ? `${this.props.track.artist} - `
                            : null}
                        {this.props.track
                            ? this.props.track.album
                            : null}
                        <div className="track-progress">
                            {this.state.trackProgress
                                ? `${refracter.secondsToMinutes(this.state.trackProgress)} / ${refracter.secondsToMinutes(this.state.trackDuration)}`
                                : null}
                        </div>
                    </div>
                </div>

                <div className="player-controls-rhs">
                    <div onClick={this.context.parentState.togglePlayerLoop} title="Loop On / Off" className={`loop-track player-btn ${this.props.playerLoop?'enabled':''}`}>
                        <div className="refracter-loop icon absolute"></div>
                        {this.props.playerLoop === 2 ? <span className="loop-track">1</span> :null}
                    </div>

                    <div onClick={this.toggleShuffle} title="Shuffle On / Off" className={`shuffle-tracks player-btn ${this.props.shuffle?'enabled':''}`}>
                        <div className="refracter-shuffle icon absolute absolute"></div>
                    </div>
                </div>

            </div>
        )
    }

}

PlayerBar.contextTypes = {
    parentState: React.PropTypes.object
};

export default PlayerBar;
