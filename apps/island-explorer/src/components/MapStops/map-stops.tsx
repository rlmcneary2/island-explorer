import { useMemo } from "react";
import { Anchor, LngLatLike, Point } from "mapbox-gl";
import { MapPopup, useMapGL } from "remapgl";
import { ContextData } from "../../context/types";
import useContextActions from "../../context/use-context-actions";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";
import { LandmarkDetails } from "../Landmark/landmark-details";

const FIRST_POI_LANDMARK_ID = 11000;

export function MapStops() {
  const { deselectLandmark } = useContextActions();
  const { landmarks, selectedLandmarks } = useContextState(selector);
  const { mapGL } = useMapGL();

  const landmarksData = landmarks?.data;
  const landmarksStatus = landmarks?.status;
  const landmarksError = !!landmarks?.error;

  const popups = useMemo(() => {
    if (
      !selectedLandmarks ||
      !selectedLandmarks.length ||
      landmarksStatus !== "idle" ||
      landmarksError
    ) {
      return null;
    }

    const container = mapGL.getContainer();

    // TODO: there are now popups for things other than stops. This code should
    // be moved into another component that is responsible for displaying the
    // popups.
    return (
      <>
        {selectedLandmarks.map(({ landmarkId }) => {
          const landmark = getLandmark(landmarkId, landmarksData ?? []);
          const lngLat: LngLatLike = [
            landmark.location.longitude,
            landmark.location.latitude
          ];
          const landmarkPoint = mapGL.project(lngLat);

          return (
            <MapPopup
              key={landmarkId}
              onClose={() => deselectLandmark(landmarkId)}
              options={{
                anchor: getAnchor(landmarkPoint, container),
                maxWidth: "none",
                offset: [0, FIRST_POI_LANDMARK_ID <= landmarkId ? -15 : 0] // This value should be different based on the anchor point...
              }}
              lngLat={lngLat}
            >
              <div className="popup">
                <LandmarkDetails {...landmark} />
              </div>
            </MapPopup>
          );
        })}
      </>
    );
  }, [
    deselectLandmark,
    landmarksData,
    landmarksError,
    landmarksStatus,
    mapGL,
    selectedLandmarks
  ]);

  return popups;
}

function selector(state: ContextData) {
  return {
    landmarks: state?.landmarks,
    selectedLandmarks: state?.selectedLandmarks
  };
}

function getAnchor(
  { x, y }: Point,
  {
    clientWidth,
    clientHeight
  }: {
    clientWidth: number;
    clientHeight: number;
  }
): Anchor {
  const bufLeft = 125;
  const bufRight = clientWidth - bufLeft;
  const bufTop = 300;
  const bufBottom = clientHeight - bufTop;

  const anchorX = x < bufLeft ? "left" : bufRight < x ? "right" : "";
  const anchorY = y < bufTop ? "top" : bufBottom < y ? "bottom" : "";

  return !anchorX && !anchorY
    ? "bottom"
    : (`${anchorY}${anchorX && anchorY ? "-" : ""}${anchorX}` as Anchor);
}
