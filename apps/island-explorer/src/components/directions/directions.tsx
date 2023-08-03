import { uniqBy as _uniqBy } from "lodash";
import React, { useMemo, useState } from "react";
import type { Landmark, RoutesAssetItem as Route } from "../../types/types";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";
import { SelectLandmarkModal } from "../select-landmark-modal/select-landmark-modal";

const MAX_ROUTES = 3;

export function Directions() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [show, setShow] = useState<"end" | "start" | undefined>();
  const { landmarks, routes } = useContextState(({ landmarks, routes }) => ({
    landmarks,
    routes
  }));

  const landmarkData = landmarks?.data;
  const routeData = routes?.data;

  const stops = useMemo(
    () =>
      filterToUniqueStops(landmarkData, {
        landmarks: landmarkData,
        routes: routeData
      }) || [],
    [landmarkData, routeData]
  );

  const directions = useMemo(() => {
    const results = findRoutes(start, end, {
      landmarks: landmarkData || [],
      routes: routeData || []
    });

    if (Array.isArray(results)) {
      results.sort((a, b) => {
        const matchA = a.match(/\./g);
        const matchB = b.match(/\./g);
        return (matchA?.length || 0) - (matchB?.length || 0);
      });
      console.log(results);
    }

    return results;
  }, [end, landmarkData, routeData, start]);

  if (!routes || !landmarks) {
    return null;
  }

  const handleLandmarkSelect = (
    context: "end" | "start",
    landmark: Landmark
  ) => {
    setShow(undefined);
    if (context === "start") {
      setStart(landmark.displayName);
    } else if (context === "end") {
      setEnd(landmark.displayName);
    }
  };

  const handleClearClick: React.MouseEventHandler = () => {
    setEnd("");
    setStart("");
  };

  const handleEndClick: React.MouseEventHandler = () => {
    setShow("end");
  };

  const handleStartClick: React.MouseEventHandler = () => {
    setShow("start");
  };

  return (
    <>
      <div>
        <button className="button" onClick={handleStartClick}>
          Start
        </button>
        <span>{start}</span>
        <button className="button" onClick={handleEndClick}>
          End
        </button>
        <span>{end}</span>
        <button className="button" onClick={handleClearClick}>
          Clear
        </button>
      </div>

      <p>
        {`Matches: ${
          directions &&
          (directions as string[]).slice(0, MAX_ROUTES).join(" | ")
        }`}
      </p>

      {show !== undefined ? (
        <SelectLandmarkModal
          landmarks={stops.filter(
            show === "start"
              ? item => item.displayName !== end
              : item => item.displayName !== start
          )}
          message={
            show === "start" ? "Select the start." : "Select the destination."
          }
          onClose={() => setShow(undefined)}
          onExternalTap={() => setShow(undefined)}
          onLandmarkSelect={l => handleLandmarkSelect(show, l)}
        />
      ) : null}
    </>
  );
}

function filterToUniqueStops(
  landmarks: Landmark[] | undefined,
  options: {
    landmarks?: Landmark[];
    routes?: Route[];
  }
): Landmark[] | undefined {
  if (!landmarks) {
    return;
  }

  const { landmarks: landmarksOpts, routes } = options;

  if (!landmarksOpts || !routes) {
    return;
  }

  return _uniqBy(
    landmarks
      .map(
        landmark =>
          findLandmarkAndRoutes(landmark.id, {
            landmarks: landmarksOpts,
            routes
          }) as {
            landmark: Landmark;
            routes: Route[];
          }
      )
      .filter(
        item =>
          item.landmark.id < 10000 &&
          item.routes.length &&
          !("refId" in item.landmark)
      )
      .map(item => item.landmark),
    "id"
  );
}

