import React, { useCallback, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { ContextState } from "../context/types";
import { INFORMATION, MAP } from "../constants/routes";
import useContextState from "../context/use-context-state";
import { RoutesModal } from "./routes-modal";
import { getRouteParameters, getRoutePath } from "../util/route";
import { Menu } from "./menu/menu";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();

  const routes =
    useContextState(state => state.routes) ?? ({} as ContextState["routes"]);

  const handleDirectionsClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    history.push("/directions");
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
