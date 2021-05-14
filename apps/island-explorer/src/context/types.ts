export type ContextState = ContextData & ContextActions;

export interface ContextData {
  routeId?: string;
  routes?: AsyncActionData<Route[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextActions {
  setRoute: (routeId: string) => void;
}

interface AsyncActionData<T> {
  data?: T;
  error?: unknown;
  status: "active" | "idle";
}

interface Route {
  id: string;
}
