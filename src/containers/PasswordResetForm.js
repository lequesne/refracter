import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import * as refracter from '../refracter';

class PasswordResetForm extends Component {

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

        //reset password with new password and query token
        let pwResetToken = refracter.getQueryString('pwReset');

        if ( pwResetToken ) {

            fetch(`${refracter.refracterEndpoint}resetPassword.php?key=${pwResetToken}&password=${formData.password}&passwordConfirm=${formData.passwordConfirm}`).then(response => {
                return response.json();
            }).then(response => {

                console.log(response);

                if (response.success) {
                    //new password has been set
                    this.setState({formLoading: false});
                    browserHistory.push('/');
                } else {
                    //error
                    this.setState({formLoading: false, serverError: response.errors});
                }

            }).catch(error => {
                this.setState({formLoading: false});
                console.log('Reset Password: ', error);
            });

        } else {
            this.setState({serverError: ['Password reset requires a token. Please make sure you follow the reset password link from your email inbox.']});
        }

    }

    render() {

        const inputs = [
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                label: 'Enter new password',
                validation: {
                    required: true,
                    minChar: 8,
                    maxChar: 20
                }
            },
            {
                name: 'passwordConfirm',
                type: 'password',
                placeholder: 'Password',
                label: 'Retype new password',
                validation: {
                    required: true,
                    match: 'password' //name of input to match against
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset your password</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p>
                        Enter a new password for your account.
                    </p>

                    <Form id="password-reset-form"
                        inputs={inputs}
                        submitBtn="Confirm new password"
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

export default PasswordResetForm;
