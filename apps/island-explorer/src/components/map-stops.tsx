import { Marker } from "remapgl";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";
import { LandmarkPopup } from "./controls/popup/landmark";
import { getLandmark } from "../util/landmark";

export function MapStops() {
  const selectedStopIds = useContextState(selector);

  if (!selectedStopIds || !selectedStopIds.length) {
    return null;
  }

  return (
    <>
      {selectedStopIds.map(item => {
        const landmark = getLandmark(item);
        return (
          <Marker
            color="#5F911B"
            key={item}
            lnglat={[landmark.location.longitude, landmark.location.latitude]}
            popup={popupGL => <LandmarkPopup {...landmark} popupGL={popupGL} />}
            popupOptions={{ closeButton: false }}
          />
        );
      })}
    </>
  );
}

function selector(state: ContextData) {
  return state?.selectedStopIds;
}
