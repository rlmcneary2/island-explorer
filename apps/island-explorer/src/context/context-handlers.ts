import { ActionHandler } from "reshape-state";
import { ContextData, ContextState } from "./types";

export function create(): ActionHandler<ContextState>[] {
  const fetchRoutes: ActionHandler<ContextState, null> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== null) {
      return [state];
    }

    if (state && state.routes) {
      const { data, error, status } = state.routes;
      if (status === "active") {
        return [state];
      }

      if (data) {
        return [state];
      }

      if (error) {
        return [state];
      }
    }

    // Fetch the routes.
    fetch(
      "http://islandexplorertracker.availtec.com/InfoPoint/rest/Routes/GetVisibleRoutes"
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        throw Error(`${response.status}`);
      })
      .then(body => {
        dispatch(s => {
          s.routes = { data: body, status: "idle" };
          return [s, true];
        });
      })
      .catch(err => {
        console.error(err);
        dispatch(s => {
          s.routes = { error: err, status: "idle" };
          return [s, true];
        });
      });

    const nextState: ContextData = state ?? {};
    nextState.routes = { status: "active" };
    return [nextState as ContextState, true];
  };

  return [fetchRoutes];
}

export const actionIds = Object.freeze({
  ACTION_ROUTE_CHANGED: "action-route-changed",
});
