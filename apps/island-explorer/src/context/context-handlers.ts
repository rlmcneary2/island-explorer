import { ActionHandler } from "reshape-state";
import { Dispatcher } from "reshape-state/types";
import { environment as env } from "../environments/environment";
import {
  ContextData,
  ContextState,
  Route,
  SelectedLandmark,
  Vehicle
} from "./types";
import toGeoJson from "@mapbox/togeojson";

const ACTION_FETCH_ROUTES_FINISHED = "fetch-routes-finished";
const INTERVAL_SECONDS = 60;

export function create(): ActionHandler<ContextState>[] {
  let fetchRouteVehiclesRouteId: number = null;
  let fetchVehiclesActive = false;

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

  const fetchRouteVehicles: ActionHandler<
    ContextState,
    { routeId: number; dispatchTime?: number }
  > = (state, action, dispatch) => {
    const isVehicleAction = action.id === actionIds.ACTION_FETCH_ROUTE_VEHICLES;
    const isReadyToStart = !fetchVehiclesActive && state?.routeId;

    if (!isVehicleAction && !isReadyToStart) {
      return [state];
    }

    const nextRouteId = action?.payload?.routeId || state?.routeId;

    if (fetchVehiclesActive && fetchRouteVehiclesRouteId === nextRouteId) {
      return [state];
    }

    fetchRouteVehiclesRouteId = nextRouteId;
    fetchVehiclesActive = true;

    fetch(
      `${env.apiLeft}/InfoPoint/rest/Vehicles/GetAllVehiclesForRoutes?routeIDs=${nextRouteId}`
    )
      .then(async response => {
        if (response.ok) {
          return { body: await response.json() };
        }

        let body: string;
        try {
          body = await response.text();
        } catch (err) {
          // Nothing to do here.
        }

        throw Error(`${response.status}${body ? `\nbody='${body}'` : ""}`);
      })
      .catch(error => {
        console.log("fetchRouteVehicles: catch.");
        return { body: null, error };
      })
      .then(data => {
        const { interval, lastDispatchTime } = getVehicleUpdateInterval(
          action.payload
        );

        console.log("fetchRouteVehicles: fetch dispatch.");

        dispatch(inlineState => [
          {
            ...inlineState,
            nextVehicleUpdate: Date.now() + interval,
            routeVehicles:
              "error" in data
                ? {
                    error: data.error,
                    status: "idle"
                  }
                : {
                    data: data.body,
                    status: "idle"
                  },
            routeVehicleHeadings: updateVehicleHeadings(inlineState, data.body)
          },
          true
        ]);

        setTimeout(() => {
          if (nextRouteId !== fetchRouteVehiclesRouteId) {
            return;
          }

          fetchVehiclesActive = false;

          console.log("fetchRouteVehicles: timeout dispatch.");

          dispatch({
            id: actionIds.ACTION_FETCH_ROUTE_VEHICLES,
            payload: {
              dispatchTime: lastDispatchTime + INTERVAL_SECONDS * 1000, // Always increment like a clock.
              routeId: nextRouteId
            }
          });
        }, interval);
      });

    return [
      {
        ...state,
        routeVehicles: { ...state.routeVehicles, status: "active" }
      },
      true
    ];
  };

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

      fetch(`${env.apiLeft}/InfoPoint/Resources/Traces/${traceFileName}`).then(
        response => handleTraceResponse(dispatch, response)
      );

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

    console.log(
      `handleRouteChanged: dispatching fetch vehicles for route ${action.payload}.`
    );

    // Always dispatch the request to get vehicles, the handler function will
    // verify if the fetch needs to be made.
    dispatch({
      id: actionIds.ACTION_FETCH_ROUTE_VEHICLES,
      payload: { routeId: action.payload }
    });

    return [(nextState as ContextState) ?? state, !!nextState];
  };

  const selectLandmark: ActionHandler<ContextState, SelectedLandmark> = (
    state,
    action
  ) => {
    if (action.id !== actionIds.ACTION_SELECT_LANDMARK) {
      return [state];
    }

    state.selectedLandmarks = [action.payload];
    return [state, true];
  };

  const deselectLandmark: ActionHandler<ContextState, number> = (
    state,
    action
  ) => {
    if (action.id !== actionIds.ACTION_DESELECT_LANDMARK) {
      return [state];
    }

    if (state.selectedLandmarks.some(x => x.landmarkId === action.payload)) {
      state.selectedLandmarks = [];
      return [state, true];
    }

    return [state];
  };

  return [
    deselectLandmark,
    fetchRoutes,
    fetchRoutesFinished,
    handleRouteChanged,
    fetchRouteVehicles,
    selectLandmark
  ];
}

export const actionIds = Object.freeze({
  ACTION_DESELECT_LANDMARK: "action-deselect-landmark",
  ACTION_FETCH_ROUTE_VEHICLES: "action-fetch-route-vehicles",
  ACTION_ROUTE_CHANGED: "action-route-changed",
  ACTION_SELECT_LANDMARK: "action-select-landmark"
});

function getVehicleUpdateInterval(payload: {
  routeId: number;
  dispatchTime?: number;
}) {
  const { dispatchTime = Date.now() + INTERVAL_SECONDS * 1000 } = payload;
  let lastDispatchTime = dispatchTime;
  const slipDispatchTime = Date.now() + INTERVAL_SECONDS * 1000;
  const processingTime = slipDispatchTime - lastDispatchTime;
  let interval = INTERVAL_SECONDS * 1000 - processingTime;
  if (interval < 0) {
    lastDispatchTime = Date.now();
    interval = 0;
  }

  return { interval, lastDispatchTime };
}

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

function updateVehicleHeadings(
  { routeVehicleHeadings }: ContextData,
  vehicles: Vehicle[]
) {
  if (!vehicles || !vehicles.length) {
    return;
  }

  const nextRouteVehicleHeadings: ContextData["routeVehicleHeadings"] = {};

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    const currentHeading: ContextData["routeVehicleHeadings"][0] =
      (routeVehicleHeadings && routeVehicleHeadings[vehicle.VehicleId]) ?? {
        currentHeading: vehicle.Heading,
        lastStop: vehicle.LastStop,
        previousHeadings: []
      };

    const nextHeading: Partial<typeof currentHeading> = {
      lastStop: vehicle.LastStop
    };

    if (currentHeading.lastStop === nextHeading.lastStop) {
      nextHeading.previousHeadings = currentHeading.previousHeadings.slice(
        0,
        4
      );
      nextHeading.previousHeadings.unshift(vehicle.Heading);
    } else {
      nextHeading.previousHeadings = [vehicle.Heading];
    }

    // Only provide a heading if the vehicle is moving.
    if (vehicle.Speed) {
      // I haven't really come up with a better solution than just using the
      // provided current heading even though it can appear as if the bus is
      // heading away from the next station depending on the map's resolution.
      nextHeading.currentHeading = vehicle.Heading;
    }

    nextRouteVehicleHeadings[vehicle.VehicleId] =
      nextHeading as typeof currentHeading;
  }

  return nextRouteVehicleHeadings;
}
