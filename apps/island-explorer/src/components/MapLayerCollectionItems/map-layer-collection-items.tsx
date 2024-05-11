import { useEffect, useMemo } from "react";
import type { LngLatBoundsLike } from "mapbox-gl";
import bbox from "@turf/bbox";
import { useMapGL } from "remapgl";
import { ContextData, MapLayerCollectionItem } from "../../context/types";
import useContextState from "../../context/use-context-state";
import MapLayerCollection from "../MapLayerCollection/map-layer-collection";
import { getRouteOrderLandmarks } from "../../util/landmark";
import routes from "../../data/routes";
import landmarks from "../../data/landmarks";

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
      routeTrace: state?.routeTrace ?? null
    }),
    []
  );

  const { routeTrace } = useContextState(selector) ?? {};

  const color = routes.find(x => x.id === routeId)?.color ?? "000";

  const traceReady =
    routeTrace?.status === "idle" && !routeTrace.error && routeTrace.data;

  const stops = useMemo(
    () =>
      getRouteOrderLandmarks(routeId, routes, landmarks).filter(
        l => l.id < 10000
      ),
    [routeId]
  );

  const pointsOfInterest = useMemo(() => {
    return getRouteOrderLandmarks(routeId, routes, landmarks)
      .filter(l => l.landmarkType === "point-of-interest")
      .filter(l => stops.every(r => l.id !== r.id));
  }, [routeId, stops]);

  const trailheads = useMemo(
    () =>
      getRouteOrderLandmarks(routeId, routes, landmarks).filter(
        l =>
          10000 <= l.id &&
          (l.landmarkType === "trail-head" ||
            l.landmarkType === "trail-crossing")
      ),
    [routeId]
  );

  const { data: trace } = routeTrace ?? {};

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
        trace: trace,
        trailheads: trailheads ?? null
      }
    ],
    [color, pointsOfInterest, routeId, stops, trace, trailheads]
  );

  if (!traceReady) {
    return null;
  }

  return <MapLayerCollection items={items} />;
}
