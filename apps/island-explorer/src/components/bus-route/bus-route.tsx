import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContextData } from "../../context/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { BusRouteView } from "./bus-route-view";

export function BusRoute() {
  // The `paramRouteId` from the URL params is passed to context to fetch data
  // from remote services and is used for application routing.
  const { routeId: paramRouteId } = useParams() as Record<string, string>;

  // To keep route information in state synchronized the `routeId` from state is
  // passed as a prop to child components that will use it to get the data they
  // need from state. Note that `paramRouteId` and `routeId` will not always
  // match!
  const { routeId } = useContextState(selector);

  const { setRoute } = useContextActions();

  useEffect(() => {
    if (!paramRouteId || routeId === +paramRouteId) {
      return;
    }

    setRoute(+paramRouteId);
  }, [paramRouteId, routeId, setRoute]);

  return <BusRouteView />;
}

function selector({ routeId }: ContextData) {
  return { routeId };
}
