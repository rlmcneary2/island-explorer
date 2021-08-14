import { Marker } from "remapgl";
import { ContextData, Vehicle } from "../context/types";
import useContextState from "../context/use-context-state";

export default function MapVehicles() {
  const vehicles = useContextState(selector);

  if (!vehicles || !vehicles.length) {
    return null;
  }

  return (
    <>
      {vehicles.map(item => (
        <Marker
          key={item.VehicleId}
          lnglat={[item.Longitude, item.Latitude]}
          popup={() => <MarkerPopup {...item} />}
        >
          <div className="map-vehicle"></div>
        </Marker>
      ))}
    </>
  );
}

function MarkerPopup(props: Vehicle) {
  return <div>{JSON.stringify(props, null, 2)}</div>;
}

function selector(state: ContextData) {
  return state?.routeVehicles?.data;
}
