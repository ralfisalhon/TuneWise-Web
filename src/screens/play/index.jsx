import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;

class PlayPage extends Component {
  render() {
    return (
      <div>
        <div className="container">
          {!isMobile && (
            <div className="logoContainer-info">
              <img alt="logo" src={logo} className="image small" />
            </div>
          )}
          <p className="text">You have joined the game!</p>
          <p className="text">Give your host a moment before you're visible on the session.</p>
        </div>
      </div>
    );
  }
}

export default PlayPage;
