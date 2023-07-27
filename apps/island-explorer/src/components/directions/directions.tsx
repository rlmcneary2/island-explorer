import { uniqBy as _uniqBy } from "lodash";
import { useState } from "react";
import type { Landmark, RoutesAssetItem as Route } from "../../types/types";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";

const MAX_ROUTES = 3;

export function Directions() {
  const [fromRoutes, setFromRoutes] = useState("");
  const [toRoutes, setToRoutes] = useState("");
  const { landmarks, routes } = useContextState(({ landmarks, routes }) => ({
    landmarks,
    routes
  }));

  if (!routes || !landmarks) {
    return null;
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    // const lmk = getLandmark(evt.target.value, landmarks?.data);
    // if (!lmk || lmk.id === -1) {
    //   return;
    // }

    // const stopsRoutes = routes.data?.filter(route =>
    //   route.landmarks.includes(lmk.id)
    // );

    if (evt.target.name === "from") {
      setFromRoutes(evt.target.value);
    } else if (evt.target.name === "to") {
      setToRoutes(evt.target.value);
    }
  };

  console.log("Directions");

  const results = findRoutes(fromRoutes, toRoutes, {
    landmarks: landmarks?.data || [],
    routes: routes?.data || []
  });

  if (Array.isArray(results)) {
    results.sort((a, b) => {
      const matchA = a.match(/\./g);
      const matchB = b.match(/\./g);
      return (matchA?.length || 0) - (matchB?.length || 0);
    });
    console.log(results);
  }

  return (
    <>
      <form>
        <datalist id="locations">
          <option>Bar Harbor Village Green</option>
          <option>Bernard</option>
          <option>Cadillac North Ridge</option>
          <option>Wildwood Stables</option>
        </datalist>

        <fieldset>
          <label>
            From
            <input name="from" list="locations" onChange={handleChange} />
          </label>
        </fieldset>

        <fieldset>
          <label>
            To
            <input name="to" list="locations" onChange={handleChange} />
          </label>
        </fieldset>
      </form>

      <p>From: {fromRoutes}</p>
      <p>To: {toRoutes}</p>
      <p>Matches: {results && (results as string[]).slice(0, 3).join(" | ")}</p>
    </>
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
  if (!startData) {
    return;
  }

  const endData = findLandmarkAndRoutes(endLandmark, options);
  if (!endData) {
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
  const landmarks = landmarkIds.map(id => getLandmark(id, options.landmarks));

  for (const landmark of _uniqBy(landmarks, "id")) {
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

interface Connection {
  [routeName: string]: Node | undefined;
}
interface Node {
  [stopName: string]: Connection | undefined;
}
