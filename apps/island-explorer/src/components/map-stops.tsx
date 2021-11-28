import { Marker } from "remapgl";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";
import { Landmark } from "../types/types";
import { LandmarkModal } from "./controls/modal/landmark-modal";
import { getLandmark } from "../util/landmark";
import { useState } from "react";

export function MapStops() {
  const [landmark, setLandmark] = useState<Landmark>();
  const [mountModal, setMountModal] = useState(false);
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
            on={{
              click: () => {
                setLandmark(landmark);
                setMountModal(true);
              }
            }}
          />
        );
      })}

      {landmark && mountModal && (
        <LandmarkModal {...landmark} onClose={() => setMountModal(false)} />
      )}
    </>
  );
}

function selector(state: ContextData) {
  return state?.selectedStopIds;
}
