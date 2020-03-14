import React from 'react';
import s from './styles';
import './App.css';
import Clickable from './reusables/clickable';

import logo from './assets/tunewise_logo.png';

function App() {
  return (
    <div className="wrapper">
      <div className="inner">
        <p className="text">_____ get ur bop on _____</p>
        <div className="logoContainer">
          <img alt="logo" src={logo} className="image" />
        </div>
        <Clickable filled text={'create session.'} color="white" onClick={() => alert('Create Session')} />
        <p className="text">_____ or _____</p>
        <Clickable text={'join existing.'} onClick={() => alert('Join Existing')} />
      </div>
    </div>
  );
}

export default App;
