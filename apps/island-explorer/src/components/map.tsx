import { useMemo, useRef } from "react";
import type { LngLatBoundsLike, Map as MapGL } from "mapbox-gl";
import { NavigationControl, RemapGL } from "remapgl";
import MapLayerCollectionItems from "./map-layer-collection-items";
import MapVehicles from "./map-vehicles";
import { MapStops } from "./map-stops";

const ZOOM_TO_FIT_PADDING = 25;

const START_LATITUDE = 44.3420759;
const START_LONGITUDE = -68.2654881;
const START_ZOOM = 8.5;

export default function Map({ routeId }: Props) {
  const ref = useRef(null);
  const map = useRef<MapGL>(null);

  const fitBounds = useMemo(
    () => (bounds: LngLatBoundsLike) =>
      map.current &&
      map.current.fitBounds(bounds, { padding: ZOOM_TO_FIT_PADDING }),
    []
  );

  return (
    <div className="map">
      <RemapGL
        accessToken="pk.eyJ1IjoicmxtY25lYXJ5MiIsImEiOiJjajgyZjJuMDAyajJrMndzNmJqZDFucTIzIn0.BYE_k7mYhhVCdLckWeTg0g"
        center={[START_LONGITUDE, START_LATITUDE]}
        obj={obj => (map.current = obj)}
        ref={ref}
        zoom={START_ZOOM}
      >
        <NavigationControl showCompass={true} />
        {routeId && (
          <MapLayerCollectionItems fitBounds={fitBounds} routeId={routeId} />
        )}
        <MapStops />
        <MapVehicles />
      </RemapGL>
    </div>
  );
}

interface Props {
  routeId?: number;
}
