//import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {Row, Col,Button} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import UserPlaylists from '../components/UserPlaylists';

class Sidebar extends Component {

    constructor(props) {
        super(props);

        this.linkToActiveQueue = this.linkToActiveQueue.bind(this);
    }

    linkToActiveQueue(){

        if ( this.props.queueLocation ) {
             browserHistory.push(this.props.queueLocation);
        }

    }

    render() {

        return (
            <div className="sidebar">
                <div className="padded-inner">

                    { this.props.user
                        ?
                        <div className="logged-in wrapper">

                            <Link to={'/library'} data-drag-ndrop-add-tracks={true} className="link library-link dragNdrop-droppable">
                                <span className="text"><span className="library refracter-book icon"></span>Library</span>
                            </Link>

                            <ScrollArea className="scrollable" smoothScrolling={true} speed={0.8} >
                                <UserPlaylists playlists={this.props.user.playlists} updateUserPlaylists={this.props.updateUserPlaylists}></UserPlaylists>
                            </ScrollArea>

                        </div>
                        :
                        <div className="logged-out wrapper">

                            <ScrollArea className="scrollable" smoothScrolling={true} speed={0.8} >

                                <div className="login-signup">

                                    Sign in or register to save tracks and albums to your library, create custom playlists and update track YouTube sources.

                                    <Row className="sign-in-register-buttons">
                                        <Col xs={6}>
                                            <Button block onClick={()=>this.context.parentState.showModal('showLogInForm')} className="button-standard">Sign In</Button>
                                        </Col>
                                        <Col xs={6}>
                                            <Button block onClick={()=>this.context.parentState.showModal('showSignUpForm')} className="button-standard">Register</Button>
                                        </Col>
                                    </Row>

                                </div>

                            </ScrollArea>

                        </div>
                    }

                    <div onClick={this.linkToActiveQueue} className="album-art">
                        {this.props.activeTrack
                            ? <img src={this.props.activeTrack.art} alt="Artwork"/>
                            : <div className="icon absolute refracter-refracter-logo"></div>}
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
