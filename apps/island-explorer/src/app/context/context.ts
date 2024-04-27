import React from "react";
import { ContextState } from "./types";

const Context = React.createContext<ContextState>({
  deselectLandmark: () => {
    /* noop */
  },
  selectLandmark: () => {
    /* noop */
  },
  setOption: () => {
    /* noop */
  },
  setRoute: () => {
    /* noop */
  }
});

export { Context };
