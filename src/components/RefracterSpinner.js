import * as refracter from '../refracter';
import React, {Component} from 'react';

class RefracterSpinner extends Component {

    constructor(props){
        super(props);

        this.state = {
            showing: false,
            hiding: false
        };
    }

    componentWillMount(){
        if ( this.props.show ) {
            //spinner was shown from the start
            this.setState({
                showing: true,
                hiding: false
            });
        }
    }

    componentWillReceiveProps(nextProps){

        if ( nextProps.show ) {
            //spinner was just shown

            this.setState({
                showing: true,
                hiding: false
            });

        } else if ( !nextProps.show && this.state.showing  ) {
            //spinner was hidden and was already showing

            setTimeout(()=>{
                this.setState({
                    showing: false,
                    hiding: true
                });
            },500);

        }

    }

    render(){

        let classes = 'spinner-container';

        if ( this.state.hiding ) {
            classes = 'spinner-container hiding';
        } else if ( this.state.showing ) {
            classes = 'spinner-container showing';
        } else {
            classes = 'spinner-container';
        }

        let containerStyles = this.props.backgroundColor ? {background: this.props.backgroundColor} : null;
        let spinnerStyles = this.props.size ? {fontSize: `${this.props.size}px`} : null;

        return (
            <div className={classes} style={containerStyles}>
                <div className="refracter-spinner" style={spinnerStyles}>
                    <span className="refracter-logo-spinner-middle"></span>
                    <span className="refracter-logo-spinner-outer"></span>
                </div>
            </div>
        )

    }

}

export default RefracterSpinner;
