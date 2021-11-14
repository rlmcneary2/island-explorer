import { FormattedMessage } from "react-intl";

export function InformationLandmark({ landmark, onClick }: Props) {
  return (
    <li
      className={`landmark${landmark.id < 4000 ? " stop" : ""}`}
      key={landmark.id}
    >
      <button onClick={() => onClick(landmark.id)}>
        <h2>{landmark.displayName}</h2>
      </button>
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

interface Props {
  landmark: {
    description?: string;
    displayName: string;
    features?: string[];
    id: number;
  };
  onClick: (stopId: number) => void;
}
