import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import * as refracter from '../refracter';

class TrackList extends Component {

    constructor(props) {
        super(props);
        console.log(this.props);

        //setup state

        //bindings
        this.trackClicked = this.trackClicked.bind(this);
        this.trackDoubleClicked = this.trackDoubleClicked.bind(this);
        this.activeTrackClass = this.activeTrackClass.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentWillReceiveProps() {
        //this.refs.table.reset();

        //console.log(this);
    }

    trackClicked(track) {}

    trackDoubleClicked(track) {
        this.props.onTrackDoubleClick(track, this.props.tracks);
    }

    sortChange() {
        //look into updating playback queue on sort
        console.log(this);
    }

    activeTrackClass(track) {
        if (this.props.activeTrack) {
            return track.trackID === this.props.activeTrack.trackID
                ? 'active-track'
                : '';
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

        return (

            <div className="track-list">

                {this.props.tracks.length > 0
                    ? <BootstrapTable data={this.props.tracks} options={tableOptions} trClassName={this.activeTrackClass}>
                            <TableHeaderColumn dataField="trackID" isKey={true} hidden></TableHeaderColumn>
                            <TableHeaderColumn dataField="number" dataSort={true} sortFunc={refracter.revertSortFunc}>#</TableHeaderColumn>
                            <TableHeaderColumn dataField="title" dataSort={true}>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField="album">Album</TableHeaderColumn>
                            <TableHeaderColumn dataField="artist">Artist</TableHeaderColumn>
                            <TableHeaderColumn dataField="duration" dataSort={true} dataFormat={refracter.secondsToMinutes}>Duration</TableHeaderColumn>
                        </BootstrapTable>
                    : null
                }

            </div>
        );
    }

}

export default TrackList;
