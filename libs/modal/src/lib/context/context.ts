import React from "react";

export default React.createContext<ContextValue>({
  elCollection: {},
  setEl: () => {
    /* noop */
  }
});

export interface ContextValue {
  el?: HTMLElement;
  elCollection?: Record<string, HTMLElement>;
  setEl: SetEl;
}

export interface SetEl {
  (el?: HTMLElement): void;
  (key: string, el?: HTMLElement): void;
}
