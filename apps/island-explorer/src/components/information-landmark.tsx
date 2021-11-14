import { FormattedMessage } from "react-intl";

export function InformationLandmark(landmark: {
  description?: string;
  displayName: string;
  features?: string[];
  id: number;
}) {
  return (
    <li
      className={`landmark${landmark.id < 4000 ? " stop" : ""}`}
      key={landmark.id}
    >
      <h2>{landmark.displayName}</h2>
      <div className="symbol-container">
        {landmark.features?.length &&
          landmark.features.map(feature => (
            <i className={`sym-${feature}`} key={feature} />
          ))}
      </div>
      <p>
        <FormattedMessage id={landmark.description} />
      </p>
    </li>
  );
}
