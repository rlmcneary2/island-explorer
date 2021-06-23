import React from "react";

export default React.createContext<{
  el: HTMLElement;
  setEl: (el: HTMLElement) => void;
}>({
  el: null,
  setEl: () => {
    /* noop */
  },
});
