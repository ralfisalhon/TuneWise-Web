import React, { useState } from 'react';
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

export const JoinPage = ({ setValues }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoinResponse = (content) => {
    let res;
    try {
      res = JSON.parse(content);
    } catch {
      return setError(content.toLowerCase());
    }

    const { token } = res; //id
    setValues({ code, name, token });
    window.location.href = '/play';
  };

  const joinRoom = () => {
    setError('joining room ' + code.toString() + '...');
    const url = baseURI + '/joinroom';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, name }),
    })
      .then((response) => response.text())
      .then((content) => handleJoinResponse(content))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  };

  return (
    <div className="color_fill">
      <div className="container">
        {(!isMobile || isTall) && (
          <center className="logoContainer-join">
            <img alt="logo" src={logo} className="image small-logo" />
          </center>
        )}
        <p className="text">4 digit room code?</p>
        <ReactCodeInput
          type="number"
          fields={4}
          inputStyle={inputStyle}
          onChange={(code) => {
            setCode(code);
            setError('');
          }}
        />
        <div style={{ height: '10px' }} />
        <p className="text">your name?</p>
        <TextInput
          onChange={(name) => {
            setName(name);
            setError('');
          }}
        />
        {error && <p style={{ color: 'tomato', marginBottom: '-10px' }}>{error}</p>}
        <div style={{ height: '30px' }} />
        {error.length === 0 && (
          <Clickable
            filled
            color="white"
            text={'join room'}
            onClick={() =>
              code == null || code.length < 4
                ? setError('incomplete room code')
                : name.length < 1
                ? setError('please enter your name')
                : joinRoom(code, name)
            }
          />
        )}

        <div style={{ height: '15px' }} />
        <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
        <div style={{ height: isMobile ? '15vw' : '' }} />
      </div>
    </div>
  );
};
