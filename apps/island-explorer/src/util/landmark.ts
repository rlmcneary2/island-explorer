import { Landmark } from "../types/types";
import { landmarks } from "../assets/landmarks.json";

export const LANDMARK_PATH_TEMPLATE = "/landmark/:landmarkId";

export function getLandmark(id: number): Landmark {
  const landmark = landmarks.find(lmk => lmk.id === id);
  if (!isLandmark(landmark)) {
    return { ...getLandmark(landmark.ref), id: landmark.id };
  }

  return landmark;
}

export function getLandmarkPath(id: number) {
  return LANDMARK_PATH_TEMPLATE.replace(":landmarkId", `${id}`);
}

function isLandmark(landmark: unknown): landmark is Landmark {
  // eslint-disable-next-line no-prototype-builtins
  return !landmark.hasOwnProperty("ref");
}
