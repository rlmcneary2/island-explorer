import React, { useMemo, useState } from "react";
import Context from "./context";

export function ModalProvider({ children }: React.PropsWithChildren<unknown>) {
  const [el, setEl] = useState<HTMLElement>(null);
  const [elCollection, setElCollection] = useState<Record<string, HTMLElement>>(
    {}
  );
  const actions = useMemo(() => {
    return {
      setEl: (input: HTMLElement | string, el?: HTMLElement) => {
        if (!input || typeof input !== "string") {
          setEl(input as HTMLElement);
        } else {
          setElCollection(current => {
            if (current[input] === el) {
              return current;
            }

            const nextCollection = { [input]: el };
            for (const [key, value] of Object.entries(current)) {
              if (key !== input) {
                nextCollection[key] = value;
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
