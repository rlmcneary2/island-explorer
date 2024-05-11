import _isEqual from "lodash-es/isEqual";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "./types";
import { Context } from "./context";

export default function useContextState<Slice>(
  selector: (ctx: ContextData) => Slice
) {
  const ctx = useContext(Context);
  const [selected, setSelected] = useState(selector(ctx));

  useEffect(() => {
    setSelected(current => {
      const next = selector(ctx);
      return _isEqual(current, next) ? current : next;
    });
  }, [ctx, selector]);

  return selected;
}
