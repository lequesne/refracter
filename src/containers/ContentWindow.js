import React, {Component} from 'react';
import { Link } from 'react-router';

class ContentWindow extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="content-window">
                {this.props.childContent}
            </div>
        );
    }

}

export default ContentWindow;
