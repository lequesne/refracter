import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';
import {Row, Col, Button } from 'react-bootstrap';

class Home extends Component {

    componentWillMount(){
        //redirect to library if user signed in
        if ( this.props.user ) {
            //browserHistory.push('/library');
        }
    }

    render() {
        return (
            <div className="home page y-center x-center">

                <div className="home-welcome">

                    <div className="refracter-refracter-logo-full refracter-logo icon"></div>

                    <p>
                        Refracter is a music aggregator and YouTube player in one.
                    </p>

                    <p>
                        Search for your favourite artist, album or track and sign in or register to save tracks, playlists and track sources.
                    </p>

                    { !this.props.user ?
                    <Row className="sign-in-register-buttons">
                        <Col xs={6}>
                            <Button block onClick={()=>this.context.parentState.showModal('showLogInForm')} className="button-standard">Sign In</Button>
                        </Col>
                        <Col xs={6}>
                            <Button block onClick={()=>this.context.parentState.showModal('showSignUpForm')} className="button-standard">Register</Button>
                        </Col>
                    </Row>
                    : null}

                </div>

            </div>
        );
    }
}

Home.contextTypes = {
    parentState: React.PropTypes.object
};

export default Home;
