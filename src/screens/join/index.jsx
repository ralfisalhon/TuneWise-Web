import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import ReactCodeInput from 'react-code-input';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;
const isTall = window.innerHeight > 650;

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

  searchSong = async (accessToken, query) => {
    if (query.length === 0) this.setState({ searchResults: [] });
    if (query.length < 3) return;
    query = query.split(' ').join('+');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async (e) => {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        let data = xhr.responseText;
        let obj = JSON.parse(data);
        let temp = obj.tracks.items;

        // remove all songs without preview_url

        this.setState({ searchResults: temp });
        console.log('RALFIII');
        console.log(obj.tracks.items);
      } else if (xhr.status === 401) {
        alert('Your token expired');
      } else console.warn('Something went wrong on searchSong');
    };
    xhr.open('GET', 'https://api.spotify.com/v1/search?type=track&limit=10&q=' + query);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  };

  makePlayRequest = (token) => {
    console.log('my token is', token);
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

    const { id, token } = res;
    this.makePlayRequest(token);
  };

  joinRoom = (code, name) => {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/joinroom';
    fetch(proxyurl + url, {
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
          {!isMobile ||
            (isTall && (
              <div className="logoContainer-join">
                <img alt="logo" src={logo} className="image small-logo" />
              </div>
            ))}
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
          <div style={{ height: '15px' }} />
          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: isMobile ? '15vh' : '5vh' }} />
        </div>
      </div>
    );
  }
}

export default JoinPage;
