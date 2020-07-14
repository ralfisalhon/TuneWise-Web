import React, { useState } from 'react';
import Clickable from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';
import { useEffect } from 'react';

const isMobile = window.innerWidth <= 500;
const isTall = window.innerHeight > 650;

const baseURI = 'https://tunewise.herokuapp.com';

export const CreatePage = ({ values }) => {
  console.log('my token is', values.token);
  const [token, setToken] = useState(values.token);
  const [name, setName] = useState('You');
  const [code, setCode] = useState(null);
  const [limit, setLimit] = useState(100);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const checkPlayers = (code) => {
      console.log('in checkPlayers');
      const url = baseURI + '/players?code=' + code;
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((users) => {
          if (limit > 0) {
            setTimeout(function () {
              setLimit(limit - 1);
              checkPlayers(code);
            }, 8000);
          } else {
            setCode('ERROR');
            setError('timed out');
            return;
          }

          if (!users) return setCode('ERROR');
          // eslint-disable-next-line no-eval
          setUsers(eval(users));
        })
        .catch((error) => {
          console.log('error', error);
          setCode('ERROR');
          setError(error);
        });
    };

    // bookroom
    if (token && !code) {
      const url = baseURI + '/bookroom';
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
          console.log('error on /bookRoom:', error);
          setCode('ERROR');
          setError(error);
        });
    }
  }, [token, code, limit]);

  const makePlayRequest = (token, uri) => {
    console.log('my token is', token, 'uri is', uri);
    const baseURI = 'https://api.spotify.com/v1';
    const url = baseURI + '/me/player/play';
    fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }), // wait for the moment
    })
      .then((response) => response.text())
      .then((content) => content.json())
      .then((json) => console.log(json))
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser? Error:', error));
  };

  const playFirstSong = (code, song_uri, song_id, user_name) => {
    const url = baseURI + '/startround';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, song_uri, song_id, user_name }),
    })
      .then((response) => response.text())
      .then((res) => {
        console.log(res);
        makePlayRequest(token, song_uri);
        window.location.href = '/play?code=' + code + '&name=' + name + '&token=' + token;
      })
      .catch((error) => {
        console.log('error', error);
        setError(error);
      });
  };

  const handleJoinResponse = (content) => {
    let res;
    try {
      res = JSON.parse(content);
    } catch {
      return setError(content.toLowerCase());
    }

    playFirstSong(code, 'spotify:track:48wH8bAxvBJO2l14GmNLz7', '48wH8bAxvBJO2l14GmNLz7', name);

    setToken(res.token); //id
  };

  const joinRoom = (code, name) => {
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

  const startSession = () => {
    if (code.length === 4 && name.length > 0 && name !== 'You') {
      joinRoom(code, name);
    } else {
      setError('please enter a name');
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
              <p className="text">your friends can join with the following code:</p>
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
                {users.length > 0 && (
                  <span>
                    <div style={{ marginBottom: '30px' }} />
                    <Clickable text={'start session.'} filled color="white" onClick={() => startSession()} />
                    <div style={{ marginBottom: '10px' }} />
                    {error && <p style={{ color: 'tomato', marginBottom: '-10px' }}>{error}</p>}
                  </span>
                )}
                <div style={{ marginBottom: '10px' }} />
                <p className="text mobile-break">
                  Connected Users: {users && users.map((user) => user.user_name + ', ')}
                  {name}
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
