import React from 'react';
import styled from '@emotion/styled';

export default function Map({ routeId }: Props) {
  return <MapStyled>{`Map route ${routeId || '?'}`}</MapStyled>;
}

const MapStyled = styled.div`
  background: lightblue;
  grid-column-start: 1;
  grid-row-start: 1;
`;

type Props = {
  routeId?: string;
};
