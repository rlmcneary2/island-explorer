import { Marker } from "remapgl";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";
import { LandmarkPopup } from "./landmark/landmark-popup";
import { getLandmark } from "../util/landmark";

export function MapStops() {
  const selectedLandmarks = useContextState(selector);

  if (!selectedLandmarks || !selectedLandmarks.length) {
    return null;
  }

  return (
    <>
      {selectedLandmarks.map(({ landmarkId }) => {
        const landmark = getLandmark(landmarkId);
        return (
          <Marker
            color="#5F911B"
            key={landmarkId}
            lnglat={[landmark.location.longitude, landmark.location.latitude]}
            obj={obj => obj.togglePopup()}
            popup={popupGL => <LandmarkPopup popupGL={popupGL} {...landmark} />}
            popupOptions={{ closeButton: false }}
          />
        );
      })}
    </>
  );
}

function selector(state: ContextData) {
  return state?.selectedLandmarks;
}
