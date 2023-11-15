import { MAP, ROUTE, ROUTE_TEMPLATE } from "../constants/routes";
import { RoutePage } from "../types/types";

export function getRouteParameters(pathname?: Location["pathname"]): {
  page: RoutePage;
  routeId: string;
} | null {
  const path = (pathname || window.location.pathname).slice(1);
  if (!path) {
    return null;
  }

  if (!path.startsWith(ROUTE)) {
    return { page: MAP, routeId: "3" };
  }

  const arr = path.split("/");
  if (arr.length < 2) {
    return null;
  }

  const templateParts = ROUTE_TEMPLATE.substring(1).split("/");
  const idIndex = templateParts.findIndex(x => x === ":routeId");
  const pageIndex = templateParts.findIndex(x => x === ":routePage");

  return { page: arr[pageIndex] as RoutePage, routeId: arr[idIndex] };
}

export function getRoutePath(routeId: number | string, page: RoutePage) {
  return ROUTE_TEMPLATE.replace(":routeId", `${routeId}`).replace(
    ":routePage",
    page
  );
}
