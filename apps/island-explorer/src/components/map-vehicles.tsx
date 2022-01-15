import React from "react";
import { Marker } from "remapgl";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";
import { VehiclePopup } from "./vehicle/vehicle-popup";

export default function MapVehicles() {
  const { vehicleHeadings, vehicles, routeStops } = useContextState(selector);

  if (!vehicles || !vehicles.length) {
    return null;
  }

  return (
    <>
      {vehicles.map(vehicle => (
        <Marker
          key={vehicle.VehicleId}
          lnglat={[vehicle.Longitude, vehicle.Latitude]}
          popup={obj => (
            <VehiclePopup
              onClick={() => obj.remove()}
              routeStops={routeStops}
              vehicle={vehicle}
            />
          )}
          popupOptions={{ closeButton: false, offset: 15 }}
        >
          <div
            className={`map-vehicle${vehicle.Speed ? "" : " no-direction"}`}
            style={
              {
                "--vehicle-rotation": `rotate(${headingToRotateAngle(
                  vehicleHeadings[vehicle.VehicleId].currentHeading
                )}deg)`
              } as React.CSSProperties
            }
          ></div>
        </Marker>
      ))}
    </>
  );
}

function headingToRotateAngle(heading = 0) {
  // heading: 0 = north (up), 90 = east (right), 180 = south (down), 270 = west (left)
  // rotate: 0 = south (down), 90 = west (left), 180 = north (up), 270 = east (right)

  let angle: number = null;
  if (!isNaN(heading)) {
    angle = 180 < heading ? heading - 180 : 180 + heading;
  }

  return angle;
}

function selector(state: ContextData) {
  return {
    routeStops: state?.routeStops?.data,
    vehicleHeadings: state?.routeVehicleHeadings,
    vehicles: state?.routeVehicles?.data
  };
}
