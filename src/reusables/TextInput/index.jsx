import React, { useState } from 'react';
import './styles.css';

export const TextInput = () => {
  const [name, setName] = useState('');
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
};
