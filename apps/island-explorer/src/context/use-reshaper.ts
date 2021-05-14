import { useEffect, useState } from "react";
import { create, Reshaper } from "reshape-state";
import { ContextData } from "./types";
import { create as createHandlers } from "./context-handlers";

export function useReshaper() {
  const [reshaper, setReshaper] = useState<Reshaper<ContextData>>(null);
  const [data, setData] = useState<ContextData>(null);

  useEffect(() => {
    if (reshaper) {
      return;
    }

    const nextReshaper = create<ContextData>({ loopUntilSettled: true })
      .addHandlers(createHandlers())
      .addOnChange(nextData => setData({ ...nextData }));
    setReshaper(nextReshaper);

    setTimeout(() => nextReshaper.dispatch({ id: null }), 25);
  }, [reshaper]);

  useEffect(() => {
    reshaper && reshaper.setGetState(() => data);
  }, [data, reshaper]);

  return { data, reshaper };
}
