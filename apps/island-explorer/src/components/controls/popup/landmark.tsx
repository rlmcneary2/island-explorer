import { Popup } from "mapbox-gl";
import { Landmark } from "../../../types/types";

export function LandmarkPopup({ description, displayName, popupGL }: Props) {
  function handleClick() {
    popupGL.remove();
  }

  return (
    <div onClick={handleClick}>
      {displayName}
      <p>{description}</p>
    </div>
  );
}

interface Props extends Landmark {
  popupGL: Popup;
}
