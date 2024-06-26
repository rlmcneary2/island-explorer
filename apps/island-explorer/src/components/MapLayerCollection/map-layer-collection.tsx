import _unionWith from "lodash-es/unionWith";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { AnyLayout, CircleLayer, CirclePaint, LineLayer } from "mapbox-gl";
import { AnyLayer, LayerCollection, SymbolIconLayer } from "remapgl";
import {
  ContextData,
  MapLayerCollectionItem,
  Trace
} from "../../context/types";
import { Landmark } from "../../types/types";
import useContextState from "../../context/use-context-state";
import { stringToBoolean } from "../../util/type-coercion";
import useContextActions from "../../context/use-context-actions";

const ICON_SIZE = 0.5;
const STOP_CIRCLE_RADIUS_BASE = 7;
const STOP_CIRCLE_STROKE_BASE = 3;
const STOP_CIRCLE_STROKE_COLOR = "#FFF";
const ROUTE_LINE_WIDTH = 4;

export default function MapLayerCollection({
  items
}: {
  items: MapLayerCollectionItem[];
}) {
  const { selectLandmark } = useContextActions();
  const { options } = useContextState(selector);
  const [poiLayers, setPoiLayers] = useState<SymbolIconLayer[] | undefined>();
  const [traceLayers, setTraceLayers] = useState<LineLayer[] | undefined>();
  const [stopsLayers, setStopsLayers] = useState<CircleLayer[] | undefined>();
  const [trailheadsLayers, setTrailheadsLayers] = useState<
    SymbolIconLayer[] | undefined
  >();

  const handleLayerClick = useCallback(
    (landmarkId: number) => selectLandmark({ landmarkId }),
    [selectLandmark]
  );

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

  const showStops = stringToBoolean(options?.SHOW_STOPS, true);

  useEffect(() => {
    setStopsLayers(currentStopsLayers => {
      return createLayersFromItems(
        items,
        "stops",
        item => item.stops ?? [],
        (routeId, landmarks, options) => {
          return createStopsLayer(routeId, landmarks, {
            ...options,
            onClick: handleLayerClick,
            visibility: showStops ? "visible" : "none"
          });
        },
        currentStopsLayers
      );
    });
  }, [handleLayerClick, items, showStops]);

  const showTrailheads = stringToBoolean(options?.SHOW_TRAILHEADS, false);

  useEffect(() => {
    setTrailheadsLayers(currentTrailheadsLayers =>
      createLayersFromItems(
        items,
        "trailheads",
        item => item.trailheads ?? [],
        (routeId, landmarks, options) =>
          createSymbolLayer(routeId, landmarks, {
            ...options,
            iconImage: "trailhead",
            iconImageUrl: "assets/trailhead.png",
            onClick: handleLayerClick,
            visibility: showTrailheads ? "visible" : "none"
          }),
        currentTrailheadsLayers
      )
    );
  }, [handleLayerClick, items, showTrailheads]);

  const showPois = stringToBoolean(options?.SHOW_POIS, false);

  useEffect(() => {
    setPoiLayers(currentPoiLayers =>
      createLayersFromItems(
        items,
        "pois",
        item => item.pointsOfInterest,
        (routeId, landmarks, options) =>
          createSymbolLayer(routeId, landmarks, {
            ...options,
            iconImage: "poi",
            iconImageUrl: "assets/poi.png",
            onClick: handleLayerClick,
            visibility: showPois ? "visible" : "none"
          }),
        currentPoiLayers
      )
    );
  }, [handleLayerClick, items, showPois]);

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
  {
    color,
    onClick,
    visibility
  }: {
    color?: string;
    onClick?: (landmarkId: number) => void;
    visibility: AnyLayout["visibility"];
  }
): CircleLayer | null {
  if (!landmarks) {
    return null;
  }

  const paint: CirclePaint = {
    "circle-color": `#${color}`,
    "circle-radius": [
      "interpolate",
      ["exponential", 1.7],
      ["zoom"],
      13,
      STOP_CIRCLE_RADIUS_BASE,
      16,
      STOP_CIRCLE_RADIUS_BASE * 2
    ],
    "circle-stroke-color": STOP_CIRCLE_STROKE_COLOR,
    "circle-stroke-opacity": 0.8,
    "circle-stroke-width": [
      "interpolate",
      ["exponential", 1.7],
      ["zoom"],
      13,
      STOP_CIRCLE_STROKE_BASE,
      16,
      STOP_CIRCLE_STROKE_BASE * 2
    ]
  };

  const data = landmarks
    .map(landmark => {
      const { displayName: name, id } = landmark;

      return {
        id,
        lat: landmark.location?.latitude ?? -1,
        lng: landmark.location?.longitude ?? -1,
        name
      };
    })
    .filter(landmark => landmark.lat !== -1);

  const sourceData: FeatureCollection<Geometry, GeoJsonProperties> = {
    features: data.map(d => ({
      geometry: { type: "Point", coordinates: [d.lng, d.lat] },
      properties: {
        icon: "circle",
        id: d.id,
        name: d.name
      },
      type: "Feature"
    })),
    type: "FeatureCollection"
  };

  const layer: CircleLayer = {
    id: `${layerPrefix}-${routeId}`,
    layout: { visibility: visibility ?? "visible" },
    paint,
    source: {
      data: sourceData,
      type: "geojson"
    },
    type: "circle"
  };

  (layer as AnyLayer).on = {
    click: evt => {
      const { features } = evt;
      if (features) {
        const [feature] = features;
        onClick && onClick(feature.properties?.id);
      }
    }
  };

  setHoverClass(layer);

  return layer;
}

