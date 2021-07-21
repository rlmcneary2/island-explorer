import { Link } from "react-router-dom";
import { Modal } from "modal";
import { ContextData } from "../context/types";
import { getRouteParameters } from "../util/route";

export function RoutesModal({ routes }: Props) {
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
    <Modal>
      <nav>
        <ul>{items}</ul>
      </nav>
    </Modal>
  );
}

interface Props {
  routes: ContextData["routes"];
}
