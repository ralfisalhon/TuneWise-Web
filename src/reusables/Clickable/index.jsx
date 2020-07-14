/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import './styles.css';
import PropTypes from 'prop-types';

class Clickable extends Component {
  getButtonStyle = (filled, color, small) => {
    return {
      border: small ? '1px solid white' : '2px solid white',
      borderRadius: '100px',
      padding: small ? '5px 10px 5px 10px' : '15px 30px 15px 30px',
      outline: 'none',
      backgroundColor: filled ? color : 'none',
      cursor: 'pointer',
      textAlign: 'center',
      wordWrap: 'none',
    };
  };

  getTextStyle = (filled, small) => {
    return {
      color: filled ? '#001255' : 'white',
      fontWeight: 'bold',
      outline: 'none',
      fontFamily: 'Courier New',
      fontSize: small ? '14px' : '22px',
    };
  };

  render() {
    const { text, onClick, filled, color, small } = this.props;
    return (
      <span
        className="disable-selection"
        role="button"
        tabIndex={0}
        onClick={onClick}
        style={this.getButtonStyle(filled, color, small)}
      >
        <span style={this.getTextStyle(filled, small)}>{text}</span>
      </span>
    );
  }
}

Clickable.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  filled: PropTypes.bool,
  color: PropTypes.string,
};

Clickable.defaultProps = {
  filled: false,
  color: '#001255',
};

export default Clickable;
