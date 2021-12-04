export type ContextState = ContextData & ContextActions;

export interface ContextData {
  /** The route ID that state data currently represents. This can be different
   * from the routeId URL parameter. */
  routeId?: number;
  routes?: AsyncActionData<Route[]>;
  routeStops?: AsyncActionData<Stop[]>;
  routeTrace?: AsyncActionData<Trace>;
  routeVehicles?: AsyncActionData<Vehicle[]>;
  selectedLandmarks?: SelectedLandmark[];
}

export interface ContextActions {
  deselectLandmark: (id: number) => void;
  selectLandmark: (landmark: SelectedLandmark) => void;
  setRoute: (routeId: number) => void;
}

interface AsyncActionData<T> {
  data?: T;
  error?: unknown;
  status: "active" | "idle";
}

/**
 * Route
 */
export interface Route {
  RouteId: number;
  RouteRecordId: number;
  ShortName: string;
  LongName: string;
  RouteAbbreviation: string;
  IvrDescription?: string;
  Color: string;
  TextColor: string;
  IsVisible: boolean;
  Group?: string;
  SortOrder: number;
  RouteTraceFilename: string;
  RouteTraceHash64?: string;
  IsHeadway: boolean;
  IncludeInGoogle: boolean;
  GoogleDescription?: string;
  Stops?: any;
  RouteStops?: any;
  Directions?: any;
  Vehicles: Vehicle[];
  Messages: unknown[];
}

export interface SelectedLandmark extends Record<string, unknown> {
  landmarkId: number;
}

/**
 * Stop
 */
export interface Stop {
  Description: string;
  IsTimePoint: boolean;
  Latitude: number;
  Longitude: number;
  Name: string;
  StopId: number;
  StopRecordId: number;
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
  VehicleId: number;
  Name: string;
  Latitude: number;
  Longitude: number;
  RouteId: number;
  TripId: number;
  RunId: number;
  Direction: "I" | "L" | "O";
  DirectionLong: "Inbound" | "Loop" | "Outbound";
  Destination: string;
  Speed: number;
  Heading: number;
  Deviation: number;
  OpStatus: "EARLY" | "LOGGED IN" | "ONTIME" | "TRIP START";
  CommStatus: "GOOD";
  GPSStatus: 2;
  DriverName: string;
  LastStop: string;
  OnBoard: number;
  LastUpdated: "/Date(1627821090000-0400)/";
  DisplayStatus: "On Time";
  BlockFareboxId: number;
}

export interface MapLayerCollectionItem {
  color: string;
  routeId: number;
  stops?: Stop[];
  trace?: Trace;
}
