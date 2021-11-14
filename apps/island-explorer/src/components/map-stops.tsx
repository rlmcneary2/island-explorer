import { landmarks } from "../assets/landmarks.json";
import { Marker } from "remapgl";
import { ContextData } from "../context/types";
import useContextState from "../context/use-context-state";

export function MapStops() {
  const selectedStopIds = useContextState(selector);

  if (!selectedStopIds || !selectedStopIds.length) {
    return null;
  }

  return (
    <>
      {selectedStopIds.map(item => {
        const landmark = landmarks.find(landmark => landmark.id === item);
        return (
          <Marker
            color="#5F911B"
            key={item}
            lnglat={[landmark.location.longitude, landmark.location.latitude]}
            popup={() => <MarkerPopup {...landmark} />}
          />
        );
      })}
    </>
  );
}

function MarkerPopup(props: { description: string }) {
  return <div>{JSON.stringify(props, null, 2)}</div>;
}

function selector(state: ContextData) {
  return state?.selectedStopIds;
}
