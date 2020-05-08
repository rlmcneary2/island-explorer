import React from 'react';
import styled from '@emotion/styled';

export default function Information({ routeId }: Props) {
  return (
    <InformationStyled>{`Information route ${routeId ||
      '?'}`}</InformationStyled>
  );
}

const InformationStyled = styled.div`
  background: lightgreen;
  grid-column-start: 1;
  grid-row-start: 1;
`;

type Props = {
  routeId?: string;
};
