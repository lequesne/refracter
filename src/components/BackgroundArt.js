import * as refracter from '../refracter';
import React, {Component} from 'react';

class BackgroundArt extends Component {

    constructor(props){
        super(props);

        this.state = {
            loadedArt: false
        };
    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){
        if ( nextProps.art !== this.props.art ) {
            //new art
            let image = new Image();
            image.onload = ()=> {

                this.setState({
                    loadedArt: nextProps.art
                });

            }
            image.src = nextProps.art;
        }
    }



    render(){

        return (
            <div className={`background-art-container ${this.state.loadedArt ? 'loaded' : ''}`}>
                <div className="background-art" style={{backgroundImage: `url(${this.state.loadedArt})`}}></div>
            </div>
        )


    }

}

export default BackgroundArt;
