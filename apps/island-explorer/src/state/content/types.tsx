export type ContentState = {
  routeId?: string;
  routes?: { [routeId: string]: Route };
};

export type Route = {
  name: string;
};
