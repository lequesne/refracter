import React, {Component} from 'react';
//import * as refracter from '../refracter';

class Input extends Component {

    constructor(props) {
        super(props);

        this.state = {
            valid: false
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    checkIfValid(e){
        console.log(e);
    }

    render() {

        let errors;
        if ( this.props.errors && this.props.errors.length > 0) {
            errors = this.props.errors.map((error, i) => {
                return (
                    <div className="error" key={i}>{error}</div>
                )
            });
        }

        let showErrors = false;
        if ( this.props.showErrors && this.props.errors && this.props.errors.length > 0 )
            showErrors = true;

        return (
            <div className={`input-container (showErrors ? 'errors' : '')`}>
                { this.props.label
                    ? <label htmlFor={this.props.name}>{this.props.label}</label>
                    : null
                }
                <input
                    name={this.props.name}
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                />
                { showErrors && !this.props.hideErrors
                    ? <div className="input-errors">{errors}</div>
                    : null
                }
            </div>
        )
    }

}

export default Input;
