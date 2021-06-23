import { INFORMATION, MAP } from "../constants/routes";

export function getRouteParameters(): { display: Display; routeId: string } {
  const path = window.location.pathname.slice(1);
  if (!path) {
    return null;
  }

  const arr = path.split("/");
  if (arr.length < 2) {
    return null;
  }

  const [routeId, display] = arr;
  return { display: display as Display, routeId };
}

type Display = keyof { [INFORMATION]: null; [MAP]: null };
