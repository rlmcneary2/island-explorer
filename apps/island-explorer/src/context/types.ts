import type { Landmark, RoutesAssetItem } from "../types/types";
import { options } from "../constants/options";
export type ContextState = ContextData & ContextActions;

export interface ContextData {
  /** Asset landmarks.json data. Includes the data that will be used for stops. */
  landmarks?: AsyncActionData<Landmark[]>;
  options?: Record<OptionKeys, string>;
  /** The route ID that state data currently represents. This can be different
   * from the routeId URL parameter. */
  routeId?: number;
  routes?: AsyncActionData<RoutesAssetItem[]>;
  routeTrace?: AsyncActionData<Trace>;
  routeVehicles?: RouteVehiclesAsyncActionData<Vehicle[]> & {
    /** Time in milliseconds when the next vehicle update will occur. */
    nextUpdate?: number;
  };
  routeVehicleHeadings?: Record<Vehicle["VehicleId"], RouteVehicleHeading>;
  selectedLandmarks?: SelectedLandmark[];
}

export interface ContextActions {
  deselectLandmark: (id: number) => void;
  selectLandmark: (landmark: SelectedLandmark) => void;
  setOption: (name: string, value: string) => void;
  setRoute: (routeId: number) => void;
}

interface AsyncActionData<T> {
  data?: T;
  error?: unknown;
  status: "active" | "idle";
}

export type OptionKeys = keyof typeof options;

/**
 * Route
 */
export interface Route {
  RouteId: number;
  RouteRecordId?: number;
  ShortName: string;
  LongName: string;
  RouteAbbreviation?: string;
  IvrDescription?: string;
  Color: string;
  TextColor?: string;
  IsVisible?: boolean;
  Group?: string;
  SortOrder: number;
  RouteTraceFilename: string;
  RouteTraceHash64?: string;
  IsHeadway?: boolean;
  IncludeInGoogle?: boolean;
  GoogleDescription?: string;
  Stops?: unknown;
  RouteStops?: unknown;
  Directions?: unknown;
  Vehicles?: Vehicle[];
  Messages?: unknown[];
}

export interface RouteVehicleHeading {
  currentHeading?: Vehicle["Heading"];
  lastStop: Vehicle["LastStop"];
  previousHeadings: Vehicle["Heading"][];
}

export interface RouteVehiclesAsyncActionData<T>
  extends Omit<AsyncActionData<T>, "status"> {
  status: AsyncActionData<T>["status"] | "pending";
}

export interface SelectedLandmark extends Record<string, unknown> {
  landmarkId: number;
}

/**
 * Trace
 */
export interface Trace {
  features: TraceFeature[];
  type: "FeatureCollection";
}

interface FeatureGeometryLineString {
  coordinates: [lng: number, lat: number][];
  type: "LineString";
}

interface FeatureProperties {
  name: string;
  stroke: string;
  "stroke-opacity"?: number;
  "stroke-width"?: number;
  styleUrl?: string;
  styleHash?: string;
  styleMapHash?: {
    normal: string;
    highlight: string;
  };
}

interface TraceFeature {
  geometry: FeatureGeometryLineString;
  properties: FeatureProperties;
  type: "Feature";
}

/**
 * Vehicle
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Vehicle {
  CommStatus: "GOOD";
  Destination: string;
  Deviation: number;
  Direction: "I" | "L" | "O";
  DirectionLong: "Inbound" | "Loop" | "Outbound";
  DisplayStatus: "Late" | "On Time";
  DriverName: string;
  GPSStatus: 2;
  Heading: number;
  LastStop: string;
  LastUpdated: "/Date(1627821090000-0400)/";
  Latitude: number;
  Longitude: number;
  Name: string;
  OnBoard: number;
  OpStatus:
    | "DRIVER OFF"
    | "EARLY"
    | "LATE"
    | "LOGGED IN"
    | "ONTIME"
    | "TRIP START";
  RouteId: number;
  RunId: number;
  Speed: number;
  TripId: number;
  VehicleId: number;
  BlockFareboxId: number;
}

export interface MapLayerCollectionItem {
  color: string;
  pointsOfInterest: Landmark[];
  routeId: number;
  stops?: Landmark[];
  trace?: Trace;
  trailheads?: Landmark[];
}
