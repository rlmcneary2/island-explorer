import { INFORMATION, MAP } from "../constants/routes";

export function getRouteParameters(
  pathname?: Location["pathname"]
): { page: RoutePage; routeId: string } {
  const path = (pathname || window.location.pathname).slice(1);
  if (!path) {
    return null;
  }

  const arr = path.split("/");
  if (arr.length < 2) {
    return null;
  }

  const [routeId, page] = arr;
  return { page: page as RoutePage, routeId };
}

type RoutePage = keyof { [INFORMATION]: null; [MAP]: null };
