import { useEffect, useMemo } from "react";
import type { LngLatBoundsLike } from "mapbox-gl";
import bbox from "@turf/bbox";
import { ContextData, MapLayerCollectionItem } from "../context/types";
import useContextState from "../context/use-context-state";
import MapLayerCollection from "./map-layer-collection";

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
      routeStops: state?.routeStops ?? null,
      routeTrace: state?.routeTrace ?? null
    }),
    [routeId]
  );

  const { color, routeStops, routeTrace } = useContextState(selector) ?? {};

  const traceReady =
    routeTrace?.status === "idle" && !routeTrace.error && routeTrace.data;

  const { data: trace } = routeTrace ?? { data: null };

  // Update the map bounds based on the trace bounds.
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
