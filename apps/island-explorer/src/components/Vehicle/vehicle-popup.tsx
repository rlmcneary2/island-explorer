import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";
import type { ContextData, Vehicle } from "../../context/types";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";
import { Landmark } from "../../types/types";
import routes from "../../data/routes";

export function VehiclePopup({ routeStops, vehicle, ...props }: Props) {
  const { landmarks } = useContextState(selector);

  if (landmarks?.status !== "idle" || landmarks?.error) {
    return null;
  }

  const route = routes.find(route => route.id === vehicle.RouteId);

  const landmarksData = landmarks.data;
  const routeLandmarksStops =
    route && landmarksData
      ? route.landmarks.map(x => getLandmark(x, landmarksData))
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

function selector(state: ContextData) {
  return { landmarks: state?.landmarks, routes: state?.routes };
}
