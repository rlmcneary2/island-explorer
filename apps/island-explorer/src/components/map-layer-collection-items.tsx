import { useEffect, useMemo } from "react";
import type { LngLatBoundsLike } from "mapbox-gl";
import bbox from "@turf/bbox";
import { useMapGL } from "remapgl";
import { ContextData, MapLayerCollectionItem } from "../context/types";
import useContextState from "../context/use-context-state";
import MapLayerCollection from "./map-layer-collection";
import { getRouteOrderLandmarks } from "../util/landmark";

export default function MapLayerCollectionItems({
  fitBounds,
  routeId
}: {
  fitBounds: (bounds: LngLatBoundsLike) => void;
  routeId: number;
}) {
  const { ready } = useMapGL();
  const selector = useMemo(
    () => (state: ContextData) => ({
      color: state?.routes?.data?.find(x => x.id === routeId)?.color ?? "000",
      landmarks: state?.landmarks,
      routes: state?.routes,
      routeTrace: state?.routeTrace ?? null
    }),
    [routeId]
  );

  const { color, landmarks, routes, routeTrace } =
    useContextState(selector) ?? {};

  const landmarksReady =
    landmarks?.status === "idle" && !landmarks.error && landmarks.data;

  const traceReady =
    routeTrace?.status === "idle" && !routeTrace.error && routeTrace.data;

  const landmarksData = landmarks?.data;
  const routesData = routes?.data;

  const stops = useMemo(
    () =>
      getRouteOrderLandmarks(routeId, routesData, landmarksData).filter(
        l => l.id < 10000
      ),
    [landmarksData, routeId, routesData]
  );

  const pointsOfInterest = useMemo(() => {
    return getRouteOrderLandmarks(routeId, routesData, landmarksData)
      .filter(l => l.landmarkType === "point-of-interest")
      .filter(l => stops.every(r => l.id !== r.id));
  }, [landmarksData, routeId, stops, routesData]);

  const trailheads = useMemo(
    () =>
      getRouteOrderLandmarks(routeId, routesData, landmarksData).filter(
        l =>
          20000 <= l.id &&
          (l.landmarkType === "trail-head" ||
            l.landmarkType === "trail-crossing")
      ),
    [landmarksData, routeId, routesData]
  );

  const { data: trace } = routeTrace ?? { data: null };

  // Update the map bounds based on the trace bounds.
  useEffect(() => {
    if (!ready || !traceReady || !fitBounds) {
      return;
    }

    const bounds = bbox(trace) as LngLatBoundsLike;
    fitBounds(bounds);
  }, [fitBounds, ready, trace, traceReady]);

  const items = useMemo<MapLayerCollectionItem[]>(
    () => [
      {
        color,
        pointsOfInterest: pointsOfInterest ?? null,
        routeId,
        stops: stops ?? null,
        trace: trace ?? null,
        trailheads: trailheads ?? null
      }
    ],
    [color, pointsOfInterest, routeId, stops, trace, trailheads]
  );

  if (!landmarksReady || !traceReady) {
    return null;
  }

  return <MapLayerCollection items={items} />;
}
