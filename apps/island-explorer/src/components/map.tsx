import React, { useEffect, useMemo, useRef } from "react";
import bbox from "@turf/bbox";
import type { LineLayer, LngLatBoundsLike, Map as MapGL } from "mapbox-gl";
import { LayerCollection, RemapGL } from "remapgl";
import useContextState from "../context/use-context-state";
import { Trace } from "../context/types";

const ROUTE_LINE_WIDTH = 4;
const START_LATITUDE = 44.3420759;
const START_LONGITUDE = -68.2654881;
const START_ZOOM = 8.5;

export default function Map({ routeId }: Props) {
  const ref = useRef(null);
  const map = useRef<MapGL>(null);

  return (
    <div className="map">
      <RemapGL
        accessToken="pk.eyJ1IjoicmxtY25lYXJ5MiIsImEiOiJjajgyZjJuMDAyajJrMndzNmJqZDFucTIzIn0.BYE_k7mYhhVCdLckWeTg0g"
        center={[START_LONGITUDE, START_LATITUDE]}
        obj={obj => (map.current = obj)}
        ref={ref}
        zoom={START_ZOOM}
      >
        <MapLayers
          fitBounds={bounds => map.current && map.current.fitBounds(bounds)}
          routeId={routeId}
        />
      </RemapGL>
    </div>
  );
}

type Props = {
  routeId?: number;
};

function MapLayers({
  fitBounds,
  routeId
}: {
  fitBounds: (bounds: LngLatBoundsLike) => void;
  routeId: number;
}) {
  const { routeStops, routeTrace } =
    useContextState(state => ({
      routeStops: state?.routeStops,
      routeTrace: state?.routeTrace
    })) ?? {};

  console.log(`MapLayers: routeId=${routeId}, routeTrace=`, routeTrace);

  const traceReady =
    routeTrace?.status === "idle" && !routeTrace.error && routeTrace.data;

  const { data: trace } = routeTrace ?? { data: null };

  useEffect(() => {
    if (!traceReady || !fitBounds) {
      return;
    }

    const bounds = bbox(trace) as LngLatBoundsLike;
    fitBounds(bounds);
  }, [fitBounds, trace, traceReady]);

  if (!traceReady) {
    return null;
  }

  return <MapLayerCollection routeId={routeId} trace={trace} />;
}

function MapLayerCollection({
  routeId,
  trace
}: {
  routeId: number;
  trace: Trace;
}) {
  const traceLayers = useMemo(() => [createTraceLayer(routeId, trace)], [
    routeId,
    trace
  ]);

  return <LayerCollection key={`${routeId}`} layers={traceLayers} />;
}

function createTraceLayer(routeId: number, trace: Trace): LineLayer {
  const feature =
    trace && trace.features && 0 < trace.features.length
      ? trace.features[0]
      : null;
  const layer: LineLayer = {
    id: `trace-${routeId}`,
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": feature.properties.stroke || "#000",
      "line-opacity": feature.properties["stroke-opacity"] || 1,
      "line-width": ROUTE_LINE_WIDTH
    },
    source: {
      data: trace,
      type: "geojson"
    },
    type: "line"
  };

  return layer;
}
