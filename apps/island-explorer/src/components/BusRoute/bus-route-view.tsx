import { Outlet, Route } from "react-router-dom";
import { FormattedRelativeTime } from "react-intl";
import { INFORMATION } from "../../constants/routes";
import Map from "../Map/map";
import Information from "../Information/information";
import useContextState from "../../context/use-context-state";
import { ConnectionStatus } from "../Toast/connection-status/connection-status";
import { ContextData } from "../../context/types";

export function BusRouteView({ routeView }: BusRouteViewProps) {
  const { routeId, routeVehicles } = useContextState(selector);

  const timeValue = routeVehicles?.nextUpdate
    ? Math.round((routeVehicles.nextUpdate - Date.now()) / 1000)
    : 0;

  if (!routeId && routeId !== 0) {
    return null;
  }

  return (
    <>
      <Map routeId={routeId} />
      {routeView === "information" ? <Information routeId={routeId} /> : null}
      <div
        style={{
          background: "white",
          bottom: 0,
          padding: "2px",
          position: "absolute",
          right: 0
        }}
      >
        {!isNaN(timeValue) && 0 <= timeValue && (
          <>
            {"Update "}
            <FormattedRelativeTime
              numeric="auto"
              value={timeValue}
              updateIntervalInSeconds={1}
            />
          </>
        )}
      </div>
      <ConnectionStatus
        connected={routeVehicles ? !routeVehicles.error : true}
        messageId="CONNECTION_ERROR"
      />
    </>
  );
}

export interface BusRouteViewProps {
  routeView: "information" | "map";
}

function selector({ routeId, routeVehicles }: ContextData) {
  return {
    routeId,
    routeVehicles
  };
}
