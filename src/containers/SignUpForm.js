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

    handleSubmit(e) {
        e.preventDefault();
        //form is valid and submitted
    }

    render() {

        const inputs = [
            {
                name: 'email',
                type: 'text',
                placeholder: 'Email',
                label: 'Enter Email',
                validation: {
                    required: true,
                    email: true
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
                name: 'password-retype',
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

                    <Form id="sign-up-form" inputs={inputs} submitBtn="Sign Up"/>

                    {/* <Form id="sign-up-form">
                            <Input name="email" type="text"/>
                            <Input name="password" type="password"/>
                            <Button type="submit">Sign Up</Button>
                        </Form> */}

                    {/* <form onSubmit={this.handleSubmit}>
                        <input required type="email" name="email" pattern="^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$"/>
                        <input required type="password" name="password" placeholder="password"/>
                        <Button type="submit">Sign Up</Button>
                    </form> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>

        );
    }

}

export default SignUpForm;
