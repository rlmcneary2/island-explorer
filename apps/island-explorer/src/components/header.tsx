import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { ContextState } from "../context/types";
import { INFORMATION, MAP } from "../constants/routes";
import useContextState from "../context/use-context-state";
import { RoutesModal } from "./routes-modal";
import { getRouteParameters, getRoutePath } from "../util/route";

export default function Header() {
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const { pathname } = useLocation();

  const routes =
    useContextState(state => state.routes) ?? ({} as ContextState["routes"]);

  const handleRouteClick = useCallback(() => {
    setShowRoutesModal(current => !current);
  }, []);

  const { page, routeId } = getRouteParameters(pathname) ?? {};

  return (
    <div className="header">
      <button className="button primary" onClick={handleRouteClick}>
        <FormattedMessage id="SELECT_ROUTE" />
      </button>

      <Link
        className="button"
        to={getRoutePath(routeId, page === MAP ? INFORMATION : MAP)}
      >
        <FormattedMessage
          id={(page === MAP ? INFORMATION : MAP).toUpperCase()}
        />
      </Link>

      {showRoutesModal ? (
        <RoutesModal
          onClose={() => setShowRoutesModal(false)}
          onExternalTap={() => setShowRoutesModal(false)}
          routes={routes}
        />
      ) : null}
    </div>
  );
}
