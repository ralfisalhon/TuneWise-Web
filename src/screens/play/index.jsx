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
  const [message, setMessage] = useState('');
  const [settingSong, setSettingSong] = useState(false);

  let urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  let name = urlParams.get('name');
  let token = urlParams.get('token');

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
      // .then((ree) => {
      //   console.log(ree);
      // })
      .then((tracks) => setTracks(tracks))
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser? Error:', error));
  };

  const playSong = (token, uri) => {
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
      body: JSON.stringify({ uris: [uri] }),
    })
      .then((response) => response.text())
      .then((content) => content.json())
      .then((json) => console.log(json))
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser? Error:', error));
  };

  const startRound = (code, song_uri, song_id, user_name) => {
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
        playSong(token, song_uri);
      })
      .catch((error) => {
        console.log(error);
        // this.setState({ error });
      });
  };

  const submit = () => {
    if (settingSong) {
      setSettingSong(false);
      setValue('');
      setTracks([]);
      setMessage('other players will try to guess your song now');
      return startRound(code, selectedTrack.uri, selectedTrack.id, name);
    }
    const url = baseURI + '/guess';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, name, id: selectedTrack.id }),
    })
      .then((response) => response.text())
      .then((content) => JSON.parse(content))
      .then((json) => {
        console.log(json);
        const { correct, someone_won, winner_name } = json;

        if (correct && correct === 'true') {
          setSettingSong(true);
          setValue('');
          setTracks([]);
          return setMessage('you got it! you pick the next song');
        }

        if (someone_won && winner_name) {
          if (winner_name === name) {
            setSettingSong(true);
            return setMessage('you won last round! you are picking the next song');
          }
          return setMessage(winner_name + ' found the song! they now pick the next song');
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
          <div className="logoContainer-play">
            <img alt="logo" src={logo} className="image small" />
          </div>
        )}
        {token && code && name ? (
          <>
            <h1 className="text name">{name}</h1>
            <p className="text">you are connected to session {code}</p>
            {message && (
              <p className="text" style={{ margin: '0px', padding: '0px', color: settingSong ? 'green' : 'white' }}>
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
                  text={track.name.substring(0, isTall ? 28 : 18) + ' - ' + track.artists[0].name.substring(0, 20)}
                  onClick={() => {
                    setValue(track.name + ' - ' + track.artists[0].name.substring(0, 20));
                    console.log(track);
                    setSelectedTrack(track);
                    setCanSubmit(true);
                  }}
                />
                <div style={{ height: '20px' }} />
              </div>
              // <p
              //   key={track.id}
              //   className="songResult"
              // onClick={() => {
              //   setValue(track.name + ' - ' + track.artists[0].name);
              //   console.log(track);
              //   setSelectedTrack(track);
              //   setCanSubmit(true);
              // }}
              // >
              //   {track.name.substring(0, 25)}
              //   {track.name.length > 25 && '...'} - {track.artists[0].name}
              // </p>
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
