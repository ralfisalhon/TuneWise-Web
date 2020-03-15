import React, { Component } from 'react';
import './App.css';
import Clickable from './reusables/clickable';
import ReactCodeInput from 'react-code-input';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import logo from './assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;

const authEndpoint = 'https://accounts.spotify.com/authorize?';
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

const inputStyle = {
  width: '50px',
  height: '50px',
  marginLeft: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '5px',
  fontSize: '22px',
  fontWeight: '800',
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      token: null,
      code: null,
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
            <div className={isMobile ? 'innerMobile' : 'inner'}>
              <Route path="/join_session">
                <div className="color_fill">
                  <div className="container">
                    <div className="logoContainer">
                      <img alt="logo" src={logo} className="image small" />
                    </div>
                    <p className="text">4 digit room code?</p>
                    <ReactCodeInput
                      type="number"
                      fields={4}
                      inputStyle={inputStyle}
                      onChange={(code) => this.setState({ code })}
                    />
                    <div style={{ height: '30px' }} />
                    <Clickable
                      filled
                      color="white"
                      text={'join room'}
                      onClick={() =>
                        !this.state.code || this.state.code.length < 4
                          ? alert('Enter the 4 digit code')
                          : alert('joining with code ' + this.state.code)
                      }
                    />
                    <div style={{ height: '15px' }} />
                    <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
                    <div style={{ height: isMobile ? '20vh' : '10vh' }} />
                  </div>
                </div>
              </Route>
              <Route path="/">
                {window.location.pathname === '/' && (
                  <div className="container">
                    <p className="text">_____ get ur bop on _____</p>
                    <div className="logoContainer">
                      <img alt="logo" src={logo} className="image" />
                    </div>
                    <Clickable
                      text={'create session.'}
                      filled
                      color="white"
                      onClick={() =>
                        loggedIn
                          ? alert('Already logged in w token: ' + this.state.token)
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
