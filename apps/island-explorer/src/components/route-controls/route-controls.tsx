import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { INFORMATION, MAP } from "../../constants/routes";
import { getRouteParameters, getRoutePath } from "../../util/route";

export function RouteControls({
  handleMenuButtonClick,
  handleRouteClick
}: RouteControlsProps) {
  const { pathname } = useLocation();

  const { page, routeId } = getRouteParameters(pathname) ?? {};

  return (
    <>
      <button className="button options" onClick={handleMenuButtonClick}>
        <span>
          <FormattedMessage id="MENU" />
        </span>
      </button>
      <button className="button" onClick={handleRouteClick}>
        <FormattedMessage id="SELECT_ROUTE" />
      </button>

      {routeId ? (
        <Link
          className="button"
          to={getRoutePath(routeId, page === MAP ? INFORMATION : MAP)}
        >
          <FormattedMessage
            id={(page === MAP ? INFORMATION : MAP).toUpperCase()}
          />
        </Link>
      ) : null}
    </>
  );
}

interface RouteControlsProps {
  handleMenuButtonClick: React.MouseEventHandler;
  handleRouteClick: React.MouseEventHandler;
}
