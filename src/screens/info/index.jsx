import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

class InfoPage extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="logoContainer">
            <img alt="logo" src={logo} className="image small" />
          </div>
          <p className="text">my name is ralfi</p>
          <p className="text">TuneWise does this cool thing "explain the cool thing"</p>
          <p className="text">we originally did it at tufts polyhack 2018. shoutout to mohsin, nihal, san</p>
          <p className="text">my website is ralfisalhon.github.io</p>
          <p className="text">peace</p>
          <br />

          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: '5vh' }} />
        </div>
      </div>
    );
  }
}

export default InfoPage;