function findRoutes(
  startLandmark: string,
  endLandmark: string,
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): string[] | string | undefined {
  if (!startLandmark || !endLandmark) {
    return;
  }

  if (!options.landmarks || !options.routes) {
    return;
  }

  const startData = findLandmarkAndRoutes(startLandmark, options);
  if (!startData || !startData.routes.length) {
    return;
  }

  const endData = findLandmarkAndRoutes(endLandmark, options);
  if (!endData || !endData.routes.length) {
    return;
  }

  // TODO: if both stops are connected to schoodic then it's OK to process them normally.
  if (startData.routes.every(r => r.id === 8)) {
    return "SCHOODIC START";
  }

  if (endData.routes.every(r => r.id === 8)) {
    return "SCHOODIC END";
  }

  const end = getLandmark(endLandmark, options.landmarks);
  if (!endLandmark) {
    return;
  }

  const results: string[] = [];
  processRoutes(
    startData.landmark.displayName,
    end,
    startData.routes,
    results,
    options
  );

  return results;
}

function processRoutes(
  currentPath: string,
  endLandmark: Landmark,
  routes: Route[],
  paths: string[],
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): void {
  const currentRoutes = currentPath
    .split(".")
    .reduce<string[]>((acc, val, i) => {
      if (i % 2 !== 0) {
        return [...acc, val];
      }

      return acc;
    }, []);

  if (currentRoutes.length > MAX_ROUTES) {
    return;
  }

  for (const route of routes) {
    if (currentRoutes.includes(route.displayName)) {
      continue;
    }

    processRoute(currentPath, endLandmark, route, paths, options);
  }
}

function processRoute(
  currentPath: string,
  endLandmark: Landmark,
  route: Route,
  paths: string[],
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): void {
  const landmarks = route.landmarks.filter(l => l < 10000);

  processLandmarks(
    `${currentPath}.${route.displayName}`,
    endLandmark,
    landmarks,
    paths,
    options
  );
}

function processLandmarks(
  currentPath: string,
  endLandmark: Landmark,
  landmarkIds: number[],
  paths: string[],
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): void {
  // Translate ref landmarks to the actual landmark to eliminate dupes when
  // `uniqBy` is used.
  const landmarks = filterToUniqueStops(
    landmarkIds.map(id => getLandmark(id, options.landmarks)),
    options
  );

  if (!landmarks) {
    return;
  }

  for (const landmark of landmarks) {
    const result = processLandmark(
      currentPath,
      endLandmark,
      landmark,
      paths,
      options
    );

    if (result) {
      paths.push(result);
    }
  }
}

function processLandmark(
  currentPath: string,
  endLandmark: Landmark,
  landmark: Landmark,
  paths: string[],
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): string | undefined {
  const landmarkData = findLandmarkAndRoutes(landmark, options);
  if (!landmarkData) {
    return;
  }

  const currentLandmarks = currentPath.split(".").reduce((acc, val, i) => {
    if (i % 2 === 0) {
      return `${acc ? `${acc}.` : ""}${val}`;
    }

    return acc;
  }, "");

  if (currentLandmarks.includes(landmarkData.landmark.displayName)) {
    return;
  }

  const endData = findLandmarkAndRoutes(endLandmark, options);
  if (!endData) {
    return;
  }

  if (landmarkData.landmark.id === endData.landmark.id) {
    return `${currentPath}.${endData.landmark.displayName}`;
  }

  processRoutes(
    `${currentPath}.${landmarkData.landmark.displayName}`,
    endLandmark,
    landmarkData.routes,
    paths,
    options
  );
}

function findLandmarkAndRoutes(
  identifier: number | string | Landmark,
  { landmarks, routes }: { landmarks: Landmark[]; routes: Route[] }
) {
  const landmark =
    typeof identifier === "object"
      ? identifier
      : getLandmark(identifier, landmarks);
  if (!landmark || landmark.id === -1) {
    return;
  }

  const landmarkRoutes = routes.filter(route =>
    route.landmarks.includes(landmark.id)
  );

  return { landmark, routes: landmarkRoutes };
}

// interface Connection {
//   [routeName: string]: Node | undefined;
// }
// interface Node {
//   [stopName: string]: Connection | undefined;
// }
