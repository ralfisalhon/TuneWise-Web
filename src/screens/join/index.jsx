import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import ReactCodeInput from 'react-code-input';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;
const isTall = window.innerHeight > 700;

const baseURI = 'http://tunewise.herokuapp.com';

const inputStyle = {
  maxWidth: '20px',
  maxHeight: '20px',
  marginLeft: '5px',
  marginRight: '5px',
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: '800',
  padding: '10px',
};

class JoinPage extends Component {
  constructor() {
    super();
    this.state = {
      code: null,
      error: '',
      name: '',
    };
  }

  makePlayRequest = (token) => {
    const baseURI = 'https://api.spotify.com/v1';
    const url = baseURI + '/me/player/play';
    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: ['spotify:track:48wH8bAxvBJO2l14GmNLz7'] }), // wait for the moment
    })
      .then((response) => response.text())
      .then((content) => content.json())
      .then((json) => console.log(json))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  };

  handleJoinResponse = (content) => {
    let res;
    try {
      res = JSON.parse(content);
    } catch {
      return this.setState({ error: content.toLowerCase() });
    }

    const { token } = res; //id
    window.location.href = '/play?code=' + this.state.code + '&name=' + this.state.name + '&token=' + token;
  };

  joinRoom = (code, name) => {
    this.setState({ error: 'joining room ' + code.toString() + '...' });
    const url = baseURI + '/joinroom';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, name }),
    })
      .then((response) => response.text())
      .then((content) => this.handleJoinResponse(content))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  };

  render() {
    return (
      <div className="color_fill">
        <div className="container">
          {(!isMobile || isTall) && (
            <div className="logoContainer-join">
              <img alt="logo" src={logo} className="image small-logo" />
            </div>
          )}
          <p className="text">4 digit room code?</p>
          <ReactCodeInput
            type="number"
            fields={4}
            inputStyle={inputStyle}
            onChange={(code) => this.setState({ code, error: '' })}
          />
          <div style={{ height: '10px' }} />
          <p className="text">your name?</p>
          <TextInput onChange={(name) => this.setState({ name, error: '' })} />
          {this.state.error && <p style={{ color: 'tomato', marginBottom: '-10px' }}>{this.state.error}</p>}
          <div style={{ height: '30px' }} />
          {this.state.error.length === 0 && (
            <Clickable
              filled
              color="white"
              text={'join room'}
              onClick={() =>
                this.state.code == null || this.state.code.length < 4
                  ? this.setState({ error: 'incomplete room code' })
                  : this.state.name.length < 1
                  ? this.setState({ error: 'please enter your name' })
                  : this.joinRoom(this.state.code, this.state.name)
              }
            />
          )}

          <div style={{ height: '15px' }} />
          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: isMobile ? '15vh' : '5vh' }} />
        </div>
      </div>
    );
  }
}

export default JoinPage;
