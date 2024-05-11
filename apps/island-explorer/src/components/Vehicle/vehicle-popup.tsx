import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";
import type { Vehicle } from "../../context/types";
import { getLandmark } from "../../util/landmark";
import { Landmark } from "../../types/types";
import routes from "../../data/routes";
import landmarks from "../../data/landmarks";

export function VehiclePopup({ routeStops, vehicle, ...props }: Props) {
  const route = routes.find(route => route.id === vehicle.RouteId);

  const routeLandmarksStops = route
    ? route.landmarks.map(x => getLandmark(x, landmarks))
    : [];

  const lastStopId = mapLastStopToRouteId(vehicle.LastStop, routeStops);
  let lastStop: Landmark | undefined;
  if (lastStopId) {
    lastStop = routeLandmarksStops.find(x => x.id === lastStopId);
  }

  return (
    <div {...props} className="popup">
      <span className="header">
        <FormattedMessage id="BUS_NAME" values={{ name: vehicle.Name }} />
      </span>
      <p className="description">
        <FormattedMessage
          id="LAST_STOP"
          values={{ name: lastStop?.displayName ?? `?${vehicle.LastStop}?` }}
        />
      </p>
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
