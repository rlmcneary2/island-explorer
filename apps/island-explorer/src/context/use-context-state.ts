import { isEqual as _isEqual } from "lodash";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "./types";
import { Context } from "./context";

export function useContextState<Slice>(selector: (ctx: ContextData) => Slice) {
  const ctx = useContext(Context);
  const [slice, setSlice] = useState<Slice>(null);

  useEffect(() => {
    if (!ctx || !selector) {
      return;
    }

    const nextSlice = selector(ctx);
    if (Array.isArray(nextSlice) || typeof nextSlice === "object") {
      setSlice(current =>
        !_isEqual(nextSlice, current) ? nextSlice : current
      );
    } else {
      setSlice(nextSlice);
    }
  }, [ctx, selector]);

  return slice;
}
