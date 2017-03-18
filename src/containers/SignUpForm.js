import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import * as refracter from '../refracter';

class SignUpForm extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            showModal: false
        };

        //bindings
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onComponentWillMount(){
    }

    handleSubmit(formData) {

        //set loading status
        this.setState({
            formLoading: true,
            serverError: null
        });

        //registration
        fetch(`${refracter.refracterEndpoint}register.php?username=${formData.username}&password=${formData.password}&passwordConfirm=${formData.passwordConfirm}&email=${formData.email}`).then(response => {
            return response.json();
        }).then(response => {
            console.log(response);

            if ( response.success ) {
                // NOTE: Registration successful. Tell user the registration was successful and to check inbox for activaton link
            } else {
                this.setState({
                    formLoading: false,
                    serverError: response.errors
                });
            }
        }).catch(error => {
            console.log(error);
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
            },
            {
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                label: 'Enter Email',
                validation: {
                    required: true,
                    email: true,
                    maxChar: 250
                }
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                label: 'Enter Password',
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
                label: 'Retype Password',
                validation: {
                    required: true,
                    match: 'password' //name of input to match against
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form
                        id="sign-up-form"
                        inputs={inputs}
                        submitBtn="Sign Up"
                        onSubmit={this.handleSubmit}
                        serverError={this.state.serverError}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>

        );
    }

}

export default SignUpForm;
