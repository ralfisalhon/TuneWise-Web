import React, { useState } from 'react';
import Clickable from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;
const isTall = window.innerHeight > 650;
const baseURI = 'https://tunewise.herokuapp.com';

export const PlayPage = () => {
  const [value, setValue] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({});

  let urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  let name = urlParams.get('name');
  let token = urlParams.get('token');

  const search = (query, token) => {
    if (query.length < 3) return setTracks([]);
    query = query.split(' ').join('+');

    const baseURI = 'https://api.spotify.com/v1';
    const url = baseURI + '/search?type=track&limit=10&q=' + query;
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((content) => JSON.parse(content).tracks.items)
      // .then((ree) => {
      //   console.log(ree);
      // })
      .then((tracks) => setTracks(tracks))
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser? Error:', error));
  };

  const submit = () => {
    const url = baseURI + '/guess';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, user_id: 'NONE', guess_id: selectedTrack.id }),
    })
      .then((response) => response.text())
      // .then((content) => JSON.parse(content))
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log('error on /submit:', error);
      });
  };

  return (
    <div>
      <div className="container">
        {(!isMobile || isTall) && (
          <div className="logoContainer-play">
            <img alt="logo" src={logo} className="image small" />
          </div>
        )}
        {token && code && name ? (
          <>
            <h1 className="text name">{name}</h1>
            <p className="text">you are connected to session {code}</p>
            <div style={{ height: '15px' }} />
            <TextInput
              placeholder={'enter song name'}
              value={value}
              style={{ width: isMobile ? '80vw' : '40vh' }}
              onChange={(value) => {
                setValue(value);
                setCanSubmit(false);
              }}
            />
            <div style={{ height: '20px' }} />
            <div className="row">
              <Clickable
                text="search"
                onClick={() => {
                  search(value, token);
                }}
              />
              {canSubmit && (
                <>
                  <div style={{ width: '10px' }} />
                  <Clickable filled color="white" text="submit" onClick={() => submit()} />
                </>
              )}
            </div>
            <div style={{ height: '20px' }} />
            {tracks.map((track) => (
              <p
                key={track.id}
                className="songResult"
                onClick={() => {
                  setValue(track.name + ' - ' + track.artists[0].name);
                  setSelectedTrack(track);
                  setCanSubmit(true);
                }}
              >
                {track.name.substring(0, 20)}
                {track.name.length > 20 && '...'} - {track.artists[0].name}
              </p>
            ))}
          </>
        ) : (
          <>
            <p className="text">error</p>
            <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          </>
        )}
      </div>
    </div>
  );
};
