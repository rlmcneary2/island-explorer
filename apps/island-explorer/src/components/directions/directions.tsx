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

  const bases = {};
  findMatches(
    fromRoutes,
    toRoutes,
    {
      landmarks: landmarks?.data || [],
      routes: routes?.data || []
    },
    bases
  );

  // const courses = m?.map(m => courseToString(m));
  // const display = courses?.join(" | ");

  return (
    <>
      <form>
        <datalist id="locations">
          <option>Bar Harbor Village Green</option>
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
  a: number | string,
  b: number | string,
  options: {
    landmarks: Landmark[];
    routes: Route[];
  },
  bases: Record<string, Course> = {},
  baseKey?: string
): undefined {
  const aData = findLandmarkAndRoutes(a, options);
  const bData = findLandmarkAndRoutes(b, options);

  if (!aData || !bData) {
    return;
  }

  const matches = _intersectionBy(aData.routes, bData.routes, "id");

  if (!matches.length) {
    // const root: Partial<Course> = base ? {...base, next: }{ landmark: aData.landmark };

    // Iterate over each route
    // let nextResult: Course[] | undefined;
    aData.routes.forEach(route => {
      // Iterate over each stop in the route and find the stop's routes.
      route.landmarks
        .filter(l => l < 10000)
        .forEach(landmarkId => {
          // const nextLandMark = findLandmarkAndRoutes(landmarkId, options);
          const landmark = getLandmark(landmarkId, options.landmarks);
          if (!landmark) {
            return;
          }

          const nextBaseKey = `${baseKey ? " -> " : ""}LMK=${
            landmark.displayName
          }`;
          if (Object.keys(bases).includes(nextBaseKey)) {
            return;
          }

          const nextBases = { ...bases };

          findMatches(landmarkId, b, options, nextBases, nextBaseKey);

          // if (nextCourses) {
          //   nextCourses.forEach(nextCourse => {
          //     nextResult = nextResult || [];

          //     if (base) {
          //       const baseCopy: Course = { ...base, next: nextCourse };
          //       nextResult.push(baseCopy);
          //     } else {
          //       nextResult.push(nextCourse);
          //     }
          //   });
          // }
        });
    });
  }

  matches.forEach(match => {
    const key = `LMK=${aData.landmark.displayName} -> RTE=${match.displayName} -> LMK=${bData.landmark.displayName}`;
    bases[key] = {
      landmark: aData.landmark,
      route: match,
      next: { landmark: bData.landmark }
    };
  });
}

function findLandmarkAndRoutes(
  identifier: number | string,
  { landmarks, routes }: { landmarks: Landmark[]; routes: Route[] }
) {
  const landmark = getLandmark(identifier, landmarks);
  if (!landmark || landmark.id === -1) {
    return;
  }

  const landmarkRoutes = routes.filter(route =>
    route.landmarks.includes(landmark.id)
  );

  return { landmark, routes: landmarkRoutes };
}

function courseToString(
  course: Course | CourseTerminus | undefined,
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

interface CourseTerminus {
  landmark: Landmark;
}

interface Course extends CourseTerminus {
  next: Course | CourseTerminus;
  route: Route;
}
