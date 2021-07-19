import React, { useEffect } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { INFORMATION, MAP } from "../constants/routes";
import Map from "./map";
import Information from "./information";
import useContextActions from "../context/use-context-actions";
import useContextState from "../context/use-context-state";

export function BusRoute() {
  // The `paramRouteId` from the URL params is passed to context to fetch data
  // from remote services and is used for application routing.
  const { routeId: paramRouteId } = useParams() as Record<string, string>;

  const { setRoute } = useContextActions();

  // To keep route information in state synchronized the `routeId` from state is
  // passed as a prop to child components that will use it to get the data they
  // need from state. Note that `paramRouteId` and `routeId` will not always
  // match!
  const routeId = useContextState(state => state.routeId);

  useEffect(() => {
    setRoute(+paramRouteId);
  }, [paramRouteId, setRoute]);

  return (
    <>
      <Map routeId={routeId} />
      <Route path={`*/${INFORMATION}`}>
        <Information routeId={routeId} />
      </Route>
    </>
  );
}
