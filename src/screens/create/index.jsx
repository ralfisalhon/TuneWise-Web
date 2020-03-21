import React, { Component } from 'react';
import Clickable from '../../reusables/Clickable';
import './styles.css';

import logo from '../../assets/tunewise_logo.png';

const isMobile = window.innerWidth <= 500;

const baseURI = 'https://tunewise.herokuapp.com';

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiToken: this.props.apiToken,
      code: null,
    };
  }

  bookRoom = async (accessToken) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        let data = xhr.responseText;
        let obj = JSON.parse(data.replace(/\r?\n|\r/g, ''));
        this.setState({ code: obj.code });
      } else {
        this.setState({ code: 'ERROR' });
      }
    };
    xhr.open('POST', baseURI + '/bookroom');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('token=' + accessToken);
  };

  componentDidMount() {
    if (this.state.apiToken && !this.state.code) {
      this.bookRoom(this.state.apiToken);
    }
  }

  render() {
    return (
      <div className="color_fill">
        <div className="container">
          <div className="logoContainer">
            <img alt="logo" src={logo} className="image small" />
          </div>
          <p className="text">Your friends can join with the following code:</p>
          <p className="text code">{this.state.code}</p>

          <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
          <div style={{ height: isMobile ? '20vh' : '10vh' }} />
        </div>
      </div>
    );
  }
}

export default CreatePage;
