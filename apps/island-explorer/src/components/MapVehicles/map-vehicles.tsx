import { useMemo } from "react";
import { ContextData } from "../../context/types";
import useContextState from "../../context/use-context-state";
import { useRouteId } from "../../context/use-route-id";
import { VehicleMarker } from "../Vehicle/vehicle-marker";
import { getRouteOrderLandmarks } from "../../util/landmark";
import routes from "../../data/routes";
import landmarks from "../../data/landmarks";

export default function MapVehicles() {
  const routeId = useRouteId();
  const { vehicleHeadings, vehicles } = useContextState(selector);

  const routeLandmarks = useMemo(
    () =>
      routeId || routeId === 0
        ? getRouteOrderLandmarks(routeId, routes, landmarks)
        : [],
    [routeId]
  );

  if (!vehicles || !vehicles.length) {
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
    vehicleHeadings: state?.routeVehicleHeadings,
    vehicles: state?.routeVehicles?.data
  };
}
