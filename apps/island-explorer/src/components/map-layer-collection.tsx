import _unionWith from "lodash/unionWith";
import { useEffect, useMemo, useState } from "react";
import type { CircleLayer, CirclePaint, LineLayer } from "mapbox-gl";
import * as geojson from "geojson/geojson";
import { AnyLayer, LayerCollection } from "remapgl";
import { Landmark } from "../types/types";
import { ContextState, MapLayerCollectionItem, Trace } from "../context/types";
import { stringToBoolean } from "../util/type-coercion";
import useContextState from "../context/use-context-state";

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
const ROUTE_LINE_WIDTH = 4;

export default function MapLayerCollection({
  items
}: {
  items: MapLayerCollectionItem[];
}) {
  const options = useContextState(selector);
  const [traceLayers, setTraceLayers] = useState<LineLayer[]>(null);
  const [stopsLayers, setStopsLayers] = useState<CircleLayer[]>(null);

  const showStops = stringToBoolean(options?.SHOW_STOPS, true);

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
      if (!showStops) {
        return !current?.length ? current : [];
      }

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
  }, [items, showStops]);

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
  stops: Landmark[]
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

  const data = stops.map(
    ({ location: { latitude: lat, longitude: lng }, stopName: name }) => ({
      lat,
      lng,
      name
    })
  );

  const geoJson = geojson.parse(data, {
    extra: { icon: "circle" },
    Point: ["lat", "lng"]
  });

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

function selector(state: ContextState) {
  return state?.options;
}
