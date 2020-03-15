import React, { Component } from 'react';
import s from './styles';
import './App.css';
import Clickable from './reusables/clickable';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import logo from './assets/tunewise_logo.png';

export const authEndpoint = 'https://accounts.spotify.com/authorize?';

const clientId = '895eddbce28a406e92d83b3ca8451560';
const redirectUri = 'http://localhost:3000';
const scopes = ['user-read-currently-playing', 'user-read-playback-state'];

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

class App extends Component {
  constructor() {
    super();

    this.state = {
      token: null,
    };
  }
  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      this.setState({
        token: _token,
      });
    }
  }

  render() {
    const loggedIn = this.state.token != null;
    return (
      <Router>
        <Switch>
          <div className="wrapper">
            <div className={window.innerWidth > 500 ? 'inner' : 'innerMobile'}>
              <p className="text">_____ get ur bop on _____</p>
              <div className="logoContainer">
                <img alt="logo" src={logo} className="image" />
              </div>
              <Route path="/join_session">
                <div className="container">
                  <p className="text">4 digit room code?</p>
                </div>
              </Route>
              <Route path="/test">
                <p>LOL 2</p>
              </Route>
              <Route path="/">
                {window.location.pathname === '/' && (
                  <div className="container">
                    <Clickable
                      filled
                      text={'create session.'}
                      color="white"
                      onClick={() =>
                        loggedIn
                          ? alert('Lol')
                          : (window.location.href = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                              '%20'
                            )}&response_type=token&show_dialog=true`)
                      }
                    />
                    <p className="text">_____ or _____</p>
                    <div style={{ height: '10px' }} />
                    <Clickable text={'join existing.'} onClick={() => (window.location.href = '/join_session')} />
                  </div>
                )}
              </Route>
            </div>
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
