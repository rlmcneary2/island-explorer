import { useMemo } from "react";
import { LngLatLike } from "mapbox-gl";
import { Marker } from "remapgl";
import { Landmark } from "../../types/types";
import { Vehicle } from "../../context/types";
import { VehiclePopup } from "./vehicle-popup";
import Icon from "../../images/icon-bus.svg?react";

export function VehicleMarker({
  headingAngle,
  routeLandmarks,
  vehicle
}: Props) {
  const directionClassName = vehicle.Speed ? "" : " no-direction";

  const renderPopup = useMemo(
    () => (obj: mapboxgl.Popup) => {
      return (
        <VehiclePopup
          onClick={() => obj.remove()}
          routeStops={routeLandmarks}
          vehicle={vehicle}
        />
      );
    },
    [routeLandmarks, vehicle]
  );

  const popupOptions = useMemo(() => ({ closeButton: false, offset: 15 }), []);

  const vehicleLng = vehicle.Longitude;
  const vehicleLat = vehicle.Latitude;
  const vehicleName = vehicle.Name;
  const lnglat = useMemo<LngLatLike>(() => {
    console.log(`VehicleMarker[${vehicleName}] location changed.`);
    return [vehicleLng, vehicleLat];
  }, [vehicleLat, vehicleLng, vehicleName]);

  return (
    <Marker
      key={vehicle.VehicleId}
      lnglat={lnglat}
      popup={renderPopup}
      popupOptions={popupOptions}
    >
      <div
        className={`map-vehicle${directionClassName}`}
        style={
          {
            "--vehicle-rotation": `rotate(${headingAngle}deg)`
          } as React.CSSProperties
        }
      >
        <div
          className={`map-vehicle-image${
            vehicle.OpStatus.toLowerCase() === "late" ? " late" : ""
          }`}
        >
          <Icon />
        </div>
      </div>
    </Marker>
  );
}

interface Props {
  headingAngle?: number;
  routeLandmarks: Landmark[];
  vehicle: Vehicle;
}
