import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedModalDialog } from "modal";
import type { ModalDialogProps } from "modal";
import { ContextData } from "../context/types";
import { getRouteParameters, getRoutePath } from "../util/route";

export function RoutesModal({ onClose, onExternalTap, routes }: Props) {
  const [hide, setHide] = useState(false);
  const callbackFunc = useRef<(() => void) | undefined>();

  const routeParameters = getRouteParameters();

  const handleLinkClick = useCallback<Required<Props>["onClose"]>(() => {
    callbackFunc.current = onClose;
    setHide(true);
  }, [onClose]);

  const handleExternalTap = useCallback(() => {
    callbackFunc.current = onExternalTap;
    setHide(true);
  }, [onExternalTap]);

  const handleHidden = useCallback(
    () => callbackFunc.current && callbackFunc.current(),
    []
  );

  if (routes?.status !== "idle") {
    return <p>loading...</p>;
  }

  const items = routes?.data
    ? routes.data.map(route => {
        return (
          <li className="list-item" key={route.id}>
            <Link
              onClick={handleLinkClick}
              style={{ color: `#${route.color}` }}
              to={getRoutePath(route.id, routeParameters?.page ?? "map")}
            >
              {route.displayName}
            </Link>
          </li>
        );
      })
    : [];

  return (
    <AnimatedModalDialog
      className="modal"
      hide={hide}
      onExternalTap={handleExternalTap}
      onHidden={handleHidden}
    >
      <nav className="content dialog routes">
        <ul className="list">{items}</ul>
      </nav>
    </AnimatedModalDialog>
  );
}

interface Props extends Pick<ModalDialogProps, "onClose" | "onExternalTap"> {
  routes: ContextData["routes"];
}
