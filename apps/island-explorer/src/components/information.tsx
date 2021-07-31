import { routes } from "../assets/routes.json";
import { landmarks } from "../assets/landmarks.json";

export default function Information({ routeId }: Props) {
  const route = routes.find(r => r.id === routeId);
  if (!route) {
    return null;
  }

  const { scheduledStops, ...displayRoute } = route;

  const routeLandmarks = landmarks.filter(l =>
    route.landmarks.some(rl => rl === l.id)
  );

  return (
    <div className="information">
      <span>{`Information route ${routeId || "?"}`}</span>
      <pre>{JSON.stringify(displayRoute, null, 2)}</pre>
      <pre>{JSON.stringify(routeLandmarks, null, 2)}</pre>
    </div>
  );
}

type Props = {
  routeId?: number;
};
