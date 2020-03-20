import React, { Component } from 'react';
import './App.css';
import JoinPage from './screens/join';
import CreatePage from './screens/create';
import HomePage from './screens/home';
import InfoPage from './screens/info';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const isMobile = window.innerWidth <= 500;

class App extends Component {
  constructor() {
    super();
    this.state = {
      apiToken: sessionStorage.getItem('apiToken'),
    };
  }

  setToken = async (token) => {
    this.setState({ apiToken: token }, () => {
      console.log('set apiToken as', token);
      sessionStorage.setItem('apiToken', token);
    });
  };

  render() {
    return (
      <Router>
        <Switch>
          <div className="wrapper">
            <div className={isMobile ? 'innerMobile' : 'inner'}>
              <Route path="/create">
                <CreatePage apiToken={this.state.apiToken} />
              </Route>
              <Route path="/join">
                <JoinPage />
              </Route>
              <Route path="/info">
                <InfoPage />
              </Route>
              <Route path="/">
                {window.location.pathname === '/' && <HomePage setToken={(token) => this.setToken(token)} />}
              </Route>
            </div>
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
