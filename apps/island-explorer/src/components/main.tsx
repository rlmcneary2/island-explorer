import React from "react";
import { Redirect, Route, Switch, useParams } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import Map from "./map";
import { INFORMATION, MAP } from "../constants/routes";
import Information from "../components/information";
import { getRouteParameters } from "../util/route";

export default function Main() {
  const params = getRouteParameters();

  return (
    <div className="main">
      <Header />
      <div className="content">
        <Switch>
          <Route path="/:routeId/:routePage">
            <Switcher />
          </Route>
          <Redirect to={`/1/${MAP}`} />
        </Switch>
      </div>
      <ModalContainer />
    </div>
  );
}

function Switcher() {
  const { routeId } = useParams() as Record<string, string>;

  return (
    <Switch>
      <Route path={`/:routeId/${INFORMATION}`}>
        <Information routeId={routeId} />
      </Route>
      <Route path={`/:routeId/${MAP}`}>
        <Map routeId={routeId} />
      </Route>
    </Switch>
  );
}
