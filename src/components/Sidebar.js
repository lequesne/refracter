import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        //setup state
    }

    render() {

        return (
            <div className="sidebar">

                <div className="padded-inner">

                    {this.props.user
                        ?
                        <div>
                            Library
                        </div>
                        :
                        <div className="login-signup">
                            Login or sign up to save tracks and albums to your library and create custom playlists.

                            <Link className="button-standard">Login</Link>
                            <Link onClick={this.props.showSignUp} className="button-standard">Sign Up</Link>

                        </div>
                    }

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
