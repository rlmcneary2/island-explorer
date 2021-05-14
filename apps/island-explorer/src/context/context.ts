import React from "react";
import { ContextState } from "./types";

const Context = React.createContext<ContextState>({
  routeId: null,
  setRoute: null,
});

export { Context };
