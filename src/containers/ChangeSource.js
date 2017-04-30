import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Row, Col, Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import {toast} from 'react-toastify';
import RefracterSpinner from '../components/RefracterSpinner';

class ChangeSource extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            showModal: false,
            showSpinner: false
        };

        //bindings
        this.loadSources = this.loadSources.bind(this);
    }

    componentWillMount() {
        if ( this.props.changeSourceTrack ) {
            //loadSources();
        }
    }

    componentWillReceiveProps(nextProps){
        if ( nextProps.changeSourceTrack ) {
            this.loadSources(encodeURI(nextProps.changeSourceTrack.artist + ' ' + nextProps.changeSourceTrack.title));
        }
    }

    loadSources(query){

        this.setState({showSpinner: true, serverError: null});

        //perform youtube search for sources
        fetch(`${refracter.refracterEndpoint}youtubeSearch.php?query=${query}`).then(response => {
            return response.json();
        }).then(response => {

            if ( response.success && response.results ) {
                this.setState({
                    sources: response.results
                });
            }
            this.setState({showSpinner: false, serverError: response.errors});

        }).catch(err => {
            console.log('YouTube source search: ', err);
        });
    }

    handleManualLink(formData) {

        //set loading status
        this.setState({showSpinner: true, serverError: null});

        //forgot password request to api (sends user email with password reset token)
        fetch(`${refracter.refracterEndpoint}forgotPassword.php?email=${formData.email}`).then(response => {
            return response.json();
        }).then(response => {

            console.log(response);

            if (response.success) {
                //password was reset and link sent

                setTimeout(()=>{
                    this.props.onHide();
                    toast(`A password reset link has been sent to your email. Please check your inbox and follow the directions.`, {
                        type: toast.TYPE.INFO,
                        autoClose: 15000
                    });
                }, 1000);

            } else {
                //error
                this.setState({showSpinner: false, serverError: response.errors});
            }

        }).catch(error => {
            this.setState({showSpinner: false, serverError: error});
            console.log('login: ', error);
        });

    }

    render() {

        const inputs = [
            {
                name: 'newVideoID',
                type: 'text',
                label: '',
                placeholder: 'YouTube URL or Video ID',
                validation: {
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="change-source">
                <Modal.Header closeButton>
                    <Modal.Title>Change Track Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {this.props.changeSourceTrack ?
                    <p>
                        Change the YouTube source for <strong>{this.props.changeSourceTrack.title}</strong> by <strong>{this.props.changeSourceTrack.artist}</strong>.
                    </p>
                    : null }

                    <br/>

                    <h3>Enter new YouTube URL or ID</h3>

                    <br/>

                    <Form
                        id="change-source-form"
                        inputs={inputs}
                        submitBtn="Set as source"
                        onSubmit={this.handleManualLink}
                        serverError={this.state.serverError}
                    />

                    <h1>OR</h1>

                    <div className="pick-video">

                        <h3>Pick a YouTube video from below</h3>

                        <br/>

                        <ul className="source-list text-left">

                            {this.state.sources ? this.state.sources.map((source, sourceIndex) => {
                                return (
                                    <li key={sourceIndex}>
                                        <Row>
                                            <Col xs={5}>
                                                <iframe className="source-iframe" src={`https://www.youtube.com/embed/${source.youTubeID}`} frameBorder="0"></iframe>
                                            </Col>
                                            <Col xs={7}>
                                                <div className="source-title">{source.title}</div>
                                                <div className="source-duration">{source.duration}</div>
                                                {/* <div className="source-author">{source.author}</div> */}
                                                <div className="source-meta">{source.date} | {source.views}</div>
                                                <hr/>
                                                <Button block>Set as source</Button>
                                                {/* <div className="source-desc">{source.desc}</div> */}
                                            </Col>
                                        </Row>
                                    </li>
                                )
                            }):null}

                        </ul>

                    </div>


                    <RefracterSpinner show={this.state.showSpinner} size={100}/>

                </Modal.Body>
            </Modal>

        );
    }

}

export default ChangeSource;
