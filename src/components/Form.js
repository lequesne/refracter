import React, {Component} from 'react';
import Input from '../components/Inputs';
import {Button} from 'react-bootstrap';
//import * as refracter from '../refracter';

class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputs: props.inputs
        }

        this.validate = this.validate.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.formInputsToFormData = this.formInputsToFormData.bind(this);
    }

    componentWillReceiveProps(nextProps) {}

    componentDidMount() {}

    formInputsToFormData(){
        let formData = {};
        for (let input of this.state.inputs) {
            formData[`${input.name}`] = input.value;
        }
        return formData;
    }

    validateInput(input, index, showErrors){

        input.errors = [];
        if ( showErrors )
            input.showErrors = true;

        //required check
        if ( input.validation.required && !input.value )
            input.errors.push(`This field can not be empty`);

        //maxChar check
        if ( input.value && input.validation.maxChar && input.value.length >= input.validation.maxChar )
            input.errors.push(`The max characters for ${input.placeholder} is ${input.validation.maxChar}`);

        //minChar check
        if ( input.value && input.validation.minChar && input.value.length < input.validation.minChar )
            input.errors.push(`The min characters for ${input.placeholder} is ${input.validation.minChar}`);

        //email check
        if ( input.value && input.validation.email ){
            let pattern = /[^@]+@[^@]+\.[^@]+/;
            if ( !pattern.test(input.value) )
                input.errors.push(`Please enter a valid email address`);
        }

        //match input name check
        if ( input.validation.match ){
            for (let matchInput of this.state.inputs) {
                if ( matchInput.name === input.validation.match ) {
                    //matching input
                    if ( matchInput.value !== input.value )
                        input.errors.push(`${input.placeholder} must match the ${matchInput.placeholder} field`);
                }
            }
        }


        //if no errors after tests mark as valid
        input.valid = input.errors.length === 0 ? true : false;

        //update input in inputs array at same index then update state with new inputs array
        let updatedInputs = this.state.inputs;
        updatedInputs[index] = input;


        // //set state with updated input value and validation errors
        this.setState({
            inputs: updatedInputs
        });

    }

    updateInputValue(e, showErrors) {
        //takes an input event and find the value before updating the value in the inputs state
        for (var [i,input] of this.state.inputs.entries()) {
            if (input.name === e.target.name) {

                let updatingInput = this.state.inputs[i];
                updatingInput.value = e.target.value;

                //run validation and add errors
                this.validateInput(updatingInput, i, showErrors);

            }
        }
    }

    onInputBlur(e){
        this.updateInputValue(e, true);
    }

    validate(e) {
        e.preventDefault();

        let formValid = true;

        //trigger loop validation of all inputs
        for (let [i,input] of this.state.inputs.entries()) {
            this.validateInput(input, i, true);
        }

        //run another loop to check valid status of each input
        for (let input of this.state.inputs) {
            if ( !input.valid ) {
                formValid = false;
            }
        }

        if ( formValid )
            this.props.onSubmit( this.formInputsToFormData() );

    }

    render() {

        //iterate over inputs from props
        const inputs = this.state.inputs.map((input, index) => {
            return (
                <Input
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    label={input.label}
                    value={input.value}
                    onChange={this.updateInputValue}
                    onBlur={this.onInputBlur}
                    valid={input.valid}
                    errors={input.errors}
                    showErrors={input.showErrors}
                    key={index}
                />)
        });

        //iterate over server errors if they exist
        let serverErrors;
        if ( this.props.serverError && this.props.serverError.length > 0 ) {
            serverErrors = this.props.serverError.map((error, index) => {
                return (
                    <div className="error" key={index}>{error}</div>
                )
            });
        }

        return (
            <form id={this.props.id} onSubmit={this.validate}>

                {inputs}

                <Button type="submit">{this.props.submitBtn}</Button>

                {this.props.children}

                { serverErrors
                    ? <div className="server-errors">{serverErrors}</div>
                    : null
                }
            </form>
        )
    }

}

export default Form;
