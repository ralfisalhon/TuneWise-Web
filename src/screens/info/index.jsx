import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;

class InfoPage extends Component {
  render() {
    return (
      <div>
        <div className="container">
          {!isMobile && (
            <div className="logoContainer-info">
              <img alt="logo" src={logo} className="image small" />
            </div>
          )}
          <p className="text">tunewise is a music centered party game.</p>
          <p className="text">one user's spotify account is used to play the music.</p>
          <p className="text">
            other players try to guess the songs being played. if they do, they win a point and play the next song.
          </p>
          <p className="text">
            we originally built tunewise as a mobile app at tufts polyhack 2019. shoutout to mohsin, nihal, san!
          </p>
          <p className="text">
            check out my other projects at <a href="https://ralfi.dev">ralfi.dev</a>
          </p>
          <br />

          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: '5vh' }} />
        </div>
      </div>
    );
  }
}

export default InfoPage;
