import _unionWith from "lodash/unionWith";
import { useEffect, useMemo, useState } from "react";
import type { AnyLayout, CircleLayer, CirclePaint, LineLayer } from "mapbox-gl";
import * as geojson from "geojson/geojson";
import { AnyLayer, LayerCollection, SymbolIconLayer } from "remapgl";
import { ContextState, MapLayerCollectionItem, Trace } from "../context/types";
import { Landmark } from "../types/types";
import useContextState from "../context/use-context-state";
import { stringToBoolean } from "../util/type-coercion";

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
  const [poiLayers, setPoiLayers] = useState<SymbolIconLayer[]>(null);
  const [traceLayers, setTraceLayers] = useState<LineLayer[]>(null);
  const [stopsLayers, setStopsLayers] = useState<CircleLayer[]>(null);
  const [trailheadsLayers, setTrailheadsLayers] =
    useState<SymbolIconLayer[]>(null);

  useEffect(() => {
    setTraceLayers(currentTraces => {
      // Use items to determine the order because it's up to the client to set
      // that order when it's passed to remapgl.
      const temp = _unionWith<MapLayerCollectionItem | LineLayer>(
        items,
        currentTraces,
        (a, b) => compareLayers(a, b, "trace")
      );

      if (temp.every(x => "id" in x)) {
        return currentTraces;
      }

      const nextAnyLayers = temp.map(x => {
        if ("id" in x) {
          return x;
        }

        return (
          currentTraces?.find(y => y.id === `trace-${x.routeId}`) ??
          createTraceLayer(x.routeId, x.color, x.trace)
        );
      });

      return nextAnyLayers
        .filter(x => !!x)
        .every(x => currentTraces?.some(y => y.id === x.id))
        ? currentTraces
        : nextAnyLayers;
    });
  }, [items]);

  const options = useContextState(selector);
  const showStops = stringToBoolean(options?.SHOW_STOPS, true);

  useEffect(() => {
    setStopsLayers(currentStopsLayers =>
      createLayersFromItems(
        currentStopsLayers,
        items,
        "stops",
        item => item.stops,
        (routeId, landmarks, options) =>
          createStopsLayer(routeId, landmarks, {
            ...options,
            visibility: showStops ? "visible" : "none"
          })
      )
    );
  }, [items, showStops]);

  const showTrailheads = stringToBoolean(options?.SHOW_TRAILHEADS, false);

  useEffect(() => {
    setTrailheadsLayers(currentTrailheadsLayers =>
      createLayersFromItems(
        currentTrailheadsLayers,
        items,
        "trailheads",
        item => item.trailheads,
        (routeId, landmarks, options) =>
          createSymbolLayer(routeId, landmarks, {
            ...options,
            iconColor: "#774036",
            iconImage: "trailhead",
            iconImageUrl: "assets/trailhead.png",
            visibility: showTrailheads ? "visible" : "none"
          })
      )
    );
  }, [items, showTrailheads]);

  const showPois = stringToBoolean(options?.SHOW_POIS, false);

  useEffect(() => {
    setPoiLayers(currentPoiLayers =>
      createLayersFromItems(
        currentPoiLayers,
        items,
        "pois",
        item => item.pointsOfInterest,
        (routeId, landmarks, options) =>
          createSymbolLayer(routeId, landmarks, {
            ...options,
            iconColor: "#2C515D",
            iconImage: "trailhead",
            iconImageUrl: "assets/trailhead.png",
            visibility: showPois ? "visible" : "none"
          })
      )
    );
  }, [items, showPois]);

  const layers = useMemo(
    () => [
      ...(traceLayers ?? []),
      ...(trailheadsLayers ?? []),
      ...(poiLayers ?? []),
      ...(stopsLayers ?? [])
    ],
    [poiLayers, stopsLayers, traceLayers, trailheadsLayers]
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

function createCircleLayer(
  routeId: number,
  landmarks: Landmark[],
  layerPrefix: string,
  { color, visibility }: { color: string; visibility: AnyLayout["visibility"] }
): CircleLayer {
  if (!landmarks) {
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

  const data = landmarks.map(
    ({ location: { latitude: lat, longitude: lng }, displayName: name }) => ({
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
    id: `${layerPrefix}-${routeId}`,
    layout: { visibility: visibility ?? "visible" },
    paint,
    source: {
      data: geoJson,
      type: "geojson"
    },
    type: "circle"
  };
}

function createLayersFromItems<T extends AnyLayer>(
  currentLayers: T[],
  items: MapLayerCollectionItem[],
  layerPrefix: string,
  getLandmarks: (item: MapLayerCollectionItem) => Landmark[],
  createLayer: (
    routeId: number,
    landmarks: Landmark[],
    options?: { color: string; layerPrefix: string }
  ) => T
): T[] {
  // Use items to determine the order because it's up to the client to set
  // that order when it's passed to remapgl.
  const ordered = _unionWith<MapLayerCollectionItem | AnyLayer>(
    items,
    currentLayers,
    (a, b) => compareLayers(a, b, layerPrefix)
  );

  const nextLayers = ordered.map(item => {
    if ("id" in item) {
      return item;
    }

    const itemLandmarks = getLandmarks(item);
    if (!itemLandmarks) {
      return null;
    }

    return createLayer(item.routeId, itemLandmarks, {
      color: item.color,
      layerPrefix
    });
  });

  // nextLayers can contain null elements.
  return nextLayers.filter(x => !!x) as T[];
}

function createSymbolLayer(
  routeId: number,
  landmarks: Landmark[],
  {
    iconColor,
    iconImage,
    iconImageUrl,
    layerPrefix,
    visibility
  }: {
    iconColor: string;
    iconImage: string;
    iconImageUrl: string;
    layerPrefix: string;
    visibility: AnyLayout["visibility"];
  }
): SymbolIconLayer {
  if (!landmarks) {
    return null;
  }

  const data = landmarks.map(
    ({ location: { latitude: lat, longitude: lng }, displayName: name }) => ({
      lat,
      lng,
      name
    })
  );

  const geoJson = geojson.parse(data, {
    Point: ["lat", "lng"]
  });

  console.log(`createSymbolLayer: visibility='${visibility}'`);

  const output: SymbolIconLayer = {
    iconImageUrl,
    id: `${layerPrefix}-${routeId}`,
    imageOptions: { sdf: true },
    layout: {
      "icon-anchor": "bottom",
      "icon-image": iconImage,
      "icon-size": 0.2,
      "text-anchor": "top",
      "text-field": ["get", "name"],
      "text-offset": [0, 1],
      visibility: visibility ?? "visible"
    },
    paint: {
      "icon-color": iconColor
    },
    source: {
      data: geoJson,
      type: "geojson"
    },
    type: "symbol"
  };

  return output;
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
  stops: Landmark[],
  options: { color: string; visibility: AnyLayout["visibility"] }
): CircleLayer {
  return createCircleLayer(routeId, stops, "stops", options);
}

function selector(state: ContextState) {
  return state?.options;
}
