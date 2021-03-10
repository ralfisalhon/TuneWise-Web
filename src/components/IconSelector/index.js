import React, { useState } from 'react';
import { IconWrapper, IconBox } from './styles';

const ICONS = [1, 2, 3, 4, 5];

export const IconSelector = () => {
  const [iconIndex, setIconIndex] = useState(0);
  return (
    <IconWrapper>
      <SmallIcon />
      <BigIcon />
      <SmallIcon />
    </IconWrapper>
  );
};
