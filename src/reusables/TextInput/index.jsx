import React from 'react';
import './styles.css';

export const TextInput = ({ placeholder, onChange, value, ...props }) => {
  return (
    <input
      className="input"
      value={value}
      placeholder={placeholder}
      maxLength={20}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
};
