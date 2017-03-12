import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Search from './containers/Search';
import Album from './containers/Album';
import Artist from './containers/Artist';
import './index.css';

ReactDOM.render((
    <div>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
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
            </Route>
        </Router>
    </div>
), document.getElementById('root'));
