import React, { Component } from 'react';
import Clickable from '../../reusables/clickable';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

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

class Home extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
    };
  }

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      this.setState(
        {
          token: _token,
        },
        () => {
          // go to create_session
          window.location.href = '/';
        }
      );
    }
  }

  render() {
    const loggedIn = this.state.token != null;
    return (
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
    );
  }
}

export default Home;
