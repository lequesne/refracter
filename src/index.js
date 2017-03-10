import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Search from './containers/Search';
import Artist from './containers/Artist';
import './index.css';

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="search" component={Search}>
                <Route path="/search/:query" component={Search}/>
            </Route>
            <Route path="artist" component={Artist}>
                {/* add some nested routes where we want the UI to nest */}
                {/* render the stats page when at `/inbox` */}
                {/* <IndexRoute component={InboxStats}/> */}
                    {/* render the message component at /inbox/messages/123 */}
                {/* <Route path="messages/:id" component={Message}/> */}
            </Route>
        </Route>
    </Router>
), document.getElementById('root'));
