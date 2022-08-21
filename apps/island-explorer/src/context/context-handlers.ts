import { isEqual as _isEqual } from "lodash";
import { ActionHandler } from "reshape-state";
import { environment as env } from "../environments/environment";
import { Landmark, RoutesAssetItem } from "../types/types";
import { ContextData, SelectedLandmark, Vehicle } from "./types";

const ACTION_FETCH_ROUTES_FINISHED = "fetch-routes-finished";
const INTERVAL_SECONDS = 15;

export function create(): ActionHandler<ContextData>[] {
  const fetchLandmarks: ActionHandler<ContextData, null> = (
    state,
    _,
    dispatch
  ) => {
    if (state?.landmarks) {
      return [state];
    }

    fetch("../assets/landmarks.json")
      .catch(error => ({ error }))
      .then(async response => {
        if ("error" in response) {
          dispatch(inlineState => [
            {
              ...inlineState,
              landmarks: { error: response.error, status: "idle" }
            },
            true
          ]);
          return;
        }

        const data = (await response.json()) as { landmarks: Landmark[] };
        dispatch(inlineState => [
          {
            ...inlineState,
            landmarks: { data: data.landmarks, status: "idle" }
          },
          true
        ]);
      });

    const result: ContextData = { ...state, landmarks: { status: "active" } };
    return [result, true];
  };

  const fetchRoutes: ActionHandler<ContextData, null> = (
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

    // OLD - now use a JSON data file.
    // fetch(`${env.apiLeft}/InfoPoint/rest/Routes/GetVisibleRoutes`)

    fetch("../assets/routes.json")
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
      .then((body: { routes: RoutesAssetItem[] }) => {
        dispatch({ id: ACTION_FETCH_ROUTES_FINISHED, payload: body.routes });
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
    return [nextState, true];
  };

  const fetchRoutesFinished: ActionHandler<ContextData, RoutesAssetItem[]> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== ACTION_FETCH_ROUTES_FINISHED) {
      return [state];
    }

    state.routes = { data: action.payload, status: "idle" };
    return [state, true];
  };

  const fetchRouteTrace: ActionHandler<ContextData, null> = (
    state,
    _,
    dispatch
  ) => {
    if (state?.routeTrace || !state?.routeId) {
      return [state];
    }

    fetch(`../assets/trace-${state.routeId}.json`)
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
      .then(data => {
        dispatch(inlineState => {
          const nextState: ContextData = {
            ...inlineState,
            routeTrace: { data, status: "idle" }
          };

          return [nextState, true];
        });
      })
      .catch(err => {
        console.error(err);
        dispatch(s => {
          s.routes = { error: err, status: "idle" };
          return [s, true];
        });
      });

    return [
      {
        ...state,
        routeTrace: { status: "active" }
      }
    ];
  };

  const fetchRouteVehicles: ActionHandler<
    ContextData,
    { dispatchTime?: number; routeId?: number }
  > = (state, action, dispatch) => {
    if (!state.routeId) {
      return [state];
    }

    if (action.payload?.routeId && action.payload?.routeId !== state.routeId) {
      return [state];
    }

    if (state.routeVehicles) {
      if (action.id !== actionIds.ACTION_FETCH_ROUTE_VEHICLES) {
        return [state];
      }

      if (state.routeVehicles.status !== "idle") {
        return [state];
      }
    }

    const requestedRouteId = state.routeId;

    fetch(
      `${env.apiLeft}/InfoPoint/rest/Vehicles/GetAllVehiclesForRoutes?routeIDs=${requestedRouteId}`
    )
      .then<{ error: string } | { body: Vehicle[] }>(async response => {
        if (response.ok) {
          // Some browsers (mobile PWA running in Chrome) will interpret an
          // error response in such a way that the app is broken. Because of
          // that this special header was created to return error information in
          // a 200 response (gross).
          if (response.headers.has("X-SW-Error")) {
            return { error: response.headers.get("X-SW-Error") };
          }

          return { body: (await response.json()) as Vehicle[] };
        }

        let body: string;
        try {
          body = await response.text();
        } catch (err) {
          // Nothing to do here.
        }

        throw Error(
          `${response.status}${
            body
              ? `\nbody='${body}'`
              : response.statusText
              ? `\nstatusText='${response.statusText}'`
              : ""
          }`
        );
      })
      .catch((error: Error) => {
        console.log("fetchRouteVehicles: catch; error=", error);
        return { error };
      })
      .then(data => {
        dispatch(inlineState => {
          if (requestedRouteId !== inlineState.routeId) {
            return [inlineState];
          }

          const { interval, lastDispatchTime } = getVehicleUpdateInterval(
            action.payload
          );

          const nextState = processVehicleResponse(
            inlineState,
            data,
            requestedRouteId,
            interval
          );

          setTimeout(() => {
            // Can't check here to see if the routeId in state (or inlineState)
            // has changed because by now that state is out-of-date. So dispatch
            // and a check will be done in the handler with the current state.
            dispatch({
              id: actionIds.ACTION_FETCH_ROUTE_VEHICLES,
              payload: {
                dispatchTime: lastDispatchTime + INTERVAL_SECONDS * 1000, // Always increment like a clock.
                routeId: requestedRouteId
              }
            });
          }, interval);

          return nextState;
        });
      });

    const result: ContextData = {
      ...state,
      routeVehicles: { ...state.routeVehicles, status: "active" }
    };
    return [result, true];
  };

  const getOptions: ActionHandler<ContextData> = (state, action) => {
    if (action.id !== null || state.options) {
      return [state];
    }

    const options: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const name = localStorage.key(i);
      if (!name.startsWith("OPTION_")) {
        continue;
      }

      options[name.substring("OPTION_".length)] = localStorage.getItem(name);
    }

    const result = { ...state, options };
    return [result, true];
  };

  const handleRouteChanged: ActionHandler<ContextData, number> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== actionIds.ACTION_ROUTE_CHANGED) {
      return [state];
    }

    let nextState: ContextData;

    // If the routeId has changed reset state to the point where it has no
    // routeTrace, route vehicle information, routeStops, or selected landmarks.
    if (state?.routeId !== action.payload) {
      const {
        routeTrace,
        routeVehicleHeadings,
        routeVehicles,
        selectedLandmarks,
        ...remainingState
      } = state ?? {};
      nextState = remainingState;
      nextState.routeId = action.payload;
    }

    // Always dispatch the request to get vehicles, the handler function will
    // verify if the fetch needs to be made.
    dispatch({
      id: actionIds.ACTION_FETCH_ROUTE_VEHICLES
    });

    return [nextState ?? state, !!nextState];
  };

  const selectLandmark: ActionHandler<ContextData, SelectedLandmark> = (
    state,
    action
  ) => {
    if (action.id !== actionIds.ACTION_SELECT_LANDMARK) {
      return [state];
    }

    state.selectedLandmarks = [action.payload];
    return [state, true];
  };

  const setOption: ActionHandler<
    ContextData,
    { name: string; value: string }
  > = (state, { id, payload }) => {
    if (id !== actionIds.ACTION_SET_OPTION) {
      return [state];
    }

    localStorage.setItem(`OPTION_${payload.name}`, `${payload.value}`);

    const { options, ...nextState } = state;
    return [nextState, true];
  };

  const deselectLandmark: ActionHandler<ContextData, number> = (
    state,
    action
  ) => {
    if (action.id !== actionIds.ACTION_DESELECT_LANDMARK) {
      return [state];
    }

    if (state.selectedLandmarks?.some(x => x.landmarkId === action.payload)) {
      state.selectedLandmarks = [];
      return [state, true];
    }

    return [state];
  };

  return [
    deselectLandmark,
    fetchLandmarks,
    fetchRoutes,
    fetchRoutesFinished,
    fetchRouteTrace,
    getOptions,
    handleRouteChanged,
    fetchRouteVehicles,
    selectLandmark,
    setOption
  ];
}

