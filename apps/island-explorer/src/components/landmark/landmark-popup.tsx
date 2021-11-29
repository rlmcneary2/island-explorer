import { Popup as PopupGL } from "mapbox-gl";
import { Landmark } from "../../types/types";
import { LandmarkDetails } from "./landmark-details";

export function LandmarkPopup({ popupGL, ...landmark }: Props) {
  return (
    <div className="popup" onClick={() => popupGL.remove()}>
      <LandmarkDetails {...landmark} />
    </div>
  );
}

interface Props extends Landmark {
  popupGL: PopupGL;
}
