import React, { useState, useEffect } from 'react';
import { Clickable } from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import { playSong } from '../../js';
import logo from '../../assets/tunewise_logo.png';
import { isMobile, isTall, herokuURL } from './../../constants.js';
import './styles.css';

export const PlayPage = ({ values }) => {
  const [value, setValue] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({});
  const [message, setMessage] = useState('');
  const [settingSong, setSettingSong] = useState(false);
  const [score, setScore] = useState(0);

  const { code, name, token } = values;

  useEffect(() => {
    console.log('play screen values:', values);
  }, [values]);

  const search = (query, token) => {
    if (query.length < 3) return setTracks([]);
    query = query.split(' ').join('+');

    const baseURI = 'https://api.spotify.com/v1';
    const url = baseURI + '/search?type=track&limit=5&q=' + query;
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
      .then((tracks) => setTracks(tracks))
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser? Error:', error));
  };

  const startRound = (code, song_uri, song_id, user_name) => {
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
        console.log('res on startRound', res);
        playSong(token, song_uri, (error) => console.log('error in play', error));
      })
      .catch((error) => {
        console.log('error on startRound', error);
      });
  };

  const submit = () => {
    if (settingSong) {
      setSettingSong(false);
      setValue('');
      setTracks([]);
      setMessage(
        'other players will try to guess your song now. your song is ' +
          selectedTrack.name +
          ' by ' +
          selectedTrack.artists[0].name
      );
      return startRound(code, selectedTrack.uri, selectedTrack.id, name);
    }
    const url = herokuURL + '/guess';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, name: name + ' (' + (score + 1).toString() + ' pts)', id: selectedTrack.id }),
    })
      .then((response) => response.text())
      .then((content) => JSON.parse(content))
      .then((json) => {
        console.log('submit response json', json);
        const { correct, someone_won, winner_name } = json;

        if (correct && correct === 'true') {
          setSettingSong(true);
          setValue('');
          setTracks([]);
          setScore(score + 1);
          return setMessage('you got it! you pick the next song');
        }

        if (someone_won && winner_name) {
          if (winner_name === name) {
            setSettingSong(true);
            return setMessage('you won last round! you are picking the next song');
          }
          return setMessage(winner_name + ' found the song! they are picking the next song');
        }

        if (correct === 'false') {
          setValue('');
          return setMessage('your guess is incorrect');
        }
      })
      .catch((error) => {
        console.log('error on /submit:', error);
      });
  };

  return (
    <div>
      <div className="container" style={{ marginBottom: isMobile ? '15vw' : '' }}>
        {(!isMobile || isTall) && (
          <center className="logoContainer-play">
            <img alt="logo" src={logo} className="image small" />
          </center>
        )}
        {token && code && name ? (
          <>
            <h1 className="text name">
              {name}
              {' ('}
              {score.toString()}
              {')'}
            </h1>
            <p className="text">you are connected to session {code}</p>
            {message && (
              <p className="text" style={{ margin: '0px', padding: '0px', color: settingSong ? 'lime' : 'white' }}>
                {message}
              </p>
            )}
            <div style={{ height: '15px' }} />
            <TextInput
              placeholder={'enter song name'}
              value={value}
              style={{ width: isMobile ? '80vw' : '40vh' }}
              onChange={(value) => {
                if (message === 'your guess is incorrect') setMessage('');
                if (value.length < 3) setTracks([]);
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
              <div key={track.id}>
                <Clickable
                  small
                  text={track.name.substring(0, isTall ? 25 : 18) + ' - ' + track.artists[0].name.substring(0, 20)}
                  onClick={() => {
                    setValue(track.name + ' - ' + track.artists[0].name.substring(0, 20));
                    console.log('selected track', track);
                    setSelectedTrack(track);
                    setCanSubmit(true);
                  }}
                />
                <div style={{ height: '20px' }} />
              </div>
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
