import { intersectionBy as _intersectionBy, uniqBy as _uniqBy } from "lodash";
import { useState } from "react";
import type { Landmark, RoutesAssetItem as Route } from "../../types/types";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";

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

  const bases = {};
  // findMatches(fromRoutes, toRoutes, {
  //   landmarks: landmarks?.data || [],
  //   routes: routes?.data || []
  // });
  findCourses(fromRoutes, toRoutes, {
    landmarks: landmarks?.data || [],
    routes: routes?.data || []
  });

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
      <p>Matches: {Object.keys(bases).join(" | ")}</p>
    </>
  );
}

function findMatches(
  aLandmark: number | string,
  bLandmark: number | string,
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): Course[] | undefined {
  const aData = findLandmarkAndRoutes(aLandmark, options);
  const bData = findLandmarkAndRoutes(bLandmark, options);

  if (!aData || !bData) {
    return;
  }

  if (
    aData?.routes.every(r => r.id === 8) ||
    bData?.routes.every(r => r.id === 8)
  ) {
    // One of these stops is only in schoodic and can't be connected.
    return;
  }

  const matches = _intersectionBy(aData.routes, bData.routes, "id");

  if (!matches.length) {
    const courses: Course[] = [];

    const stops = _uniqBy(
      options.landmarks.filter(l => l.id < 10000),
      "id"
    );
    stops.forEach(stop => {
      const stopData = findLandmarkAndRoutes(stop.id, options);
      if (!stopData) {
        return;
      }

      const aIntersect = _intersectionBy(stopData?.routes, aData.routes, "id");
      if (!aIntersect.length) {
        return;
      }

      const bIntersect = _intersectionBy(stopData?.routes, bData.routes, "id");
      if (bIntersect.length) {
        courses.push({
          landmark: aData.landmark,
          next: {
            landmark: stopData?.landmark,
            next: { landmark: bData.landmark },
            route: bIntersect[0]
          },
          route: aIntersect[0]
        });
      }
    });

    courses
      .sort((a, b) => a.route.displayName.localeCompare(b.route.displayName))
      .forEach(p => console.log(courseToString(p)));
  }

  matches.forEach(match => {
    console.log(
      `LMK=${aData.landmark.displayName} -> RTE=${match.displayName} -> LMK=${bData.landmark.displayName}`
    );
  });
}

// function findCourse(
//   source: Course | CourseStop,
//   destinationId: number,
//   options: {
//     landmarks: Landmark[];
//     routes: Route[];
//   }
// ): boolean {
//   let start: CourseStop = source;
//   while ("next" in start) {
//     start = (source as Course).next;
//   }

//   const startData = findLandmarkAndRoutes(start.landmark.id, options);
//   let found = false;
//   if (startData) {
//     for (const route of startData.routes) {
//       for (const stopId of route.landmarks.filter(l => l < 10000)) {
//         if (stopId === startData.landmark.id) {
//           continue;
//         }

//         if (stopId === destinationId) {
//           const next = findLandmarkAndRoutes(stopId, options);
//           if (next) {
//             found = true;
//             (start as Course).route = route;
//             (start as Course).next = next;
//           }
//         }
//       }
//     }
//   }

//   return found;
// }

function routeIncludesLandmark(
  landmark: number | string | Landmark,
  route: Route,
  keypath: string,
  options: { landmarks: Landmark[] },
  filterLandmarks: (landmarkIds: number[]) => number[] = ids =>
    ids.filter(id => id < 10000)
): { processed: string[]; route?: Route; stop?: Landmark } | undefined {
  const safeLandmark =
    typeof landmark === "object"
      ? landmark
      : getLandmark(landmark, options.landmarks);

  if (!safeLandmark || safeLandmark.id === -1) {
    return;
  }

  const processed: string[] = [];
  for (const routeStop of filterLandmarks(route.landmarks)) {
    const key = `${keypath ? `${keypath}:` : ""}${routeStop}`;
    if (processed.includes(key)) {
      continue;
    }

    processed.push(key);

    if (routeStop === safeLandmark.id) {
      return { processed, route, stop: safeLandmark };
    }
  }

  return { processed };
}

function routesWithLandmark(
  landmark: number | string | Landmark,
  routes: Route[],
  keypath: string,
  options: { landmarks: Landmark[] }
): { processed: string[]; routes?: Route[] } | undefined {
  let filtered: Route[] | undefined;
  const processed: string[] = [];
  for (const route of routes) {
    const include = routeIncludesLandmark(
      landmark,
      route,
      `${keypath ? `${keypath}.` : ""}${route.displayName}`,
      options
    );
    if (include && include.route) {
      filtered = filtered || [];
      filtered.push(route);
      processed.push(...include.processed);
    }
  }

  if (!filtered) {
    return;
  }

  return { processed, routes: _uniqBy(filtered, "id") };
}

function landmarksConnections(
  start: number | string | Landmark,
  end: number | string | Landmark,
  keypath: string,
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
): { processed: string[]; routes?: Route[] } | undefined {
  const startData = findLandmarkAndRoutes(start, options);
  if (!startData) {
    return;
  }

  return routesWithLandmark(
    end,
    startData.routes,
    `${keypath ? `${keypath}:` : ""}${startData.landmark.displayName}`,
    options
  );
}

function findCourses(
  start: number | string | Landmark,
  end: string,
  options: {
    landmarks: Landmark[];
    routes: Route[];
  }
) {
  if (!start || !end) {
    return;
  }

  const startData = findLandmarkAndRoutes(start, options);
  if (!startData) {
    return;
  }

  let result: Route[] | undefined;
  const connections = landmarksConnections(
    startData.landmark,
    end,
    "",
    options
  );

  if (connections?.routes) {
    result = result || [];
    result.push(...connections.routes);
  } else {
    for (const route of startData.routes) {
      for (const stopId of route.landmarks) {
        if (stopId === startData.landmark.id) {
          continue;
        }

        const connections2 = landmarksConnections(
          stopId,
          end,
          `${startData.landmark.displayName}.${route.displayName}`,
          options
        );
        if (connections2?.routes) {
          result = result || [];
          result.push(...connections2.routes);
        }
      }
    }
  }

  return result;
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

function courseToString(
  course: Course | CourseStop | undefined,
  base = ""
): string {
  if (!course) {
    return base + "!NO COURSE!";
  }

  let result = `${base}LMK=${course.landmark.displayName}`;

  if ("route" in course) {
    result += ` -> RTE=${course.route.displayName}`;
    result = courseToString(course.next, result + " -> ");
  }

  return result;
}

interface CourseStop {
  landmark: Landmark;
}

interface Course extends CourseStop {
  next: Course | CourseStop;
  route: Route;
}
