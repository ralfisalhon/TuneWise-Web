import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import { TextInput } from '../../reusables/TextInput';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;
const isTall = window.innerHeight > 650;

const baseURI = 'https://tunewise.herokuapp.com';

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.apiToken,
      name: 'You',
      code: null,
      limit: 100,
      users: [],
    };
  }

  checkPlayers = (code) => {
    console.log('in checkPlayers');
    // const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/players?code=' + code;
    let that = this;
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((users) => {
        if (this.state.limit > 0) {
          setTimeout(function () {
            that.setState({ limit: that.state.limit - 1 });
            that.checkPlayers(code);
          }, 8000);
        } else {
          return this.setState({ code: 'ERROR', error: 'timed out' });
        }

        if (!users) return this.setState({ code: 'ERROR', error: 'no users' });
        // eslint-disable-next-line no-eval
        this.setState({ users: eval(users) });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ code: 'ERROR', error });
      });
  };

  bookRoom = (token) => {
    // const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
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
        if (!code || code.length !== 4) return this.setState({ code: 'ERROR' });
        this.setState({ code });
        this.checkPlayers(code);
      })
      .catch((error) => {
        console.log('error on /bookRoom:', error);
        this.setState({ code: 'ERROR', error });
      });
  };

  getPlayers = (code) => {
    // const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/players';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.text())
      .then((content) => JSON.parse(content))
      .then((json) => {
        let { users } = json;
        if (users && users.length > 0) return this.setState({ users });
        return this.setState({ users: 'None' });
      })
      .catch((error) => {
        console.log(error);
        // this.setState({ error });
      });
  };

  componentDidMount() {
    if (this.state.token && !this.state.code) {
      this.bookRoom(this.state.token);
    }
  }

  makePlayRequest = (token, uri) => {
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

  playFirstSong = (code, song_uri, song_id, user_name) => {
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
        this.makePlayRequest(this.state.token, song_uri);
        window.location.href =
          '/play?code=' + this.state.code + '&name=' + this.state.name + '&token=' + this.state.token;
      })
      .catch((error) => {
        console.log(error);
        // this.setState({ error });
      });
  };

  handleJoinResponse = (content) => {
    let res;
    try {
      res = JSON.parse(content);
    } catch {
      return this.setState({ error: content.toLowerCase() });
    }

    const { name, code } = this.state;
    this.playFirstSong(code, 'spotify:track:48wH8bAxvBJO2l14GmNLz7', '48wH8bAxvBJO2l14GmNLz7', name);

    const { token } = res;
    this.setState({ token });
  };

  joinRoom = (code, name) => {
    this.setState({ error: 'joining room ' + code.toString() + '...' });
    // const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/joinroom';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, name }),
    })
      .then((response) => response.text())
      .then((content) => this.handleJoinResponse(content))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  };

  startSession() {
    const { code, name } = this.state;
    if (code.length === 4 && name.length > 0 && name !== 'You') {
      this.joinRoom(code, name);
    } else {
      this.setState({ error: 'please enter a name' });
    }
  }

  render() {
    const { code, users } = this.state;
    return (
      <div className="color_fill">
        <div className="container">
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
              <TextInput onChange={(name) => this.setState({ name, error: '' })} />
              {users.length > 0 && (
                <span>
                  <div style={{ marginBottom: '30px' }} />
                  <Clickable text={'start session.'} filled color="white" onClick={() => this.startSession()} />
                  <div style={{ marginBottom: '10px' }} />
                  {this.state.error && <p style={{ color: 'tomato', marginBottom: '-10px' }}>{this.state.error}</p>}
                </span>
              )}
              <div style={{ marginBottom: '10px' }} />
              <p className="text mobile-break">
                Connected Users: {users && users.map((user) => user.user_name + ', ')}
                {this.state.name}
              </p>
            </div>
          ) : (
            <p className="text">creating session...</p>
          )}

          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: isMobile ? '20vh' : '10vh' }} />
        </div>
      </div>
    );
  }
}

export default CreatePage;
