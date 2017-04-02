import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import {toast} from 'react-toastify';
import RefracterSpinner from '../components/RefracterSpinner';

class ForgotPasswordForm extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            showModal: false,
            showSpinner: false
        };

        //bindings
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onComponentWillMount() {}

    handleSubmit(formData) {

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
                name: 'email',
                type: 'email',
                placeholder: 'Your email address',
                validation: {
                    required: true,
                    email: true
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="small-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p>
                        You will receive an email that will help you create a new password for your account.
                    </p>

                    <br/>

                    <Form
                        id="forgot-password-form"
                        inputs={inputs}
                        submitBtn="Reset my password"
                        onSubmit={this.handleSubmit}
                        serverError={this.state.serverError}
                    />

                    <RefracterSpinner show={this.state.showSpinner} size={100}/>

                </Modal.Body>
            </Modal>

        );
    }

}

export default ForgotPasswordForm;
