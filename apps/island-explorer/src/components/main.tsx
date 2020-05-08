import React from 'react';
import styled from '@emotion/styled';
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from './header';
import Map from './map';
import { INFORMATION, MAP } from '../constants/routes';
import useContent from '../state/content/use-content';

const informationPath = `/:route*/${INFORMATION}`;
const mapPath = `/:route*/${MAP}`;

export default function Main() {
  const routeId = useContent<string>(s => s.routeId);
  // const routes = useContent(s => s.routes);

  return (
    <MainStyled>
      <Header />
      <Switch>
        <Route path={informationPath}>Hello information!</Route>
        <Route path={mapPath}>
          <Map routeId={routeId} />
        </Route>
        <Redirect to={MAP} />
      </Switch>
    </MainStyled>
  );
}

const MainStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
