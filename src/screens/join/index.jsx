import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import ReactCodeInput from 'react-code-input';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;
const baseURI = 'http://tunewise.herokuapp.com';

const inputStyle = {
  width: '50px',
  height: '50px',
  marginLeft: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '5px',
  fontSize: '24px',
  fontWeight: '800',
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

  handleJoinResponse = (content) => {
    console.log(content);

    let res = 'HI';
    try {
      res = JSON.parse(content);
    } catch {
      this.setState({ error: content.toLowerCase() });
      return;
    }

    //   let obj = text.json();
    console.log('res is', res);
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
          <div className="logoContainer">
            <img alt="logo" src={logo} className="image small-logo" />
          </div>
          <p className="text">4 digit room code?</p>
          <ReactCodeInput
            type="number"
            fields={4}
            inputStyle={inputStyle}
            onChange={(code) => this.setState({ code, error: '' })}
          />
          <div style={{ height: '10px' }} />
          <p className="text">your name?</p>
          <TextInput onChange={(name) => this.setState({ name })} />
          {this.state.error && <p style={{ color: 'tomato' }}>{this.state.error}</p>}
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
          <div style={{ height: isMobile ? '20vh' : '10vh' }} />
        </div>
      </div>
    );
  }
}

export default JoinPage;
