import { FormattedMessage } from "react-intl";
import { Stop, Vehicle } from "../../context/types";
import routesJson from "../../assets/routes.json";
import { getLandmark } from "../../util/landmark";
import { Landmark } from "../../types/types";
import {
  DetailedHTMLProps,
  HTMLAttributes
} from "react-router/node_modules/@types/react";

const { routes } = routesJson;

export function VehiclePopup({ routeStops, vehicle, ...props }: Props) {
  const route = routes.find(route => route.id === vehicle.RouteId);
  const routeLandmarksStops = route.landmarks
    .filter(x => x < 20000)
    .map(x => getLandmark(x));

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

function mapLastStopToRouteId(lastStop: string, routeStops: Stop[]) {
  if (!routeStops) {
    return;
  }

  return routeStops.find(x => x.Name === lastStop)?.StopId;
}

interface Props
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "className"
  > {
  routeStops: Stop[];
  vehicle: Vehicle;
}