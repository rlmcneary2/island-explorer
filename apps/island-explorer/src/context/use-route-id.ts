import { useParams } from "react-router-dom";

export function useRouteId(): number {
  const { routeId } = useParams();
  return routeId ? +routeId : 0;
}
