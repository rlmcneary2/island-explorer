import { useMemo } from "react";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";
import { VehicleMarker } from "./vehicle/vehicle-marker";
import { getRouteOrderLandmarks } from "../util/landmark";

export default function MapVehicles() {
  const { landmarks, routeId, routes, vehicleHeadings, vehicles } =
    useContextState(selector);

  const landmarksData = landmarks?.data;
  const routesData = routes?.data;

  const routeLandmarks = useMemo(
    () =>
      routeId || routeId === 0
        ? getRouteOrderLandmarks(routeId, routesData ?? [], landmarksData ?? [])
        : [],
    [landmarksData, routeId, routesData]
  );

  if (
    landmarks?.status !== "idle" ||
    landmarks?.error ||
    routes?.status !== "idle" ||
    routes?.error ||
    !vehicles ||
    !vehicles.length
  ) {
    return null;
  }

  return (
    <>
      {vehicles.map(vehicle => (
        <VehicleMarker
          headingAngle={headingToRotateAngle(
            vehicleHeadings
              ? vehicleHeadings[vehicle.VehicleId].currentHeading
              : 0
          )}
          key={vehicle.VehicleId}
          routeLandmarks={routeLandmarks}
          vehicle={vehicle}
        />
      ))}
    </>
  );
}

function headingToRotateAngle(heading = 0): number {
  // heading: 0 = north (up), 90 = east (right), 180 = south (down), 270 = west (left)
  // rotate: 0 = south (down), 90 = west (left), 180 = north (up), 270 = east (right)

  let angle: number | null = null;
  if (!isNaN(heading)) {
    angle = 180 < heading ? heading - 180 : 180 + heading;
  }

  return angle ?? 0;
}

function selector(state: ContextData) {
  return {
    landmarks: state?.landmarks,
    routeId: state?.routeId,
    routes: state?.routes,
    vehicleHeadings: state?.routeVehicleHeadings,
    vehicles: state?.routeVehicles?.data
  };
}
