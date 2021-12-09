import { Marker } from "remapgl";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";
import { VehiclePopup } from "./vehicle/vehicle-popup";

export default function MapVehicles() {
  const { vehicles, routeStops } = useContextState(selector);

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
          <div className="map-vehicle"></div>
        </Marker>
      ))}
    </>
  );
}

function selector(state: ContextData) {
  return {
    routeStops: state?.routeStops?.data,
    vehicles: state?.routeVehicles?.data
  };
}
