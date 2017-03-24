import * as refracter from '../refracter';
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../components/Form';
import {toast} from 'react-toastify';
import RefracterSpinner from '../components/RefracterSpinner';

class LogInForm extends Component {

    constructor(props) {
        super(props);

        //setup state
        this.state = {
            showModal: false,
            showSpinner: false
        };

        //bindings
        this.forgotPassword = this.forgotPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    forgotPassword() {
        this.props.onHide();
        this.props.showForgotPassword();
    }

    handleSubmit(formData) {

        //set loading status
        this.setState({showSpinner: true, serverError: null});

        //log in
        fetch(`${refracter.refracterEndpoint}login.php?username=${formData.username}&password=${formData.password}`).then(response => {
            return response.json();
        }).then(response => {
            console.log(response);

            if (response.success) {
                //logged in

                //set user in app state and complete app init
                this.props.successfulLogin(response.user);

                //hide form modal
                setTimeout(()=>{
                    this.props.onHide();
                    toast(`You are now logged in as ''${response.user.username}'.`, {type: toast.TYPE.SUCCESS});
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
                placeholder: 'Email or username',
                label: 'Enter email or username',
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

            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="small-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form id="sign-in-form" inputs={inputs} submitBtn="Sign In" onSubmit={this.handleSubmit} serverError={this.state.serverError}>

                        <div className="forgot-password-link">
                            <a onClick={this.forgotPassword} className="pointer">Forgot password?</a>
                        </div>

                    </Form>

                    <RefracterSpinner show={this.state.showSpinner} size={100}/>

                </Modal.Body>
            </Modal>

        );
    }

}

export default LogInForm;
