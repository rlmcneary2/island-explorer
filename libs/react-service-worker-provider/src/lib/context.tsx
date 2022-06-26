import React from "react";

export const Context = React.createContext<ContextValue>({});

export interface ContextValue {
  update?: () => void;
  updateAvailable?: boolean;
}
