import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import * as refracter from '../refracter';

class ForgotPasswordForm extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            showModal: false
        };

        //bindings
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onComponentWillMount() {}

    handleSubmit(formData) {

        //set loading status
        this.setState({formLoading: true, serverError: null});

        //forgot password request to api (sends user email with password reset token)
        fetch(`${refracter.refracterEndpoint}forgotPassword.php?email=${formData.email}`).then(response => {
            return response.json();
        }).then(response => {

            console.log(response);

            if (response.success) {
                //password was reset and link sent

                this.setState({formLoading: false});
            } else {
                //error
                this.setState({formLoading: false, serverError: response.errors});
            }

        }).catch(error => {
            this.setState({formLoading: false});
            console.log('login: ', error);
        });

    }

    render() {

        const inputs = [
            {
                name: 'email',
                type: 'email',
                placeholder: 'Your email address',
                //label: 'Enter Username or email',
                validation: {
                    required: true,
                    email: true
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p>
                        You will receive an email that will help you create a new password for your account.
                    </p>

                    <Form id="forgot-password-form"
                        inputs={inputs}
                        submitBtn="Reset my password"
                        onSubmit={this.handleSubmit}
                        serverError={this.state.serverError}>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>

        );
    }

}

export default ForgotPasswordForm;
