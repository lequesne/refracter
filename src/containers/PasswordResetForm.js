import * as refracter from '../refracter';
import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import Form from '../components/Form';
import RefracterSpinner from '../components/RefracterSpinner';

class PasswordResetForm extends Component {

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

    handleSubmit(formData) {

        //reset password with new password and query token
        let pwResetToken = refracter.getQueryString('pwReset');

        if ( pwResetToken ) {

            //set loading status
            this.setState({showSpinner: true, serverError: null});

            fetch(`${refracter.refracterEndpoint}resetPassword.php?key=${pwResetToken}&password=${formData.password}&passwordConfirm=${formData.passwordConfirm}`).then(response => {
                return response.json();
            }).then(response => {

                console.log(response);

                if (response.success) {
                    //new password has been set

                    browserHistory.push('/');

                    setTimeout(()=>{
                        this.props.onHide();
                        toast(`Your password has been successfully reset. Please login with your new password.`, {
                            type: toast.TYPE.SUCCESS,
                            autoClose: 15000
                        });
                    },1000);

                } else {
                    //error
                    this.setState({showSpinner: false, serverError: response.errors});
                }

            }).catch(error => {
                this.setState({showSpinner: false, serverError: error});
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

            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="small-modal">
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

                    <RefracterSpinner show={this.state.showSpinner} size={100}/>

                </Modal.Body>
            </Modal>

        );
    }

}

export default PasswordResetForm;
