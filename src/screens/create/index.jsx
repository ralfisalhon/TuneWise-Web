import React, { useState, useEffect } from 'react';
import { Clickable } from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import logo from '../../assets/tunewise_logo.png';
import { isMobile, isTall, herokuURL } from './../../constants.js';
import { playSong } from '../../js';
import './styles.css';

export const CreatePage = ({ values, setValues }) => {
  const [token, setToken] = useState(values.token);
  const [name, setName] = useState('You');
  const [code, setCode] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    const checkPlayers = (code, remainingCalls = 50) => {
      console.count('in checkPlayers');
      const url = herokuURL + '/players?code=' + code;
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((users) => {
          if (remainingCalls > 0) {
            setTimeout(function () {
              checkPlayers(code, remainingCalls - 1);
            }, 8000);
          } else {
            setError('timed out');
            setCode('ERROR');
            return;
          }

          if (!users) return setCode('ERROR');
          // eslint-disable-next-line no-eval
          setUsers(eval(users));
        })
        .catch((error) => {
          setCode('ERROR');
          setError('cant check players in session');
        });
    };

    // bookroom
    if (token && !code) {
      const url = herokuURL + '/bookroom';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.text())
        .then((content) => JSON.parse(content))
        .then((json) => {
          let { code } = json;
          if (!code || code.length !== 4) return setError('ERROR');
          setCode(code);
          checkPlayers(code);
        })
        .catch((error) => {
          setCode('ERROR');
          setError('error on /bookRoom');
        });
    }
  }, [token, code]);

  const playFirstSong = (code, song_uri, song_id, user_name) => {
    const url = herokuURL + '/startround';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, song_uri, song_id, user_name }),
    })
      .then((response) => response.text())
      .then((res) => {
        playSong(
          token,
          song_uri,
          (error) => setError(error),
          () => (window.location.href = '/play')
        );
      })
      .catch((error) => {
        setError('please play and then pause a song on your spotify');
        console.log('couldnt play first song:', error);
      });
  };

  const handleJoinResponse = (content) => {
    let res;
    try {
      res = JSON.parse(content);
    } catch {
      return setError(content.toLowerCase());
    }

    playFirstSong(code, 'spotify:track:2cGxRwrMyEAp8dEbuZaVv6', '2cGxRwrMyEAp8dEbuZaVv6', name);

    setJoined(true);
    setToken(res.token); //id
  };

  const joinRoom = (code, name) => {
    setError('joining room ' + code.toString() + '...');
    const url = herokuURL + '/joinroom';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, name }),
    })
      .then((response) => response.text())
      .then((content) => handleJoinResponse(content))
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser?', error));
  };

  const startSession = () => {
    if (joined) return playFirstSong(code, 'spotify:track:2cGxRwrMyEAp8dEbuZaVv6', '2cGxRwrMyEAp8dEbuZaVv6', name);
    if (code.length === 4 && name.length > 0 && name !== 'You') {
      joinRoom(code, name);
    } else {
      setError('please enter your name');
    }
  };

  return (
    <div className="color_fill">
      <div className="container">
        {token ? (
          <>
            {(!isMobile || isTall) && (
              <div className="logoContainer-create">
                <img alt="logo" src={logo} className="image small" />
              </div>
            )}
            <div className="textContainer">
              <p className="text">your room code:</p>
            </div>

            {code && code.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className="text code">{code}</p>
                <p className="text" style={{ marginTop: '-5px' }}>
                  your name?
                </p>
                <TextInput
                  onChange={(name) => {
                    setName(name);
                    setError('');
                  }}
                />
                {error && (
                  <center>
                    <p style={{ color: 'tomato', marginBottom: '-10px', marginTop: '30px', width: '40vh' }}>{error}</p>
                  </center>
                )}
                {users.length > 0 && (
                  <center>
                    <div style={{ marginBottom: '30px' }} />
                    <Clickable text={'start session.'} filled color="white" onClick={() => startSession()} />
                  </center>
                )}
                <div style={{ marginBottom: '10px' }} />
                <p className="text mobile-break">
                  Connected Users: {users && users.map((user) => user.user_name + ', ')}
                  {joined ? name : ''}
                </p>
              </div>
            ) : (
              <p className="text">creating session...</p>
            )}

            <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
            <div style={{ height: isMobile ? '20vh' : '10vh' }} />
          </>
        ) : (
          <>
            <p className="text">something went wrong</p>
            <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          </>
        )}
      </div>
    </div>
  );
};
