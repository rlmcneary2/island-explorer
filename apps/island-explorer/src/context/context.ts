import React from "react";
import { ContextState } from "./types";

const Context = React.createContext<ContextState>({
  selectLandmark: () => {
    /* void */
  },
  setRoute: () => {
    /* void */
  }
});

export { Context };
