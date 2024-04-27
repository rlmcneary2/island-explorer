import React, { useMemo, useRef } from "react";
import type { LngLatBoundsLike, Map as MapGL } from "mapbox-gl";
import { NavigationControl, RemapGL } from "remapgl";
import MapLayerCollectionItems from "../MapLayerCollectionItems/map-layer-collection-items";
import MapVehicles from "../MapVehicles/map-vehicles";
import { MapStops } from "../MapStops/map-stops";

const ZOOM_TO_FIT_PADDING = 25;

const START_LATITUDE = 44.3420759;
const START_LONGITUDE = -68.2654881;
const START_ZOOM = 8.5;

export default function Map({ routeId }: Props) {
  const ref = useRef(null);
  const map = useRef<MapGL | null>(null);
  const lastBounds = useRef<LngLatBoundsLike | undefined>();

  const fitBounds = useMemo(
    () => (bounds: LngLatBoundsLike) => {
      lastBounds.current = bounds;
      map.current &&
        map.current.fitBounds(bounds, { padding: ZOOM_TO_FIT_PADDING });
    },
    []
  );

  const handleResetBoundsClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    lastBounds.current &&
      map.current?.fitBounds(lastBounds.current, {
        padding: ZOOM_TO_FIT_PADDING
      });
  };

  return (
    <div className="map">
      <RemapGL
        accessToken="pk.eyJ1IjoicmxtY25lYXJ5MiIsImEiOiJjajgyZjJuMDAyajJrMndzNmJqZDFucTIzIn0.BYE_k7mYhhVCdLckWeTg0g"
        center={[START_LONGITUDE, START_LATITUDE]}
        obj={obj => (map.current = obj)}
        ref={ref}
        zoom={START_ZOOM}
      >
        <NavigationControl position="bottom-left" showCompass showZoom />
        {routeId && (
          <MapLayerCollectionItems fitBounds={fitBounds} routeId={routeId} />
        )}
        <MapStops />
        <MapVehicles />
      </RemapGL>
      <button className="button reset-bounds" onClick={handleResetBoundsClick}>
        <i className="sym-fit-screen"></i>
      </button>
    </div>
  );
}

interface Props {
  routeId?: number;
}
