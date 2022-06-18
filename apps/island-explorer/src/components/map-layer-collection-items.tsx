import { useEffect, useMemo } from "react";
import type { LngLatBoundsLike } from "mapbox-gl";
import bbox from "@turf/bbox";
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
  const selector = useMemo(
    () => (state: ContextData) => ({
      color: state?.routes?.data?.find(x => x.id === routeId).color ?? "000",
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

  const routeLandmarks = useMemo(
    () =>
      getRouteOrderLandmarks(routeId, routesData, landmarksData).filter(
        l => l.id < 10000
      ),
    [landmarksData, routeId, routesData]
  );

  const trailheadLandmarks = useMemo(
    () =>
      getRouteOrderLandmarks(routeId, routesData, landmarksData).filter(
        l => 20000 <= l.id && l.landmarkType === "trail-head"
      ),
    [landmarksData, routeId, routesData]
  );

  const { data: trace } = routeTrace ?? { data: null };

  // Update the map bounds based on the trace bounds.
  useEffect(() => {
    if (!landmarksReady || !traceReady || !fitBounds) {
      return;
    }

    const bounds = bbox(trace) as LngLatBoundsLike;
    fitBounds(bounds);
  }, [fitBounds, landmarksReady, trace, traceReady]);

  const items = useMemo<MapLayerCollectionItem[]>(
    () => [
      {
        color,
        routeId,
        stops: routeLandmarks ?? null,
        trace: trace ?? null,
        trailheads: trailheadLandmarks ?? null
      }
    ],
    [color, routeId, routeLandmarks, trace, trailheadLandmarks]
  );

  if (!landmarksReady || !traceReady) {
    return null;
  }

  return <MapLayerCollection items={items} />;
}
