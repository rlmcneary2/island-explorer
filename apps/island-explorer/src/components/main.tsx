import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./header";
import Map from "./map";
import { INFORMATION } from "../constants/routes";
import { useContextState } from "../context/use-context-state";
import Information from "../components/information";

const informationPath = `/:route*/${INFORMATION}`;

export default function Main() {
  const ctx = useContextState(ctx => ({
    routeId: ctx?.routeId,
    routes: ctx?.routes,
  }));

  console.log("Main: ctx=", ctx);

  return (
    <div className="main">
      <Header />
      <div className="content">
        <Switch>
          <Route path={informationPath}>
            <Information routeId={ctx?.routeId} />
          </Route>
          <Route>
            <Map routeId={ctx?.routeId} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
