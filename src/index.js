import './index.css';
import * as refracter from './refracter';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Search from './containers/Search';
import Album from './containers/Album';
import Artist from './containers/Artist';
import Library from './containers/Library';
import Playlist from './containers/Playlist';

//set login cookie
let cookie = refracter.getCookie( refracter.loginCookieName );

//use cookie to see if user is logged in, then init app with or without user data
fetch(`${refracter.refracterEndpoint}loadUser.php?&cookie=${cookie}`).then(response => {
    return response.json();
}).then(response => {

    console.log('User logged in: ',response);

    if ( response.success && response.user ) {
        //set userKey to use to authenticate with the api to load this users data
        refracter.userKey = response.user.cookie;
        //pass user to init app to have user set as prop on app
        initApp(response.user);
    } else {
        //user not logged in, init app without user prop
        initApp();
    }

}).catch(error => {
    console.log('Issue connnecting to login: ', error);
});

//init app, run after user logged in check
const initApp = (user) => {
    ReactDOM.render((
        <div>
            <div className="icon absolute refracter-refracter-logo background-logo"></div>
            <Router history={browserHistory}>
                <Route path="/" component={App} user={user}>
                    <IndexRoute component={Home}/>
                    <Route path="/search/:query" component={Search} />
                    <Route path="/album/:artist/:album" component={Album}>
                        <Route path="/album/:artist/:album/:track" component={Album}/>
                    </Route>
                    <Route path="/artist/:artist" component={Artist}/>
                    <Route path="/library" component={Library}/>
                    <Route path="/playlist/:id" component={Playlist}/>
                </Route>
            </Router>
        </div>
    ), document.getElementById('root'));
}
