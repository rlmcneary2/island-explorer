import { isEqual as _isEqual } from "lodash";
import { ActionHandler } from "reshape-state";
import { environment as env } from "../environments/environment";
import { Landmark, RoutesAssetItem } from "../types/types";
import { ContextData, ContextState, SelectedLandmark, Vehicle } from "./types";

const ACTION_FETCH_ROUTES_FINISHED = "fetch-routes-finished";
const INTERVAL_SECONDS = 15;

export function create(): ActionHandler<ContextState>[] {
  let fetchRouteVehiclesRouteId: number = null;
  let fetchVehiclesActive = false;

  const fetchLandmarks: ActionHandler<ContextState, null> = (
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

    return [{ ...state, landmarks: { status: "active" } }, true];
  };

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
    return [nextState as ContextState, true];
  };

  const fetchRoutesFinished: ActionHandler<ContextState, RoutesAssetItem[]> = (
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
    if (action.id !== actionIds.ACTION_FETCH_ROUTE_VEHICLES) {
      return [state];
    }

    const isRouteChanged = fetchRouteVehiclesRouteId !== action.payload.routeId;

    if (fetchVehiclesActive && !isRouteChanged) {
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
        const { interval, lastDispatchTime } = getVehicleUpdateInterval(
          action.payload
        );

        dispatch(inlineState => {
          let anyChanged = false;
          const currentRouteVehicles = [...(state.routeVehicles?.data ?? [])];
          const nextRouteVehicles: Vehicle[] = [];

          "body" in data &&
            data.body.forEach(nextVehicle => {
              const index = currentRouteVehicles.findIndex(
                rVehicle => rVehicle.VehicleId === nextVehicle.VehicleId
              );

              if (-1 < index) {
                const vehicleSame = _isEqual(
                  nextVehicle,
                  currentRouteVehicles[index]
                );

                anyChanged = anyChanged
                  ? anyChanged
                  : vehicleSame === true
                  ? false
                  : true;

                const [currentVehicle] = currentRouteVehicles.splice(index, 1);
                nextRouteVehicles.push(
                  vehicleSame ? currentVehicle : nextVehicle
                );
              } else {
                anyChanged = true;
                nextRouteVehicles.push(nextVehicle);
              }
            });

          anyChanged = anyChanged
            ? anyChanged
            : 0 < currentRouteVehicles.length;

          return [
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
                      data: anyChanged
                        ? nextRouteVehicles
                        : state.routeVehicles?.data,
                      status: "idle"
                    },
              routeVehicleHeadings:
                "error" in data
                  ? null
                  : updateVehicleHeadings(inlineState, data.body)
            },
            true
          ];
        });

        setTimeout(() => {
          if (nextRouteId !== fetchRouteVehiclesRouteId) {
            return;
          }

          fetchVehiclesActive = false;

          dispatch({
            id: actionIds.ACTION_FETCH_ROUTE_VEHICLES,
            payload: {
              dispatchTime: lastDispatchTime + INTERVAL_SECONDS * 1000, // Always increment like a clock.
              routeId: nextRouteId
            }
          });
        }, interval);
      });

    state.routeVehicles = state.routeVehicles ?? { status: "active" };
    state.routeVehicles.status = "active";

    return [state, true];
  };

  const getOptions: ActionHandler<ContextState> = (state, action) => {
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

    return [{ ...state, options }, true];
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
    // routeTrace, routeStops, or selected landmarks.
    if (state?.routeId !== action.payload) {
      const { routeTrace, selectedLandmarks, ...remainingState } = state ?? {};

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
      fetch(`../assets/trace-${action.payload}.json`)
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
            const nextState: ContextState = {
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

      nextState = {
        ...(nextState ?? state),
        routeTrace: { status: "active" }
      };
    }

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

  const setOption: ActionHandler<
    ContextState,
    { name: string; value: string }
  > = (state, { id, payload }) => {
    if (id !== actionIds.ACTION_SET_OPTION) {
      return [state];
    }

    localStorage.setItem(`OPTION_${payload.name}`, `${payload.value}`);

    const { options, ...nextState } = state;
    return [nextState, true];
  };

  const deselectLandmark: ActionHandler<ContextState, number> = (
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
