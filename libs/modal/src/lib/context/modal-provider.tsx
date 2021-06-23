import React, { useMemo, useState } from "react";
import Context from "./context";

export function ModalProvider({ children }: React.PropsWithChildren<unknown>) {
  const [el, setEl] = useState<HTMLElement>(null);
  const actions = useMemo(() => {
    return {
      setEl: (el: HTMLElement) => setEl(el),
    };
  }, []);

  return (
    <Context.Provider value={{ el, ...actions }}>{children}</Context.Provider>
  );
}
