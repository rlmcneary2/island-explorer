import _unionWith from "lodash/unionWith";
import { useEffect, useMemo, useRef, useState } from "react";
import bbox from "@turf/bbox";
import type {
  CircleLayer,
  CirclePaint,
  LineLayer,
  LngLatBoundsLike,
  Map as MapGL
} from "mapbox-gl";
import * as geojson from "geojson/geojson";
import { AnyLayer, LayerCollection, RemapGL } from "remapgl";
import useContextState from "../context/use-context-state";
import { ContextData, Stop, Trace } from "../context/types";

const STOP_CIRCLE_RADIUS_BASE = 1.15;
const STOP_CIRCLE_RADIUS_STEPS: number[][] = [
  [10, 5],
  [14, 5]
];
const STOP_CIRCLE_STROKE_BASE = 1.15;
const STOP_CIRCLE_STROKE_COLOR = "#FFF";
const STOP_CIRCLE_STROKE_STEPS: number[][] = [
  [10, 3],
  [14, 3]
];
// const STOP_TEXT_BASE = 1.15;
// const STOP_TEXT_STEPS: ReadonlyArray<ReadonlyArray<number>> = [[10, 10], [14, 12]];
const ZOOM_TO_FIT_PADDING = 25;

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
          fitBounds={bounds =>
            map.current &&
            map.current.fitBounds(bounds, { padding: ZOOM_TO_FIT_PADDING })
          }
          routeId={routeId}
        />
      </RemapGL>
    </div>
  );
}

function MapLayers({
  fitBounds,
  routeId
}: {
  fitBounds: (bounds: LngLatBoundsLike) => void;
  routeId: number;
}) {
  const selector = useMemo(
    () => (state: ContextData) => ({
      color:
        state?.routes?.data?.find(x => x.RouteId === routeId).Color ?? "000",
      routeStops: state?.routeStops ?? null,
      routeTrace: state?.routeTrace ?? null
    }),
    [routeId]
  );

  const { color, routeStops, routeTrace } = useContextState(selector) ?? {};

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

  const { data: stops } = routeStops ?? { data: null };

  const items = useMemo<MapLayerCollectionItem[]>(
    () => [
      {
        color,
        routeId,
        stops: stops ?? null,
        trace: trace ?? null
      }
    ],
    [color, routeId, stops, trace]
  );

  if (!traceReady) {
    return null;
  }

  return <MapLayerCollection items={items} />;
}

function MapLayerCollection({ items }: { items: MapLayerCollectionItem[] }) {
  const [traceLayers, setTraceLayers] = useState<LineLayer[]>(null);
  const [stopsLayers, setStopsLayers] = useState<CircleLayer[]>(null);

  useEffect(() => {
    setTraceLayers(current => {
      // Use items to determine the order because it's up to the client to set
      // that order when it's passed to remapgl.
      const temp = _unionWith<MapLayerCollectionItem | LineLayer>(
        items,
        current,
        (a, b) => compareLayers(a, b, "trace")
      );

      if (temp.every(x => "id" in x)) {
        return current;
      }

      const nextAnyLayers = temp.map(x => {
        if ("id" in x) {
          return x;
        }

        return (
          current?.find(y => y.id === `trace-${x.routeId}`) ??
          createTraceLayer(x.routeId, x.color, x.trace)
        );
      });

      return nextAnyLayers
        .filter(x => !!x)
        .every(x => current?.some(y => y.id === x.id))
        ? current
        : nextAnyLayers;
    });
  }, [items]);

  useEffect(() => {
    setStopsLayers(current => {
      // Use items to determine the order because it's up to the client to set
      // that order when it's passed to remapgl.
      const temp = _unionWith<MapLayerCollectionItem | CircleLayer>(
        items,
        current,
        (a, b) => compareLayers(a, b, "stops")
      );

      if (temp.every(x => "id" in x)) {
        return current;
      }

      const nextAnyLayers = temp.map(x => {
        if ("id" in x) {
          return x;
        }

        return (
          current?.find(y => y.id === `stops-${x.routeId}`) ??
          createStopsLayer(x.routeId, x.color, x.stops)
        );
      });

      return nextAnyLayers
        .filter(x => !!x)
        .every(x => current?.some(y => y.id === x.id))
        ? current
        : nextAnyLayers;
    });
  }, [items]);

  const layers = useMemo(
    () => [...(traceLayers ?? []), ...(stopsLayers ?? [])],
    [stopsLayers, traceLayers]
  );

  return <LayerCollection layers={layers} />;
}

function compareLayers(
  a: MapLayerCollectionItem | AnyLayer,
  b: MapLayerCollectionItem | AnyLayer,
  layerPrefix: string
): boolean {
  const aId = "id" in a ? a.id : `${layerPrefix}-${a.routeId}`;
  const bId = "id" in b ? b.id : `${layerPrefix}-${b.routeId}`;
  return aId === bId;
}

function createTraceLayer(
  routeId: number,
  color: string,
  trace: Trace
): LineLayer {
  const feature =
    trace && trace.features && 0 < trace.features.length
      ? trace.features[0]
      : null;

  console.log(`createTraceLayer: routeId=${routeId}, trace=`, trace);

  return {
    id: `trace-${routeId}`,
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": `#${color}`,
      "line-opacity": feature.properties["stroke-opacity"] || 1,
      "line-width": ROUTE_LINE_WIDTH
    },
    source: {
      data: trace,
      type: "geojson"
    },
    type: "line"
  };
}

function createStopsLayer(
  routeId: number,
  color: string,
  stops: Stop[]
): CircleLayer {
  if (!stops) {
    return null;
  }

  const paint: CirclePaint = {
    "circle-color": `#${color}`,
    "circle-radius": {
      base: STOP_CIRCLE_RADIUS_BASE,
      stops: STOP_CIRCLE_RADIUS_STEPS
    },
    "circle-stroke-color": STOP_CIRCLE_STROKE_COLOR,
    "circle-stroke-opacity": 0.8,
    "circle-stroke-width": {
      base: STOP_CIRCLE_STROKE_BASE,
      stops: STOP_CIRCLE_STROKE_STEPS
    }
  };

  const data = stops.map(({ Latitude: lat, Longitude: lng, Name: name }) => ({
    lat,
    lng,
    name
  }));

  const geoJson = geojson.parse(data, {
    extra: { icon: "circle" },
    Point: ["lat", "lng"]
  });

  console.log(`createStopsLayer: routeId=${routeId}, stops=`, stops);

  return {
    id: `stops-${routeId}`,
    paint,
    source: {
      data: geoJson,
      type: "geojson"
    },
    type: "circle"
  };
}

interface Props {
  routeId?: number;
}

interface MapLayerCollectionItem {
  color: string;
  routeId: number;
  stops?: Stop[];
  trace?: Trace;
}
