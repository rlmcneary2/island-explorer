import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "./header";
import Map from "./map";
import { INFORMATION, MAP } from "../constants/routes";
import Information from "../components/information";
import { getRouteParameters } from "../util/route";

const informationPath = `/:route*/${INFORMATION}`;
const mapPath = `/:route*/${MAP}`;

export default function Main() {
  const params = getRouteParameters();

  return (
    <div className="main">
      <Header />
      <div className="content">
        <Switch>
          <Route path={informationPath}>
            <Information routeId={params?.routeId} />
          </Route>
          <Route path={mapPath}>
            <Map routeId={params?.routeId} />
          </Route>
          <Redirect to={`/1/${MAP}`} />
        </Switch>
      </div>
    </div>
  );
}
