import { useContext, useMemo } from "react";
import { ContextData } from "./types";
import { Context } from "./context";

export default function useContextState<Slice>(
  selector: (ctx: ContextData) => Slice
) {
  const ctx = useContext(Context);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoSelector = useMemo(() => selector, [selector]);

  return useMemo(() => memoSelector(ctx), [ctx, memoSelector]);
}
