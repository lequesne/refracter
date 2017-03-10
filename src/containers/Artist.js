import React, {Component} from 'react';

class Artist extends Component {

    constructor(props){
        super(props);
        console.log(props.params);
    }

    componentWillMount(){
    }

    render() {
        return (
            <div className="artist page">
                Artist
            </div>
        );
    }


}

export default Artist;
