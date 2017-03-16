import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import RefracterLogo from '../assets/refracter-logo.svg';

class TopBar extends Component {

    constructor(props){
        super(props);

        //setup state
        this.state = {
            searchValue: ''
        }

        this.performNewSearch = this.performNewSearch.bind(this);
    }

    performNewSearch(event){
        if ( event.charCode === 13 && event.target.value ) {
            //enter pressed
            browserHistory.push('/search/' + encodeURIComponent(event.target.value));
        }
    }

    render() {
        return (
            <div className="topbar">
                <div className="padded-inner">
                    <img className="refracter-logo" src={RefracterLogo} alt="Refracter"/>
                    <label className="seach-input-container">
                        <input id="search-input" type="text" placeholder="Search..." defaultValue={this.state.searchValue} onKeyPress={ this.performNewSearch }/>
                        <div className="ion-android-search icon"></div>
                    </label>
                    { this.props.user
                        ? <Button onClick={this.props.logOutUser} className="signout-btn">Sign Out</Button>
                        : null
                    }
                </div>
            </div>
        );
    }


}

export default TopBar;
