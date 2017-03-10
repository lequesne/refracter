import React, {Component} from 'react';
import { browserHistory } from 'react-router';

class Sidebar extends Component {

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
            <div className="sidebar">
                <div className="padded-inner">
                    <label>
                        <input id="Search-input" type="text" placeholder="Search..." defaultValue={this.state.searchValue} onKeyPress={ this.performNewSearch }/>
                    </label>
                </div>
            </div>
        );
    }


}

export default Sidebar;
