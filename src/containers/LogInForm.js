import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import { toast } from 'react-toastify';

class LogInForm extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            showModal: false
        };

        //bindings
        this.forgotPassword = this.forgotPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onComponentWillMount() {}

    forgotPassword(){
        this.props.onHide();
        this.props.showForgotPassword();
    }

    handleSubmit(formData) {

        //set loading status
        this.setState({formLoading: true, serverError: null});

        //log in
        fetch(`${refracter.refracterEndpoint}login.php?username=${formData.username}&password=${formData.password}`).then(response => {
            return response.json();
        }).then(response => {
            console.log(response);

            if (response.success) {
                //logged in

                //set user in app state and complete app init
                this.props.successfulLogin(response.user);
                this.setState({formLoading: false});

                //hide form modal
                this.props.onHide();

                //display login alert/toast
                toast(`You are now logged in as ''${response.user.username}'.`, {
                  type: toast.TYPE.SUCCESS
                });

            } else {
                //error
                this.setState({formLoading: false, serverError: response.errors});
            }

        }).catch(error => {
            this.setState({formLoading: false});
            console.log('login: ', error);
        });

        //generate auth key from server
        // fetch(`${refracter.refracterEndpoint}api/get_nonce/?controller=user&method=generate_auth_cookie`).then(response => {
        //     return response.json();
        // }).then(response => {
        //     //nonce fetched
        //
        //     //regiter user with form fields
        //     fetch(`${refracter.refracterEndpoint}api/user/generate_auth_cookie/?nonce=${response.nonce}&username=${formData.userName}&password=${formData.password}&insecure=cool`).then(response => {
        //         return response.json();
        //     }).then(response => {
        //
        //         console.log(response);
        //
        //         if ( response.status === 'ok' ) {
        //             //logged in
        //
        //             //user logged in and we have user data
        //             this.props.successfulLogin( response.user, response.cookie, response.cookie_name );
        //             this.setState({formLoading: false});
        //
        //         } else if ( response.status === 'error' ) {
        //             this.setState({
        //                 formLoading: false,
        //                 serverError: response.error
        //             });
        //         }
        //
        //     }).catch(error => {
        //         this.setState({formLoading: false});
        //         console.log('Log in: ', error);
        //     });
        //
        //
        // }).catch(error => {
        //     console.log('generate_auth_cookie: ', error);
        // });

    }

    render() {

        const inputs = [
            {
                name: 'username',
                type: 'text',
                placeholder: 'Username',
                label: 'Enter Username',
                validation: {
                    required: true
                }
            }, {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                label: 'Enter Password',
                validation: {
                    required: true
                }
            }
        ];

        return (

            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form id="sign-in-form"
                        inputs={inputs}
                        submitBtn="Sign In"
                        onSubmit={this.handleSubmit}
                        serverError={this.state.serverError}>

                        <a onClick={this.forgotPassword}>Forgot password?</a>

                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>

        );
    }

}

export default LogInForm;
