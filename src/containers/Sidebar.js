//import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import UserPlaylists from '../components/UserPlaylists';

class Sidebar extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidUpdate(){
    }

    render() {

        return (
            <div className="sidebar">
                <div className="padded-inner">

                    { this.props.user
                        ?
                        <div className="logged-in wrapper">

                            <Link to={'/library'} data-drag-ndrop-add-tracks={true} className="link library-link dragNdrop-droppable">
                                <span className="text"><span className="library ion-ios-book"></span>Library</span>
                            </Link>

                            <ScrollArea className="scrollable" smoothScrolling={true} speed={0.8} >
                                <UserPlaylists playlists={this.props.user.playlists}></UserPlaylists>
                            </ScrollArea>

                        </div>
                        :
                        <div className="logged-out">

                            <div className="login-signup">
                                Log in or sign up to save tracks and albums to your library and create custom playlists.
                                <Link onClick={()=>this.context.parentState.showModal('showLogInForm')} className="button-standard">Sign In</Link>
                                <Link onClick={()=>this.context.parentState.showModal('showSignUpForm')} className="button-standard">Sign Up</Link>
                            </div>

                        </div>
                    }

                    <div className="album-art">
                        {this.props.activeTrack
                            ? <img src={this.props.activeTrack.art} alt="Artwork"/>
                            : <div className="icon ion-disc"></div>}
                    </div>

                </div>
            </div>
        );
    }

}

Sidebar.contextTypes = {
    parentState: React.PropTypes.object
};

export default Sidebar;
