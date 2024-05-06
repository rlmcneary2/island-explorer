import _uniqBy from "lodash-es/uniqBy";
import React, { useMemo, useState } from "react";
import type { Location } from "react-router";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { IntlFormatters } from "react-intl";
import { FormattedMessage, useIntl } from "react-intl";
import Icon from "../../images/icon-bus.svg?react";
import type { Landmark, RoutesAssetItem as Route } from "../../types/types";
import useContextState from "../../context/use-context-state";
import { getLandmark } from "../../util/landmark";
import { SelectLandmarkModal } from "../SelectLandmarkModal/select-landmark-modal";
import routes from "../../data/routes";

const MAX_ROUTES = 3;
const SCHOODIC_ROUTE_ID = 8;

export function Directions() {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState<"end" | "start" | undefined>();
  const { landmarks } = useContextState(({ landmarks }) => ({
    landmarks
  }));

  const landmarkData = landmarks?.data;

  const stops = useMemo(
    () =>
      filterToUniqueStops(landmarkData, {
        landmarks: landmarkData,
        routes
      }) || [],
    [landmarkData]
  );

  const params = new URLSearchParams(location.search);
  const start = params.get("from") || "";
  const end = params.get("to") || "";

  const directions = useMemo(() => {
    const results = findRoutes(start, end, {
      landmarks: landmarkData || [],
      routes
    });

    if (Array.isArray(results)) {
      results.sort((a, b) => {
        const matchA = a.match(/\./g);
        const matchB = b.match(/\./g);
        return (matchA?.length || 0) - (matchB?.length || 0);
      });

      return results ? results.slice(0, 3) : results;
    }
  }, [end, landmarkData, start]);

  if (!landmarkData) {
    return null;
  }

  const handleLandmarkSelect = (
    context: "end" | "start",
    landmark: Landmark
  ) => {
    setShow(undefined);
    if (context === "start") {
      const params = new URLSearchParams();
      params.set("from", landmark.displayName);
      navigate(cloneLocation(location, params), { replace: true });
    } else if (context === "end") {
      const params = new URLSearchParams();
      params.set("to", landmark.displayName);
      navigate(cloneLocation(location, params), { replace: true });
    }
  };

  const handleClearClick: React.MouseEventHandler = () => {
    const loc = cloneLocation(location);
    const params = new URLSearchParams(loc.search);
    params.delete("from");
    params.delete("to");
    loc.search = params.toString();
    navigate(loc);
  };

  const handleEndClick: React.MouseEventHandler = () => {
    setShow("end");
  };

  const handleStartClick: React.MouseEventHandler = () => {
    setShow("start");
  };

  return (
    <div className="directions">
      <p>
        <FormattedMessage id="DIRECTIONS_INSTRUCTIONS" />
      </p>
      <div className="select-landmark">
        <button className="button small fit" onClick={handleStartClick}>
          <FormattedMessage id="DIRECTIONS_START" />
        </button>
        <span>{start}</span>
      </div>
      <div className="select-landmark">
        <button className="button small fit" onClick={handleEndClick}>
          <FormattedMessage id="DIRECTIONS_END" />
        </button>
        <span>{end}</span>
      </div>
      <div className="reset">
        <button className="button small fit" onClick={handleClearClick}>
          <FormattedMessage id="DIRECTIONS_CLEAR" />
        </button>
      </div>

      {directions
        ? directions.map((d, i) =>
            pathToComponents(d, i, directions.length, {
              formatMessage,
              landmarks: landmarkData,
              routes
            })
          )
        : null}

      {show !== undefined ? (
        <SelectLandmarkModal
          landmarks={
            filterWithSelection(stops, show === "start" ? end : start, {
              landmarks: landmarkData,
              routes
            }) || []
          }
          message={formatMessage(
            { id: "DIRECTIONS_SELECT_LANDMARK" },
            {
              terminus: formatMessage({
                id: show === "start" ? "DIRECTIONS_START" : "DIRECTIONS_END"
              })
            }
          )}
          onClose={() => setShow(undefined)}
          onExternalTap={() => setShow(undefined)}
          onLandmarkSelect={l => handleLandmarkSelect(show, l)}
        />
      ) : null}
    </div>
  );
}

