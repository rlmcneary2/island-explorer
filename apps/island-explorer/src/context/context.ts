import React from "react";
import { ContextState } from "./types";

const Context = React.createContext<ContextState>({
  selectStop: () => {
    /* void */
  },
  setRoute: () => {
    /* void */
  }
});

export { Context };
