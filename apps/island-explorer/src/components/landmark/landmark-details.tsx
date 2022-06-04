import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Landmark } from "../../types/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { getRouteParameters, getRoutePath } from "../../util/route";

export function LandmarkDetails({
  description,
  displayName,
  features,
  id
}: Landmark) {
  const { deselectLandmark } = useContextActions();
  const routes = useContextState(state => state.routes);

  if (routes?.status !== "idle" || routes?.error) {
    return null;
  }

  const stopsRoutes = routes.data.filter(route => route.landmarks.includes(id));

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
            key={x.id}
            style={{ color: `#${x.color}` }}
            to={getRoutePath(x.id, page)}
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
