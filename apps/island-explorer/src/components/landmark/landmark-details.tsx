import { FormattedMessage } from "react-intl";
import { routes } from "../../assets/routes.json";
import useContextState from "../../context/use-context-state";
import { Landmark } from "../../types/types";

export function LandmarkDetails({
  description,
  displayName,
  features,
  id
}: Landmark) {
  const contextRoutes = useContextState(state => state.routes);
  const stopsRoutes = routes
    .filter(route => route.landmarks.includes(id))
    .map(route => contextRoutes.data.find(x => x.RouteId === route.id));

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
          <div key={x.RouteId} style={{ color: `#${x.Color}` }}></div>
        ))}
      </div>
      {description && (
        <p className="description">
          <FormattedMessage id={description} />
        </p>
      )}
    </>
  );
}
