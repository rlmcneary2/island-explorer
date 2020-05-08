import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { INFORMATION, MAP } from '../constants/routes';

export default function Header() {
  const history = useHistory();
  const handleViewClick = useCallback(() => {
    const path = history.location.pathname
      .split('/')
      .map(x => {
        if (x === MAP) {
          return INFORMATION;
        } else if (x === INFORMATION) {
          return MAP;
        }
        return x;
      })
      .join('/');
    history.push(path);
  }, [history]);

  return (
    <HeaderStyled>
      <RouteButton>route</RouteButton>
      <ViewButton onClick={handleViewClick}>view</ViewButton>
    </HeaderStyled>
  );
}

const HeaderStyled = styled.div`
  display: flex;
  flex: 0 0 5rem;
  justify-content: space-between;
  width: 100%;
`;

const RouteButton = styled.button`
  flex: 100;
  height: 100%;
  max-width: 25rem;
  min-width: 15rem;
`;

const ViewButton = styled.button`
  flex: 75;
  height: 100%;
  max-width: 15rem;
  min-width: 10rem;
`;
