import { landmarks } from "../assets/landmarks.json";

export function getLandmark(id: number): Landmark {
  const landmark = landmarks.find(lmk => lmk.id === id);
  if (!isLandmark(landmark)) {
    return { ...getLandmark(landmark.ref), id: landmark.id };
  }

  return landmark;
}

function isLandmark(landmark: unknown): landmark is Landmark {
  // eslint-disable-next-line no-prototype-builtins
  return !landmark.hasOwnProperty("ref");
}

interface Landmark {
  description: string;
  displayName: string;
  features?: string[];
  id: number;
  location: { latitude: number; longitude: number };
}
