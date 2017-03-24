import * as refracter from '../refracter';
import React, {Component} from 'react';

const Dropdown = ({children, label}) => {

    let dropdown;

    const expendDropDown = (event)=>{
        dropdown = event.target.parentNode;
        let label = dropdown.childNodes[0];
        let contents = dropdown.childNodes[1];
        let expandHeight = (contents.clientHeight) + (label.clientHeight);
        dropdown.style.height = expandHeight+'px';
    }

    const shrinkDropDown = (event)=>{
        //let dropdown = event.target;
        if ( dropdown )
            dropdown.style.height = '46px';
    }

    return (
        <div onMouseLeave={shrinkDropDown} className="dropdown">
            <div onClick={expendDropDown} className="dropdown-label">{label} <span className="icon ion-arrow-down-b"></span></div>
            <div onClick={shrinkDropDown} className="dropdown-contents">
                {children}
            </div>
        </div>
    );

}

export default Dropdown;
