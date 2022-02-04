import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { MAP } from "../constants/routes";
import { getRoutePath } from "../util/route";
import { ContextActions } from "../context/types";

export function InformationLandmark({ landmark, onClick, routeId }: Props) {
  const featureOrder = [
    "accessible",
    "restroom",
    "water",
    "station",
    "snack",
    "dine",
    "picnic",
    "gift",
    "park",
    "camp",
    "inn",
    "wonder",
    "attraction",
    "beach",
    "swim",
    "walk",
    "hike",
    "climb",
    "technical",
    "bike",
    "fish",
    "boat",
    "airport",
    "ferry",
    "tower"
  ];

  return (
    <li
      className={`landmark${landmark.id < 4000 ? " stop" : ""}`}
      key={landmark.id}
    >
      <Link
        onClick={() => onClick({ landmarkId: landmark.id })}
        to={getRoutePath(routeId, MAP)}
      >
        <h2>{landmark.displayName}</h2>
      </Link>
      <div className="symbol-container">
        {landmark.features?.length &&
          landmark.features
            .sort((a, b) => {
              return (
                featureOrder.findIndex(feature => feature === a) -
                featureOrder.findIndex(feature => feature === b)
              );
            })
            .map(feature => <i className={`sym-${feature}`} key={feature} />)}
      </div>
      {landmark.description && (
        <p>
          <FormattedMessage id={landmark.description} />
        </p>
      )}
    </li>
  );
}

interface Props {
  landmark: {
    description?: string;
    displayName: string;
    features?: string[];
    id: number;
  };
  onClick: ContextActions["selectLandmark"];
  routeId: number;
}
