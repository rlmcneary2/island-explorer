import React from 'react';
import styled from '@emotion/styled';
import { Redirect, Route } from 'react-router-dom';
import Header from './header';
import Map from './map';
import { INFORMATION, MAP } from '../constants/routes';
import useContent from '../state/content/use-content';
import Information from '../components/information';

const informationPath = `/:route*/${INFORMATION}`;

export default function Main() {
  const routeId = useContent<string>(s => s.routeId);
  // const routes = useContent(s => s.routes);

  return (
    <MainStyled>
      <Header />
      <Content>
        <Map routeId={routeId} />
        <Route path={informationPath}>
          <Information routeId={routeId} />
        </Route>
        <Redirect to={MAP} />
      </Content>
    </MainStyled>
  );
}

const MainStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  height: 100%;
`;
