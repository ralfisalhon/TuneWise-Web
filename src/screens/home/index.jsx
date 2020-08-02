import React, { Component } from 'react';
import { Clickable } from '../../reusables/Clickable';
import logo from '../../assets/tunewise_logo.png';
import './styles.css';

const authEndpoint = 'https://accounts.spotify.com/authorize?';
const clientId = '895eddbce28a406e92d83b3ca8451560';
const redirectUri = window.location.href;
const scopes = ['user-modify-playback-state'];
const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

class HomePage extends Component {
  componentDidMount() {
    this.getToken();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const error = urlParams.get('error');
    if (error) window.location.href = window.location.origin;
  }

  getToken = async () => {
    let _token = hash.access_token;
    if (_token) {
      await this.props.setToken(_token);
      window.location.href = '/create';
    }
  };

  authorize = () => {
    window.location.href = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      '%20'
    )}&response_type=token&show_dialog=true`;
  };

  render() {
    return (
      <div className="container">
        <p className="text">_____ get ur bop on _____</p>
        <div className="logoContainer">
          <img alt="logo" src={logo} className="image" />
        </div>
        <Clickable text={'create session.'} filled color="white" onClick={() => this.authorize()} />
        <p className="text">_____ or _____</p>
        <div style={{ height: '10px' }} />
        <Clickable text={'join existing.'} onClick={() => (window.location.href = '/join')} />
        <p className="text what" onClick={() => (window.location.href = '/info')}>
          what is tunewise?
        </p>
      </div>
    );
  }
}

export default HomePage;
