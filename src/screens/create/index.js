import React, { Component } from 'react';
import Clickable from '../../reusables/clickable';
import ReactCodeInput from 'react-code-input';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;

const inputStyle = {
  width: '50px',
  height: '50px',
  marginLeft: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '5px',
  fontSize: '22px',
  fontWeight: '800',
};

const baseURI = 'https://tunewise.herokuapp.com';

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiToken: this.props.apiToken,
    };
  }

  bookRoom = async (accessToken) => {
    console.log('Making fetch request with token ' + accessToken);
    fetch(baseURI + '/bookroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        token: accessToken,
      }),
    })
      .then((response) => console.log(response.json()))
      .catch((error) => console.log('ERROR!!! -> ' + error));
  };

  componentDidMount() {
    this.bookRoom(this.state.apiToken);
  }

  render() {
    return (
      <div className="color_fill">
        <div className="container">
          <div className="logoContainer">
            <img alt="logo" src={logo} className="image small" />
          </div>
          <p className="text">token:</p>
          <p className="text">{this.state.apiToken}</p>

          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: isMobile ? '20vh' : '10vh' }} />
        </div>
      </div>
    );
  }
}

export default CreatePage;
