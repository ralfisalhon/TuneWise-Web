import React, { Component } from 'react';
import Clickable from '../../reusables/clickable';
import ReactCodeInput from 'react-code-input';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;

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
    };
  }

  render() {
    return (
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
              this.state.code == null || this.state.code.length < 4
                ? alert('Enter the 4 digit code')
                : alert('joining with code ' + this.state.code)
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
