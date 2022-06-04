import { FormattedMessage } from "react-intl";
import { ContextState, Vehicle } from "../../context/types";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";
import { Landmark } from "../../types/types";
import {
  DetailedHTMLProps,
  HTMLAttributes
} from "react-router/node_modules/@types/react";

export function VehiclePopup({ routeStops, vehicle, ...props }: Props) {
  const { landmarks, routes } = useContextState(selector);

  if (
    routes?.status !== "idle" ||
    routes?.error ||
    landmarks?.status !== "idle" ||
    landmarks?.error
  ) {
    return null;
  }

  const route = routes.data.find(route => route.id === vehicle.RouteId);
  const routeLandmarksStops = route.landmarks
    .filter(x => x < 20000)
    .map(x => getLandmark(x, landmarks.data));

  const lastStopId = mapLastStopToRouteId(vehicle.LastStop, routeStops);
  let nextStop: Landmark;
  if (lastStopId) {
    const currentIndex = routeLandmarksStops.findIndex(
      x => x.id === lastStopId
    );
    nextStop =
      routeLandmarksStops[
        currentIndex + 1 < routeLandmarksStops.length ? currentIndex + 1 : 0
      ];
  }

  return (
    <div {...props} className="popup">
      <span className="header">
        <FormattedMessage id="NEXT_STOP" />
      </span>
      <p className="description">{nextStop?.displayName ?? "?"}</p>
    </div>
  );
}

function mapLastStopToRouteId(lastStop: string, routeStops: Landmark[]) {
  if (!routeStops) {
    return;
  }

  return routeStops.find(x => x.stopName === lastStop)?.id;
}

interface Props
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "className"
  > {
  routeStops: Landmark[];
  vehicle: Vehicle;
}

function selector(state: ContextState) {
  return { landmarks: state?.landmarks, routes: state?.routes };
}
