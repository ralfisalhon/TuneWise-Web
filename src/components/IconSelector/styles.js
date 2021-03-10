import styled from 'styled-components/macro';

export const IconWrapper = styled.div``;

export const IconBox = styled.div`
  p {
    margin: 0;
  }
`;

export const IconTitle = styled.p`
  font-size: 24px;
  ${({ thick }) => thick && `font-weight: bolder; `}
`;
