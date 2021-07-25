import { Link } from "react-router-dom";
import { ModalDialog } from "modal";
import type { ModalDialogProps } from "modal";
import { ContextData } from "../context/types";
import { getRouteParameters } from "../util/route";

export function RoutesModal({ onExternalTouch, routes }: Props) {
  const { page } = getRouteParameters();
  const { data, error, status } = routes;

  if (status !== "idle") {
    return <p>loading...</p>;
  }

  const items = data.map(route => {
    return (
      <li key={route.RouteId}>
        <Link to={`/${route.RouteId}/${page}`}>{route.LongName}</Link>
      </li>
    );
  });

  return (
    <ModalDialog className="modal" onExternalTouch={onExternalTouch}>
      <nav className="content">
        <ul>{items}</ul>
      </nav>
    </ModalDialog>
  );
}

interface Props extends Pick<ModalDialogProps, "onExternalTouch"> {
  routes: ContextData["routes"];
}
