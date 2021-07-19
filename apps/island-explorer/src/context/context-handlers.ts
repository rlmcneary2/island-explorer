import { ActionHandler } from "reshape-state";
import { Dispatcher } from "reshape-state/types";
import { environment as env } from "../environments/environment";
import { ContextData, ContextState } from "./types";
import toGeoJson from "@mapbox/togeojson";

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
    fetch(`${env.apiLeft}/InfoPoint/rest/Routes/GetVisibleRoutes`)
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

  const handleRouteChanged: ActionHandler<ContextState, number> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== actionIds.ACTION_ROUTE_CHANGED) {
      return [state];
    }

    if (!state?.routes?.data || state?.routes?.status === "active") {
      console.log(
        "handleRouteChanged: actively fetching state.routes.data; dispatching same action again."
      );
      dispatch(action);
      return [state];
    }

    const { RouteTraceFilename: traceFileName } = state.routes.data.find(
      r => r.RouteId === action.payload
    );

    Promise.all([
      fetch(`${env.apiLeft}/InfoPoint/Resources/Traces/${traceFileName}`),
      fetch(
        `${env.apiLeft}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=${action.payload}`
      )
    ]).then(([traceResponse, stopsResponse]) => {
      handleTraceResponse(dispatch, traceResponse);
      handleStopsResponse(dispatch, stopsResponse);
    });

    return [
      {
        ...state,
        routeId: action.payload,
        routeStops: { status: "active" },
        routeTrace: { status: "active" }
      },
      true
    ];
  };

  return [fetchRoutes, handleRouteChanged];
}

export const actionIds = Object.freeze({
  ACTION_ROUTE_CHANGED: "action-route-changed"
});

async function handleStopsResponse(
  dispatch: Dispatcher<ContextState>,
  response: Response
) {
  let nextState: Partial<ContextState>;

  if (!response.ok) {
    nextState = { routeStops: { status: "idle", error: response.status } };
  } else {
    nextState = { routeStops: { data: await response.json(), status: "idle" } };
  }

  dispatch(state => [{ ...state, ...nextState }, true]);
}

async function handleTraceResponse(
  dispatch: Dispatcher<ContextState>,
  response: Response
) {
  let nextState: Partial<ContextState>;

  if (!response.ok) {
    nextState = { routeTrace: { status: "idle", error: response.status } };
  } else {
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/xml");
    const json = toGeoJson.kml(doc);
    nextState = { routeTrace: { data: json, status: "idle" } };
  }

  dispatch(state => [{ ...state, ...nextState }, true]);
}
