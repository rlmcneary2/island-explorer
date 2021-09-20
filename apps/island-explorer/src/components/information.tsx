import { routes } from "../assets/routes.json";
import { landmarks } from "../assets/landmarks.json";
import { FormattedMessage } from "react-intl";

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
    <section className="information">
      <h1>{route.displayName}</h1>
      {route.description && (
        <p className="description">
          <FormattedMessage id={route.description} />
        </p>
      )}
      {route.notices?.length
        ? route.notices.map(notice => (
            <p className="notice" key={notice}>
              <FormattedMessage id={notice} />
            </p>
          ))
        : null}
      {route.tips?.length
        ? route.tips.map(tip => (
            <p className="tip" key={tip}>
              <FormattedMessage id={tip} />
            </p>
          ))
        : null}
      {routeLandmarks.length ? (
        <ul className="landmarks">
          {routeLandmarks.map(landmark => (
            <li key={landmark.id}>
              <div className="landmark">
                <p>{landmark.displayName}</p>
                {landmark.features?.length &&
                  landmark.features.map(feature => (
                    <i className={`sym-${feature}`} key={feature} />
                  ))}
                <p>
                  <FormattedMessage id={landmark.description} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

type Props = {
  routeId?: number;
};
