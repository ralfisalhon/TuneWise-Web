/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './styles.css';

export const Clickable = (props) => {
  const getButtonStyle = (filled, color, small) => {
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

  const getTextStyle = (filled, small) => {
    return {
      color: filled ? '#001255' : 'white',
      fontWeight: 'bold',
      outline: 'none',
      fontFamily: 'Courier New',
      fontSize: small ? '14px' : '22px',
    };
  };

  const { text, onClick, filled, color, small } = props;
  return (
    <span
      className="disable-selection"
      role="button"
      tabIndex={0}
      onClick={onClick}
      style={getButtonStyle(filled, color, small)}
    >
      <span style={getTextStyle(filled, small)}>{text}</span>
    </span>
  );
};

export default Clickable;
