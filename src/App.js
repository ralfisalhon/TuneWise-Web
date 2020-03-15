import React from 'react';
import s from './styles';
import './App.css';
import Clickable from './reusables/clickable';

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

window.location.hash = '';

function App() {
  return (
    <div className="wrapper">
      <div className={window.innerWidth > 500 ? 'inner' : 'innerMobile'}>
        <p className="text">_____ get ur bop on _____</p>
        <div className="logoContainer">
          <img alt="logo" src={logo} className="image" />
        </div>
        <Clickable filled text={'create session.'} color="white" onClick={() => alert('Create Session')} />
        <p className="text">_____ or _____</p>
        <div style={{ height: '10px' }} />
        <Clickable text={'join existing.'} onClick={() => alert('Join Existing')} />
        <a
          className="btn btn--loginApp-link"
          href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            '%20'
          )}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
      </div>
    </div>
  );
}

export default App;
