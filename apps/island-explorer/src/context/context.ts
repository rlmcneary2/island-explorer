import React from "react";
import { ContextState } from "./types";

const Context = React.createContext<ContextState>({
  deselectLandmark: () => {
    /* void */
  },
  selectLandmark: () => {
    /* void */
  },
  setRoute: () => {
    /* void */
  }
});

export { Context };
