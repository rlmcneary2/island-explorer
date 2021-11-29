import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { MAP } from "../constants/routes";
import { getRoutePath } from "../util/route";
import { ContextActions } from "../context/types";

export function InformationLandmark({ landmark, onClick, routeId }: Props) {
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
          landmark.features.map(feature => (
            <i className={`sym-${feature}`} key={feature} />
          ))}
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
