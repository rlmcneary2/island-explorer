import React, { useMemo, useState } from "react";
import type { ContextValue } from "./context";
import Context from "./context";

export function ModalProvider({ children }: React.PropsWithChildren<unknown>) {
  const [el, setEl] = useState<ContextValue["el"]>();
  const [elCollection, setElCollection] =
    useState<ContextValue["elCollection"]>();
  const actions = useMemo(() => {
    return {
      setEl: (elOrKey?: HTMLElement | string, el?: HTMLElement) => {
        if (!elOrKey || typeof elOrKey !== "string") {
          setEl(elOrKey as HTMLElement);
        } else {
          setElCollection(current => {
            if (current && current[elOrKey] === el) {
              return current;
            }

            const nextCollection: Record<string, HTMLElement> = el
              ? { [elOrKey]: el }
              : {};

            if (current) {
              for (const [key, value] of Object.entries(current)) {
                if (key !== elOrKey) {
                  nextCollection[key] = value;
                } else {
                  if (el) {
                    nextCollection[elOrKey] = el;
                  }
                }
              }
            }

            return nextCollection;
          });
        }
      }
    };
  }, []);

  return (
    <Context.Provider value={{ el, elCollection, ...actions }}>
      {children}
    </Context.Provider>
  );
}
