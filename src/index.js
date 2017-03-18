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
import './index.css';

const initApp = (user) => {
    ReactDOM.render((
        <div>
            <Router history={browserHistory}>
                <Route path="/" component={App} user={user}>
                    <IndexRoute component={Home}/>
                    {/* <Route path="/signup" component={SignUpForm} /> */}
                    <Route path="/search/:query" component={Search} />
                    <Route path="/album/:artist/:album" component={Album}>
                        <Route path="/album/:artist/:album/:track" component={Album}/>
                    </Route>
                    <Route path="/artist" component={Artist}>
                        {/* add some nested routes where we want the UI to nest */}
                        {/* render the stats page when at `/inbox` */}
                        {/* <IndexRoute component={InboxStats}/> */}
                            {/* render the message component at /inbox/messages/123 */}
                        {/* <Route path="messages/:id" component={Message}/> */}
                    </Route>
                    <Route path="/library" component={Library} />
                </Route>
            </Router>
        </div>
    ), document.getElementById('root'));
}

//init app after on load user check
// TODO: PRELOADER FOR APP BEFORE LOAD USER RESPONSE

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
