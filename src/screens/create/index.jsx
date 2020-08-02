import React, { useState, useEffect } from 'react';
import { Clickable } from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import logo from '../../assets/tunewise_logo.png';
import { isMobile, isTall, herokuURL } from './../../constants.js';
import { playSong } from '../../js';
import './styles.css';

const song_uri = 'spotify:track:48wH8bAxvBJO2l14GmNLz7';
const baseURI = 'https://api.spotify.com/v1';
const url = baseURI + '/me/player/pause';

export const CreatePage = ({ values, setValues }) => {
  const token = values.token;
  const [name, setName] = useState('You');
  const [code, setCode] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const checkPlayers = (code, remainingCalls = 50) => {
      const url = herokuURL + '/players?code=' + code;
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((users) => {
          console.log('users is', users);
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
          setError('cant check players in session.');
        });
    };

    // bookroom
    if (token && !code) {
      setError('creating session...');
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
          if (!code || code.length !== 4) return setError('please try again.');
          setCode(code);
          checkPlayers(code);
          setError('');
        })
        .catch((error) => {
          setCode('ERROR');
          setError('error on /bookRoom');
        });
    }
  }, [token, code]);

  const handleJoinResponse = (content) => {
    setJoined(true);
    try {
      JSON.parse(content);
    } catch {
      return setError(content.toLowerCase());
    }

    checkPlaySong();
  };

  const checkPlaySong = () => {
    playSong(
      token,
      song_uri,
      (error) => setError(error),
      () => {
        fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((content) => {
            const status = content.status;
            if (status === 403 || status === 404) {
              setError('could not authenticate. please login with spotify again.');
            }
            if (status === 401 || status === 404) {
              setError('no active spotify device found. play then pause any song on your device and retry.');
            } else if (status === 204) {
              setValues({
                code,
                name,
                token,
                isHost: true,
              });
              window.location.href = '/play';
            }
          })
          .catch((error) => {
            console.log('error on /playSong:', error);
            setError('something went wrong. check console.');
          });
      }
    );
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
    if (joined) return checkPlaySong();
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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {code && (
                <>
                  <p className="text">your room code:</p>
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
                </>
              )}
              {error && (
                <center>
                  <p style={{ color: 'tomato', marginBottom: '-10px', marginTop: '30px', width: '40vh' }}>{error}</p>
                  <div style={{ marginBottom: '10px' }} />
                </center>
              )}
              {users.length >= 0 && (
                <center>
                  <div style={{ marginBottom: '30px' }} />
                  {code && <Clickable text={'start session.'} filled color="white" onClick={() => startSession()} />}
                </center>
              )}
              <div style={{ marginBottom: '10px' }} />
              {code && (
                <p className="text mobile-break">
                  Connected Users: {users && users.map((user) => user.user_name + ', ')}
                  {!joined ? name : ''}
                </p>
              )}
            </div>

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
