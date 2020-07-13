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
      apiToken: this.props.apiToken,
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
      .catch((error) => this.setState({ error }));
  };

  componentDidMount() {
    if (this.state.apiToken && !this.state.code) {
      this.bookRoom(this.state.apiToken);
    }
  }

  startSession() {
    const { code, name } = this.state;
    if (code.length === 4 && name.length > 0) {
      alert('boop all is good');
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
