import { Link } from "react-router-dom";
import { ModalDialog } from "modal";
import type { ModalDialogProps } from "modal";
import { ContextData } from "../context/types";
import { getRouteParameters } from "../util/route";

export function RoutesModal({ onClose, onExternalTap, routes }: Props) {
  const { page } = getRouteParameters();
  const { data, error, status } = routes;

  if (status !== "idle") {
    return <p>loading...</p>;
  }

  const items = data.map(route => {
    return (
      <li key={route.RouteId}>
        <Link onClick={onClose} to={`/${route.RouteId}/${page}`}>
          {route.LongName}
        </Link>
      </li>
    );
  });

  return (
    <ModalDialog className="modal" onExternalTap={onExternalTap}>
      <nav className="content">
        <ul>{items}</ul>
      </nav>
    </ModalDialog>
  );
}

interface Props extends Pick<ModalDialogProps, "onClose" | "onExternalTap"> {
  routes: ContextData["routes"];
}