function createLayersFromItems<T extends AnyLayer>(
  items: MapLayerCollectionItem[],
  layerPrefix: string,
  getLandmarks: (item: MapLayerCollectionItem) => Landmark[],
  createLayer: (
    routeId: number,
    landmarks: Landmark[],
    options?: { color?: string; layerPrefix: string }
  ) => T | null,
  currentLayers?: T[]
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
    iconImage,
    iconImageUrl,
    layerPrefix,
    onClick,
    sdfColor,
    visibility
  }: {
    iconImage: string;
    iconImageUrl: string;
    layerPrefix?: string;
    onClick?: (landmarkId: number) => void;
    sdfColor?: string;
    visibility: AnyLayout["visibility"];
  }
): SymbolIconLayer | null {
  if (!landmarks) {
    return null;
  }

  const data = landmarks
    .map(landmark => {
      const { displayName: name, id } = landmark;

      return {
        id,
        lat: landmark.location?.latitude ?? -1,
        lng: landmark.location?.longitude ?? -1,
        name
      };
    })
    .filter(landmark => landmark.lat !== -1);

  const sourceData: FeatureCollection<Geometry, GeoJsonProperties> = {
    features: data.map(d => ({
      geometry: { type: "Point", coordinates: [d.lng, d.lat] },
      properties: {
        id: d.id,
        name: d.name
      },
      type: "Feature"
    })),
    type: "FeatureCollection"
  };

  const layer: SymbolIconLayer = {
    iconImageUrl,
    id: `${layerPrefix}-${routeId}`,
    layout: {
      "icon-allow-overlap": true,
      "icon-anchor": "bottom",
      "icon-image": iconImage,
      "icon-padding": 0,
      "icon-size": [
        "interpolate",
        ["exponential", 1.7],
        ["zoom"],
        13,
        ICON_SIZE,
        16,
        ICON_SIZE * 2
      ],
      "text-anchor": "top",
      "text-field": ["get", "name"],
      "text-offset": [0, 0.25],
      visibility: visibility ?? "visible"
    },
    paint: {},
    source: {
      data: sourceData,
      type: "geojson"
    },
    type: "symbol"
  };

  if (sdfColor) {
    layer.imageOptions = { sdf: true };
    layer.paint = layer.paint || {};
    layer.paint["icon-color"] = sdfColor;
  }

  (layer as AnyLayer).on = {
    click: evt => {
      const { features } = evt;
      if (features) {
        const [feature] = features;
        onClick && onClick(feature.properties?.id);
      }
    }
  };

  setHoverClass(layer);

  return layer;
}

function createTraceLayer(
  routeId: number,
  color: string,
  trace?: Trace
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
      "line-opacity": feature?.properties["stroke-opacity"] || 1,
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
  options: {
    color?: string;
    onClick?: (landmarkId: number) => void;
    visibility: AnyLayout["visibility"];
  }
): CircleLayer | null {
  return createCircleLayer(routeId, stops, "stops", options);
}

function selector(state: ContextData) {
  return {
    options: state?.options
  };
}

function setHoverClass(layer: AnyLayer) {
  layer.on = {
    ...(layer.on ?? {}),
    mouseenter: () => {
      const mcc = document.body.querySelectorAll(
        ".mapboxgl-canvas-container.mapboxgl-interactive"
      );
      if (mcc?.length) {
        mcc[0].classList.add("hover");
      }
    },
    mouseleave: () => {
      const mcc = document.body.querySelectorAll(
        ".mapboxgl-canvas-container.mapboxgl-interactive"
      );
      if (mcc?.length) {
        mcc[0].classList.remove("hover");
      }
    }
  };
}
