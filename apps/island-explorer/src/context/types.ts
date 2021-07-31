export type ContextState = ContextData & ContextActions;

export interface ContextData {
  /** The route ID that state data currently represents. This can be different
   * from the routeId URL parameter. */
  routeId?: number;
  routes?: AsyncActionData<Route[]>;
  routeStops?: AsyncActionData<Stop[]>;
  routeTrace?: AsyncActionData<Trace>;
  routeVehicles?: AsyncActionData<Vehicle[]>;
}

export interface ContextActions {
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
interface Vehicle {}
