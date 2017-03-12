import React, {Component} from 'react';
import {browserHistory} from 'react-router';

class Sidebar extends Component {

    constructor(props) {
        super(props);

        //setup state
    }

    render() {
        return (
            <div className="sidebar">
                <div className="padded-inner">

                    <div className="album-art">
                        {this.props.activeTrack
                            ? <img src={this.props.activeTrack.art} alt="Artwork"/>
                            : null}
                    </div>

                </div>
            </div>
        );
    }

}

export default Sidebar;
