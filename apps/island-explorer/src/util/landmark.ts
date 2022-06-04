import { Landmark } from "../types/types";

export const LANDMARK_PATH_TEMPLATE = "/landmark/:landmarkId";

export function getLandmark(id: number, landmarks: Landmark[]): Landmark {
  const landmark = landmarks.find(lmk => lmk.id === id);
  if ("ref" in landmark) {
    return {
      ...getLandmark(landmark.ref, landmarks),
      id: landmark.id,
      ref: landmark.ref
    };
  }

  return landmark;
}

export function getLandmarkPath(id: number, landmarks: Landmark[]) {
  return LANDMARK_PATH_TEMPLATE.replace(":landmarkId", `${id}`);
}
