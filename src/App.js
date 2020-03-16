import React, { Component } from 'react';
import './App.css';
import JoinSession from './screens/join_session';
import Home from './screens/home';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const isMobile = window.innerWidth <= 500;

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <div className="wrapper">
            <div className={isMobile ? 'innerMobile' : 'inner'}>
              <Route path="/join_session">
                <JoinSession />
              </Route>
              <Route path="/">{window.location.pathname === '/' && <Home />}</Route>
            </div>
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
