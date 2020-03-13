import React from 'react';
import s from './styles';

import logo from './assets/tunewise_logo.png';

function App() {
  return (
    <div style={s.container}>
      <img alt="profile_pic" className="img" src={logo} style={s.image} />

      <h1>Yo</h1>
    </div>
  );
}

export default App;
