import { useMemo } from "react";
import { Marker } from "remapgl";
import { Landmark } from "../../types/types";
import { Vehicle } from "../../context/types";
import { VehiclePopup } from "./vehicle-popup";
import Icon from "../../assets/icon-bus.svg";

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

  return (
    <Marker
      key={vehicle.VehicleId}
      lnglat={[vehicle.Longitude, vehicle.Latitude]}
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
