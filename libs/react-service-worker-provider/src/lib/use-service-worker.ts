import { isEqual as _isEqual } from "lodash";
import { useContext, useEffect, useState } from "react";
import { Context, ContextValue } from "./context";

export function useServiceWorker<T>(selector?: (value: ContextValue) => T) {
  const ctx = useContext(Context);
  const [selected, setSelected] = useState<T>();

  useEffect(() => {
    setSelected(current => {
      const next = selector ? selector(ctx) : ctx;
      if (next !== current && !_isEqual(current, next)) {
        return next as T;
      }

      return current as T;
    });
  }, [ctx, selector]);

  return selected;
}
