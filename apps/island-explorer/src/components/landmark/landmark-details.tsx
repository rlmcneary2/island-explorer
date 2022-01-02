import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import routesJson from "../../assets/routes.json";
import { Landmark } from "../../types/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { getRouteParameters, getRoutePath } from "../../util/route";

const { routes } = routesJson;

export function LandmarkDetails({
  description,
  displayName,
  features,
  id
}: Landmark) {
  const { deselectLandmark } = useContextActions();
  const contextRoutes = useContextState(state => state.routes);

  const stopsRoutes = routes
    .filter(route => route.landmarks.includes(id))
    .map(route => contextRoutes.data.find(x => x.RouteId === route.id));

  const { page } = getRouteParameters();

  return (
    <>
      <span className="header">{displayName}</span>
      <div className="symbol-container para-margin">
        {features?.length &&
          features.map(feature => (
            <i className={`sym-${feature}`} key={feature} />
          ))}
      </div>
      <div className="route-circle-container">
        {stopsRoutes.map(x => (
          <Link
            key={x.RouteId}
            style={{ color: `#${x.Color}` }}
            to={getRoutePath(x.RouteId, page)}
          />
        ))}
      </div>
      {description && (
        <p className="description">
          <FormattedMessage id={description} />
        </p>
      )}
      <div className="button-container">
        <button className="button small" onClick={() => deselectLandmark(id)}>
          <FormattedMessage id="REMOVE_MARKER" />
        </button>
      </div>
    </>
  );
}
