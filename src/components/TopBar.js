import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import RefracterLogo from '../assets/refracter-logo-full.svg';

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
                    <Link to="/" className="refracter-refracter-logo-full refracter-logo icon"><span className="alpha-label">Alpha</span></Link>
                    <label className="seach-input-container">
                        <input id="search-input" type="text" placeholder="Search" defaultValue={this.state.searchValue} onKeyPress={ this.performNewSearch }/>
                        <div className="refracter-search icon absolute"></div>
                    </label>
                    { this.props.user
                        ? <div className="logged-in">
                            {/* <div className="username"><span className="ion-person icon"></span> {this.props.user.username}</div> */}
                            <Button onClick={this.props.logOutUser} className="signout-btn">Sign Out</Button>
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }


}

export default TopBar;
