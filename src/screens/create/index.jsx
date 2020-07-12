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
      code: null,
      users: [],
    };
  }

  checkPlayers = (code) => {
    console.log('in checkPlayers');
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/players?code=' + code;
    let that = this;
    fetch(proxyurl + url, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((users) => {
        setTimeout(function () {
          // that.checkPlayers(code);
        }, 10000);

        console.log(users);

        if (!users) return this.setState({ code: 'ER4OR' });
        // eslint-disable-next-line no-eval
        this.setState({ users: eval(users) });
      })
      .catch((error) => {
        console.log('error on /players:', error);
        this.setState({ code: 'ERROR' });
      });
  };

  bookRoom = (token) => {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/bookroom';
    fetch(proxyurl + url, {
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
        this.setState({ code: 'ERROR' });
      });
  };

  getPlayers = (code) => {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // https://stackoverflow.com/a/43881141
    const url = baseURI + '/players';
    fetch(proxyurl + url, {
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
      .catch((error) => console.log('Can’t access ' + url + ' response. Blocked by browser?', 'error:', error));
  };

  componentDidMount() {
    if (this.state.apiToken && !this.state.code) {
      this.bookRoom(this.state.apiToken);
    }
  }

  startSession() {
    if (this.state.code.length === 4) {
      alert('boop');
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
              <div style={{ marginBottom: '30px' }} />
              <Clickable text={'start session.'} filled color="white" onClick={() => this.startSession()} />
              <div style={{ marginBottom: '20px' }} />
              <div className="row">
                <p className="text">Connected Users:</p>
                {users &&
                  users.map((user) => (
                    <p className="text" key={user.user_id}>
                      {user.user_name + ','}
                    </p>
                  ))}
              </div>
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
