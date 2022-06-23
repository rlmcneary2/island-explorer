import React from "react";

export default React.createContext<{
  el: HTMLElement;
  elCollection: Record<string, HTMLElement>;
  setEl: SetEl;
}>({
  el: null,
  elCollection: null,
  setEl: () => {
    /* noop */
  }
});

export interface SetEl {
  (el: HTMLElement): void;
  (key: string, el: HTMLElement): void;
}
