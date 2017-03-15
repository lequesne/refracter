import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import * as refracter from '../refracter';

class SignUpForm extends Component {

    constructor(props) {
        super(props);
        console.log(this.props);

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
            // NOTE: Registration successful. Tell user the registration was successful and to check inbox for activaton link
            console.log(response);
        }).catch(error => {
            console.log(error);
        });

        //fetch nonce
        // fetch(`${refracter.refracterEndpoint}api/get_nonce/?controller=user&method=register`).then(response => {
        //     return response.json();
        // }).then(response => {
        //     //nonce fetched
        //
        //     //regiter user with form fields
        //     // TODO: registration does not send confirm email but instead can send set password link (which assumes they own the email) work with noify user_pass and email return
        //     fetch(`${refracter.refracterEndpoint}api/user/register/?username=${formData.userName}&email=${formData.email}&nonce=${response.nonce}&display_name=${formData.userName}&notify=no&user_pass=${formData.password}&insecure=cool`).then(response => {
        //         return response.json();
        //     }).then(response => {
        //
        //         if ( response.status === 'ok' ) {
        //             //registerd
        //
        //             // NOTE: Use login function here to get wordpress cookie login instead of get_userinfo
        //             //
        //             fetch(`${refracter.refracterEndpoint}api/get_nonce/?controller=user&method=generate_auth_cookie`).then(response => {
        //                 return response.json();
        //             }).then(response => {
        //                 //nonce fetched
        //
        //                 //regiter user with form fields
        //                 fetch(`${refracter.refracterEndpoint}api/user/generate_auth_cookie/?nonce=${response.nonce}&username=${formData.userName}&password=${formData.password}&insecure=cool`).then(response => {
        //                     return response.json();
        //                 }).then(response => {
        //
        //                     console.log(response);
        //
        //                     if ( response.status === 'ok' ) {
        //                         //logged in
        //
        //                         //user logged in and we have user data
        //                         this.props.successfulLogin( response.user, response.cookie, response.cookie_name );
        //                         this.setState({formLoading: false});
        //
        //                     } else if ( response.status === 'error' ) {
        //                         this.setState({
        //                             formLoading: false,
        //                             serverError: response.error
        //                         });
        //                     }
        //
        //                 }).catch(error => {
        //                     this.setState({formLoading: false});
        //                     console.log('Log in: ', error);
        //                 });
        //
        //
        //             }).catch(error => {
        //                 console.log('generate_auth_cookie: ', error);
        //             });
        //
        //             //old post registration get user info request, replaced with new login procedure above
        //             // fetch(`${refracter.refracterEndpoint}api/user/get_userinfo/?user_id=${response.user_id}&insecure=cool`).then(response => {
        //             //     return response.json();
        //             // }).then(response => {
        //             //
        //             //     //user logged in and we have user data
        //             //     this.props.successfulLogin( response, cookie );
        //             //
        //             //     this.setState({formLoading: false});
        //             //
        //             //     //close form here?
        //             //
        //             // }).catch(error => {
        //             //     this.setState({formLoading: false});
        //             //     console.log('get_userinfo: ', error);
        //             // });
        //
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
        //         console.log('Register: ', error);
        //     });
        //
        //
        // }).catch(error => {
        //     console.log('get_nonce: ', error);
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
                    required: true,
                    minChar: 5,
                    maxChar: 25
                }
            },
            {
                name: 'email',
                type: 'text',
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
