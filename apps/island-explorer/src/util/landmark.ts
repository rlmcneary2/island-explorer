import { Landmark, RoutesAssetItem } from "../types/types";

export const LANDMARK_PATH_TEMPLATE = "/landmark/:landmarkId";

export function getLandmark(id: number, landmarks: Landmark[]): Landmark {
  const landmark = landmarks.find(lmk => lmk.id === id);
  if ("ref" in landmark) {
    const refLandmark = getLandmark(landmark.ref, landmarks);
    return {
      ...refLandmark,
      id: landmark.id,
      stopName: landmark.stopName ?? refLandmark.stopName
    };
  }

  return landmark;
}

export function getLandmarkPath(id: number, landmarks: Landmark[]) {
  return LANDMARK_PATH_TEMPLATE.replace(":landmarkId", `${id}`);
}

export function getRouteOrderLandmarks(
  routeId: number,
  routes: RoutesAssetItem[],
  landmarks: Landmark[]
) {
  if (!routes || !landmarks) {
    return [];
  }

  const route = routes.find(({ id }) => id === routeId);
  if (!route) {
    return [];
  }

  return route.landmarks.map(id => getLandmark(id, landmarks));
}
