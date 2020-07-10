import React from 'react';
import './styles.css';

export const TextInput = ({ placeholder, onChange }) => {
  return (
    <input className="input" placeholder={placeholder} maxLength={20} onChange={(e) => onChange(e.target.value)} />
  );
};
