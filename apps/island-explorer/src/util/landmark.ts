import { Landmark, RoutesAssetItem } from "../types/types";

export const LANDMARK_PATH_TEMPLATE = "/landmark/:landmarkId";

export function getLandmark(id: number, landmarks?: Landmark[]): Landmark {
  const landmark = landmarks?.find(lmk => lmk.id === id);
  if (!landmark) {
    return {
      description: "",
      displayName: "",
      id,
      landmarkType: "point-of-interest",
      location: { latitude: 0, longitude: 0 }
    };
  }

  if ("refId" in landmark && (landmark.refId || landmark.refId === 0)) {
    const refLandmark = getLandmark(landmark.refId, landmarks);
    return {
      ...refLandmark,
      ...landmark
    };
  }

  return landmark;
}

export function getLandmarkPath(id: number, landmarks: Landmark[]) {
  return LANDMARK_PATH_TEMPLATE.replace(":landmarkId", `${id}`);
}

export function getRouteOrderLandmarks(
  routeId: number,
  routes?: RoutesAssetItem[],
  landmarks?: Landmark[]
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
