import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import {toast} from 'react-toastify';
import RefracterSpinner from '../components/RefracterSpinner';

class SignUpForm extends Component {

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

        //set loading status
        this.setState({showSpinner: true, serverError: null});

        //registration
        fetch(`${refracter.refracterEndpoint}register.php?username=${formData.username}&password=${formData.password}&passwordConfirm=${formData.passwordConfirm}&email=${formData.email}`).then(response => {
            return response.json();
        }).then(response => {
            console.log(response);

            if (response.success) {

                //hide form modal
                setTimeout(()=>{
                    this.props.onHide();
                    toast(`An account activation email has been sent to your email. Please check your inbox to complete registration.`, {
                        type: toast.TYPE.INFO,
                        autoClose: 15000
                    });
                },1000);

            } else {
                //error
                this.setState({showSpinner: false, serverError: response.errors});
            }
        }).catch(error => {
            this.setState({showSpinner: false, serverError: error});
        });

    }

    render() {

        const inputs = [
            {
                name: 'username',
                type: 'text',
                placeholder: 'Username',
                label: 'Enter Username',
                validation: {
                    required: true,
                    minChar: 5,
                    maxChar: 25
                }
            }, {
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                label: 'Enter Email',
                validation: {
                    required: true,
                    email: true,
                    maxChar: 250
                }
            }, {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                label: 'Enter Password',
                validation: {
                    required: true,
                    minChar: 8,
                    maxChar: 20
                }
            }, {
                name: 'passwordConfirm',
                type: 'password',
                placeholder: 'Password',
                label: 'Retype Password',
                validation: {
                    required: true,
                    match: 'password' //name of input to match against
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="small-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form
                        id="sign-up-form"
                        inputs={inputs}
                        submitBtn="Sign Up"
                        onSubmit={this.handleSubmit}
                        serverError={this.state.serverError}
                    />

                    <RefracterSpinner show={this.state.showSpinner} size={100}/>

                </Modal.Body>
            </Modal>

        );
    }

}

export default SignUpForm;
