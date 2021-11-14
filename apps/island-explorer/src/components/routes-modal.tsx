import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedModalDialog } from "modal";
import type { ModalDialogProps } from "modal";
import { ContextData } from "../context/types";
import { getRouteParameters } from "../util/route";

export function RoutesModal({ onClose, onExternalTap, routes }: Props) {
  const [hide, setHide] = useState(false);
  const callbackFunc = useRef<() => void>(null);

  const { page } = getRouteParameters();
  const { data, status } = routes;

  const handleLinkClick = useCallback<Props["onClose"]>(() => {
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

  if (status !== "idle") {
    return <p>loading...</p>;
  }

  const items = data.map(route => {
    return (
      <li className="list-item" key={route.RouteId}>
        <Link
          onClick={handleLinkClick}
          style={{ color: `#${route.Color}` }}
          to={`/${route.RouteId}/${page}`}
        >
          {route.LongName}
        </Link>
      </li>
    );
  });

  return (
    <AnimatedModalDialog
      className="modal"
      hide={hide}
      onExternalTap={handleExternalTap}
      onHidden={handleHidden}
    >
      <nav className="content routes">
        <ul className="list">{items}</ul>
      </nav>
    </AnimatedModalDialog>
  );
}

interface Props extends Pick<ModalDialogProps, "onClose" | "onExternalTap"> {
  routes: ContextData["routes"];
}
