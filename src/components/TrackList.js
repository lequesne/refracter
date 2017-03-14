import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import * as refracter from '../refracter';

class TrackList extends Component {

    constructor(props) {
        super(props);
        console.log(this.props);

        //setup state

        //bindings
        this.trackPlayButtonClicked = this.trackPlayButtonClicked.bind(this);
        this.trackClicked = this.trackClicked.bind(this);
        this.trackDoubleClicked = this.trackDoubleClicked.bind(this);
        this.activeTrackClass = this.activeTrackClass.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentWillReceiveProps() {
        //this.refs.table.reset();

        //console.log(this);
    }

    componentWillMount(){
        this.setState({
            queueId: this.props.queueId
        });
    }

    trackPlayButtonClicked(track){
        console.log(track);
    }

    trackClicked(track) {
        //console.log(track);
    }

    trackDoubleClicked(track) {
        this.props.onTrackDoubleClick(track, this.props.tracks);
    }

    sortChange() {
        //look into updating playback queue on sort
        console.log(this);
    }

    activeTrackClass(track) {
        //come back and test it works correctly with lists that share the same track id (should only be active on original queue)
        if (this.props.activeTrack) {
            //if ( this.state.queueId === this.props.queueId ) {
                return track.trackID === this.props.activeTrack.trackID
                    ? 'active-track'
                    : '';
            //}
        }
    }

    render() {

        const tableOptions = {
            defaultSortName: 'number',
            defaultSortOrder: 'desc',
            onRowClick: this.trackClicked,
            onRowDoubleClick: this.trackDoubleClicked,
            onSortChange: this.sortChange
        }

        const playIconClass = this.props.playing ? 'play-icon ion-play equalizer' : 'play-icon ion-play' ;


        return (

            <div className="track-list">
                {/* <div className="equalizer icon"></div><div className="ion-radio-waves icon"></div> */}
                {this.props.tracks.length > 0
                    ? <BootstrapTable data={this.props.tracks} options={tableOptions} trClassName={this.activeTrackClass}>
                            <TableHeaderColumn dataField="trackID" isKey={true} hidden></TableHeaderColumn>
                            <TableHeaderColumn width="40px" columnClassName={playIconClass}></TableHeaderColumn>
                            <TableHeaderColumn width="60px" dataField="number" dataSort={true} sortFunc={refracter.revertSortFunc}>#</TableHeaderColumn>
                            <TableHeaderColumn dataField="title" dataSort={true}>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField="album">Album</TableHeaderColumn>
                            <TableHeaderColumn dataField="artist">Artist</TableHeaderColumn>
                            <TableHeaderColumn width="80px" dataField="duration" dataSort={true} dataFormat={refracter.secondsToMinutes}>Duration</TableHeaderColumn>
                        </BootstrapTable>
                    : null
                }

            </div>
        );
    }

}

export default TrackList;
