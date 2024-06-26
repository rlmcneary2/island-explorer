import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useServiceWorker } from "service-worker-provider";
import { INFORMATION, MAP } from "../../constants/routes";
import { RoutesModal } from "../RoutesModal/routes-modal";
import { getRouteParameters, getRoutePath } from "../../util/route";
import { Menu } from "../Menu/menu";
import routes from "../../data/routes";

export function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const swUpdate = useServiceWorker(ctx => ctx.update);

  useEffect(() => {
    if (!pathname.includes("route")) {
      return;
    }

    swUpdate && swUpdate();
  }, [pathname, swUpdate]);

  const handleDirectionsClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    navigate("/directions");
  };

  const handleMenuButtonClick = useCallback(() => {
    setShowMenu(true);
    setTimeout(() => setShowMenu(false), 0);
  }, []);

  const handleRouteClick = useCallback(() => {
    setShowRoutesModal(current => !current);
  }, []);

  const { page, routeId } = getRouteParameters(pathname) ?? {};

  return (
    <div className="header">
      <button className="button options" onClick={handleMenuButtonClick}>
        <span>Menu</span>
      </button>

      <button className="button fit" onClick={handleRouteClick}>
        <FormattedMessage id="SELECT_ROUTE" />
      </button>

      {routeId ? (
        <Link
          className="button fit"
          to={getRoutePath(routeId, page === MAP ? INFORMATION : MAP)}
        >
          <FormattedMessage
            id={(page === MAP ? INFORMATION : MAP).toUpperCase()}
          />
        </Link>
      ) : null}

      <button className="button fit" onClick={handleDirectionsClick}>
        <FormattedMessage id="DIRECTIONS" />
      </button>

      {showRoutesModal ? (
        <RoutesModal
          onClose={() => setShowRoutesModal(false)}
          onExternalTap={() => setShowRoutesModal(false)}
          routes={routes}
        />
      ) : null}

      <Menu show={showMenu} />
    </div>
  );
}