export const actionIds = Object.freeze({
  ACTION_DESELECT_LANDMARK: "action-deselect-landmark",
  ACTION_FETCH_ROUTE_VEHICLES: "action-fetch-route-vehicles",
  ACTION_ROUTE_CHANGED: "action-route-changed",
  ACTION_SELECT_LANDMARK: "action-select-landmark",
  ACTION_SET_OPTION: "action-set-option"
});

function getVehicleUpdateInterval(payload: { dispatchTime?: number }) {
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

function processVehicleResponse(
  state: ContextData,
  response: { body: Vehicle[] } | { error: string } | { error: Error },
  requestedRouteId: number,
  fetchInterval: number
): [ContextData, boolean?] {
  if (requestedRouteId !== state.routeId) {
    return [state];
  }

  let anyChanged = false;
  const currentVehicles = [...(state.routeVehicles?.data ?? [])];
  const nextRouteVehicles: Vehicle[] = [];

  "body" in response &&
    response.body.forEach(nextVehicle => {
      const index = currentVehicles.findIndex(
        rVehicle => rVehicle.VehicleId === nextVehicle.VehicleId
      );

      if (-1 < index) {
        const vehicleSame = _isEqual(nextVehicle, currentVehicles[index]);

        anyChanged = anyChanged
          ? anyChanged
          : vehicleSame === true
          ? false
          : true;

        const [currentVehicle] = currentVehicles.splice(index, 1);
        nextRouteVehicles.push(vehicleSame ? currentVehicle : nextVehicle);
      } else {
        anyChanged = true;
        nextRouteVehicles.push(nextVehicle);
      }
    });

  anyChanged = anyChanged ? anyChanged : 0 < currentVehicles.length;

  const nextUpdate = Date.now() + fetchInterval;

  return [
    {
      ...state,
      routeVehicles:
        "error" in response
          ? {
              error: response.error,
              nextUpdate,
              status: "idle"
            }
          : {
              data: anyChanged ? nextRouteVehicles : state.routeVehicles?.data,
              nextUpdate,
              status: "idle"
            },
      routeVehicleHeadings:
        "error" in response ? null : updateVehicleHeadings(state, response.body)
    },
    true
  ];
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
