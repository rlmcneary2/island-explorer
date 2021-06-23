export type ContextState = ContextData & ContextActions;

export interface ContextData {
  routes?: AsyncActionData<Route[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextActions {}

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
 * Vehicle
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Vehicle {}
