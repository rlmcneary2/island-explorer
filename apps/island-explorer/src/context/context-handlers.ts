import { ActionHandler } from "reshape-state";
import { Dispatcher } from "reshape-state/types";
import { environment as env } from "../environments/environment";
import { ContextData, ContextState, Route } from "./types";
import toGeoJson from "@mapbox/togeojson";

const ACTION_FETCH_ROUTES_FINISHED = "fetch-routes-finished";

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
      .then(async response => {
        if (response.ok) {
          return response.json();
        }

        let body: string;
        try {
          body = await response.text();
        } catch (err) {
          // Nothing to do here.
        }

        throw Error(`${response.status}${body ? `\nbody='${body}'` : ""}`);
      })
      .then(body => {
        dispatch({ id: ACTION_FETCH_ROUTES_FINISHED, payload: body });
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

  const fetchRoutesFinished: ActionHandler<ContextState, Route[]> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== ACTION_FETCH_ROUTES_FINISHED) {
      return [state];
    }

    state.routes = { data: action.payload, status: "idle" };

    if (state.routeId) {
      console.log(
        `fetchRoutesFinished: routeId '${state.routeId}' exists in state; dispatching route changed request.`
      );
      dispatch({ id: actionIds.ACTION_ROUTE_CHANGED, payload: state.routeId });
    }

    return [state, true];
  };

  /* TBD if needed */
  // const cacheRoutesData: ActionHandler<ContextState, Route[]> = (
  //   state,
  //   action,
  //   dispatch
  // ) => {
  //   if (action.id === ACTION_FETCH_ROUTES_FINISHED) {
  //     // We will cache all of these at service worker installation, but in case
  //     // the active routes change update what is cached. For each route add to
  //     // cache:
  //     //  - the KML file (trace)
  //     //     - https://acadia-explorer.netlify.app/api/InfoPoint/Resources/Traces/SandyBeach.kml
  //     //     - accept */*
  //     //  - stops request
  //     //     - https://acadia-explorer.netlify.app/api/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=3
  //     //     - accept */*
  //   }

  //   return [state];
  // };

  const handleRouteChanged: ActionHandler<ContextState, number> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== actionIds.ACTION_ROUTE_CHANGED) {
      return [state];
    }

    let nextState: Partial<ContextState>;

    // If the routeId has changed reset state to the point where it has no
    // routeTrace or routeStops.
    if (state?.routeId !== action.payload) {
      const { routeStops, routeTrace, ...remainingState } = state ?? {};

      nextState = {
        ...remainingState,
        routeId: action.payload
      };
    }

    // When there is no routeTrace, routeTrace is not being fetched, and the
    // data for all the routes is in state fetch the KML trace file.
    const routeState = nextState ?? state;
    const hasRoutes = !!state?.routes?.data && state.routes.status === "idle";
    if (
      !routeState?.routeTrace &&
      routeState?.routeTrace?.status !== "active" &&
      hasRoutes
    ) {
      const { RouteTraceFilename: traceFileName } = state.routes.data.find(
        r => r.RouteId === action.payload
      );

      fetch(
        `${env.apiLeft}/InfoPoint/Resources/Traces/${traceFileName}`
      ).then(response => handleTraceResponse(dispatch, response));

      nextState = {
        ...(nextState ?? state),
        routeTrace: { status: "active" }
      };
    }

    // When there is no routeStops and routeStops is not being fetched, fetch
    // the stops data for this route ID.
    if (
      !routeState?.routeStops &&
      routeState?.routeStops?.status !== "active"
    ) {
      fetch(
        `${env.apiLeft}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=${action.payload}`
      ).then(response => handleStopsResponse(dispatch, response));

      nextState = {
        ...(nextState ?? state),
        routeStops: { status: "active" }
      };
    }

    return [(nextState as ContextState) ?? state, !!nextState];
  };

  return [fetchRoutes, fetchRoutesFinished, handleRouteChanged];
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
