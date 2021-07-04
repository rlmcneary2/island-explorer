import React, { useEffect } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { INFORMATION, MAP } from "../constants/routes";
import Map from "./map";
import Information from "./information";
import useContextActions from "../context/use-context-actions";

export function BusRoute() {
  const { routeId } = useParams() as Record<string, string>;
  const { setRoute } = useContextActions();

  useEffect(() => {
    setRoute(+routeId);
  }, [routeId, setRoute]);

  return (
    <Switch>
      <Route path={`*/${INFORMATION}`}>
        <Information routeId={routeId} />
      </Route>
      <Route path={`*/${MAP}`}>
        <Map routeId={+routeId} />
      </Route>
    </Switch>
  );
}

interface Props {
  routeId: string;
}
