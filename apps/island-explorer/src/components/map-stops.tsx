import { MapPopup } from "remapgl";
import { ContextData } from "../context/types";
import useContextActions from "../context/use-context-actions";
import useContextState from "../context/use-context-state";
import { getLandmark } from "../util/landmark";
import { LandmarkDetails } from "./landmark/landmark-details";

export function MapStops() {
  const { deselectLandmark } = useContextActions();
  const { landmarks, selectedLandmarks } = useContextState(selector);

  if (
    !selectedLandmarks ||
    !selectedLandmarks.length ||
    landmarks?.status !== "idle" ||
    landmarks?.error
  ) {
    return null;
  }

  return (
    <>
      {selectedLandmarks.map(({ landmarkId }) => {
        const landmark = getLandmark(landmarkId, landmarks.data);
        return (
          <MapPopup
            key={landmarkId}
            onClose={() => deselectLandmark(landmarkId)}
            options={{ closeButton: false }}
            lngLat={[landmark.location.longitude, landmark.location.latitude]}
          >
            <div className="popup">
              <LandmarkDetails {...landmark} />
            </div>
          </MapPopup>
        );
      })}
    </>
  );
}

function selector(state: ContextData) {
  return {
    landmarks: state?.landmarks,
    selectedLandmarks: state?.selectedLandmarks
  };
}