function cloneLocation(location: Location, search?: URLSearchParams): Location {
  const nextSearch = new URLSearchParams(location.search);

  search?.forEach((val, key) => nextSearch.set(key, val));

  return {
    ...location,
    search: nextSearch.toString()
  };
}

function filterWithSelection(
  landmarks: Landmark[],
  selectedName: Landmark["displayName"],
  options: {
    landmarks?: Landmark[];
    routes?: Route[];
  }
) {
  if (!selectedName) {
    return landmarks;
  }

  const { landmarks: allLandmarks, routes } = options;
  if (!allLandmarks || !routes) {
    return;
  }

  const selectedData = findLandmarkAndRoutes(selectedName, {
    landmarks: allLandmarks,
    routes
  });

  if (selectedData?.routes.every(r => r.id === SCHOODIC_ROUTE_ID)) {
    // Only allow Schoodic stops.
    return landmarks.filter(l => {
      const found = findLandmarkAndRoutes(l.id, {
        landmarks: allLandmarks,
        routes
      });

      return (
        selectedData.landmark.id !== found?.landmark.id &&
        found?.routes.every(item => item.id === SCHOODIC_ROUTE_ID)
      );
    });
  }

  return landmarks.filter(l => {
    const found = findLandmarkAndRoutes(l.id, {
      landmarks: allLandmarks,
      routes
    });

    return (
      l.id !== selectedData?.landmark.id &&
      found?.routes.every(r => r.id !== SCHOODIC_ROUTE_ID)
    );
  });
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

function pathToComponents(
  path: string,
  pathIndex: number,
  pathCount: number,
  options: {
    formatMessage: IntlFormatters["formatMessage"];
    landmarks: Landmark[];
    routes: Route[];
  }
): JSX.Element | null {
  if (!path?.length) {
    return null;
  }

  const parts = path.split(".");
  if (parts.length < 3) {
    return null;
  }

  const components: JSX.Element[] = [];

  let index = 0;
  let lastConnection: string | undefined;
  while (index < parts.length) {
    const stop = parts[index];
    const connection = index + 1 < parts.length ? parts[index + 1] : undefined;
    lastConnection = connection || lastConnection;

    const stopMessage =
      index === 0
        ? "DIRECTIONS_ROUTE_START"
        : index + 1 === parts.length
        ? "DIRECTIONS_ROUTE_END"
        : "DIRECTIONS_ROUTE_CHANGE_AT";

    const routeColor = `#${
      // eslint-disable-next-line no-loop-func
      options.routes.find(r => r.displayName === lastConnection)?.color
    }`;

    const stopComponent = (
      <div
        className="route-item stop"
        key={`stop=${stop}`}
        style={
          {
            "--route-color": routeColor
          } as React.CSSProperties
        }
      >
        <span>
          <FormattedMessage
            id={stopMessage}
            values={{
              b: ((chunk: string) => (
                <b>{chunk}</b>
              )) as unknown as React.ReactNode,
              stop
            }}
          />
        </span>
      </div>
    );
    components.push(stopComponent);

    if (connection) {
      const routeId = options.routes.find(
        r => r.displayName === connection
      )?.id;

      const message = options.formatMessage(
        { id: "DIRECTIONS_ROUTE_TAKE" },
        {
          connection,
          id: routeId || "?"
        }
      );

      const messageParts = message.split(connection);

      const connectionComponent = (
        <div
          className="route-item connection"
          key={`connection-${connection}`}
          style={
            {
              "--route-color": routeColor
            } as React.CSSProperties
          }
        >
          <Icon />
          <span>
            {messageParts[0]}
            <Link to={`/route/${routeId}/map`}>{`${connection}`}</Link>
            {messageParts[1]}
          </span>
        </div>
      );
      components.push(connectionComponent);
    }

    index += 2;
  }

  return (
    <div className="route" key={path}>
      {1 < pathCount ? (
        <span>
          <b>
            <FormattedMessage
              id="DIRECTIONS_OPTION"
              values={{ number: pathIndex + 1 }}
            />
          </b>
        </span>
      ) : null}
      {components}
    </div>
  );
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

// interface Connection {
//   [routeName: string]: Node | undefined;
// }
// interface Node {
//   [stopName: string]: Connection | undefined;
// }
