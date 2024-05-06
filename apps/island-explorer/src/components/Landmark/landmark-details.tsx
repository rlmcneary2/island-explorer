import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Landmark } from "../../types/types";
import { getRouteParameters, getRoutePath } from "../../util/route";
import routes from "../../data/routes";

export function LandmarkDetails({
  description,
  displayName,
  features,
  id
}: Landmark) {
  const stopsRoutes = routes.filter(route => route.landmarks.includes(id));

  const { page } = getRouteParameters() ?? {};

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
        {stopsRoutes && page
          ? stopsRoutes.map(x => (
              <Link
                key={x.id}
                style={{ color: `#${x.color}` }}
                to={getRoutePath(x.id, page)}
              />
            ))
          : null}
      </div>
      {description && (
        <p className="description">
          <FormattedMessage id={description} />
        </p>
      )}
    </>
  );
}
