import React, {Component} from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import YouTube from 'react-youtube';

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

        this.playTrack = this.playTrack.bind(this);
        this.pauseTrack = this.pauseTrack.bind(this);
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.toggleMuteBtn = this.toggleMuteBtn.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.playPrevious = this.playPrevious.bind(this);
        this.playNext = this.playNext.bind(this);

        this.youTubeReady = this.youTubeReady.bind(this);
        this.youTubeStateChange = this.youTubeStateChange.bind(this);
        this.youTubeStateChange = this.youTubeStateChange.bind(this);
        //this.youTubePlayed = this.youTubePlayed.bind(this);
        //this.youTubePaused = this.youTubePaused.bind(this);
        //this.youTubeEnded = this.youTubeEnded.bind(this);
        this.youTubeError = this.youTubeError.bind(this);

    }

    componentWillMount() {}

    playTrack() {
        //play youtube
        this.youTubePlayer.playVideo();
    }

    pauseTrack() {
        //pause youtube
        this.youTubePlayer.pauseVideo();
    }

    togglePlayPause() {
        if ( this.state.playing ) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    playPrevious(){

    }

    playNext(){

    }

    setProgress(value) {
        //set progress in state as percent (1-100)
        //this.setState({setProgress: value}); //this could possible be set on youtube progress check interval

        //translate percent progress to
        let progressInSeconds = this.youTubePlayer.getDuration() / 100 * value;
        this.youTubePlayer.seekTo(progressInSeconds);
    }

    updateProgress(){

        let youTubeDuration = this.youTubePlayer.getDuration();
        let youTubeProgress = this.youTubePlayer.getCurrentTime();

        if ( youTubeDuration && youTubeProgress ) {

            let progressPercent = youTubeProgress / youTubeDuration * 100;

            this.setState({
                setProgress: progressPercent < 100 ? progressPercent : 100, //in percent
                trackDuration: this.youTubePlayer.getDuration(),
                trackProgress: this.youTubePlayer.getCurrentTime()
            })
        }

    }

    toggleMuteBtn() {
        if ( this.state.setVolume ) {
            //mute
            this.setState({
                lastSetVolume: this.state.setVolume,
                setVolume: 0
            });
            this.youTubePlayer.setVolume(0);
        } else {
            //unmute
            this.setState({setVolume: this.state.lastSetVolume ? this.state.lastSetVolume : 60 });
            this.youTubePlayer.setVolume(this.state.lastSetVolume ? this.state.lastSetVolume : 60);
        }
    }

    setVolume(value) {

        value = value > 90 ? 100 : value;

        this.setState({setVolume: value});
        this.youTubePlayer.setVolume(value);
    }

    youTubeReady(event) {
        this.youTubePlayer = event.target;
        setInterval(this.updateProgress, 100);
    }

    youTubeStateChange(event) {
        //console.log(event);

        this.setState({playing: false})

        switch (event.data) {
            case 0: //ended
                //
                break;
            case 1: //started
                this.setState({playing: true});
                break;
            case 2: //paused
                //
                break;
            case 3: //buffering
                //
                break;
            case 5: //cued
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
        console.log(event);
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

        //set volume icons based off volume range
        let volumeAmountClass = 'ion-android-volume-off icon';
        if ( this.state.setVolume > 50 ) {
            volumeAmountClass = 'ion-android-volume-up icon';
        } else if ( this.state.setVolume > 0 ) {
            volumeAmountClass = 'ion-android-volume-down icon';
        }

        return (
            <div className="PlayerBar">

                <YouTube id="yt-container" videoId="XisOVzJ32_g" opts={youTubeOpts} onReady={this.youTubeReady} onStateChange={this.youTubeStateChange} onError={this.youTubeError}/>

                <div className="player-controls-lhs">

                    <div onClick={this.playPrevious.bind(this)} title="Previous track" className="prev-track player-btn">
                        <div className="ion-ios-skipbackward icon"></div>
                    </div>
                    <div onClick={this.togglePlayPause.bind(this)} title="Play / Pause" className="player-play-pause player-btn">
                        { this.state.playing
                            ? <div className="ion-pause icon"></div>
                            : <div className="ion-play icon"></div>
                        }
                    </div>
                    <div onClick={this.playNext.bind(this)} title="Previous track" className="next-track player-btn">
                        <div className="ion-ios-skipforward icon"></div>
                    </div>
                    <div className="volume-mute">
                        <div onClick={this.toggleMuteBtn.bind(this)} title="Mute / Unmute" className="mute-unmute player-btn">
                            <div className={volumeAmountClass}></div>
                        </div>
                        <InputRange
                            formatLabel={value => ``}
                            maxValue={100}
                            minValue={0}
                            value={this.state.setVolume}
                            onChange={this.setVolume.bind(this)}
                        />
                    </div>

                </div>

                <div className="progress-bar-container">
                    <InputRange
                        formatLabel={value => ``}
                        maxValue={100}
                        minValue={0}
                        value={this.state.setProgress}
                        onChange={this.setProgress.bind(this)}
                    />
                    <div className="track-details">
                        <div className="track-title">
                            {this.props.track.title}
                        </div>
                        {this.props.track.artist} - {this.props.track.album}
                        <div className="track-progress">
                            { this.state.trackProgress
                                ? `${this.props.secondsToMinutes(this.state.trackProgress)} / ${this.props.secondsToMinutes(this.state.trackDuration)}`
                                : null }
                        </div>
                    </div>
                </div>

                <div className="player-controls-rhs">
                    <div title="Loop On / Off" className="loop-track player-btn">
                        <div className="ion-loop icon"></div>
                    </div>
                    <div title="Shuffle On / Off" className="shuffle-tracks player-btn">
                        <div className="ion-shuffle icon"></div>
                    </div>
                </div>

            </div>
        )
    }

}

export default PlayerBar;
