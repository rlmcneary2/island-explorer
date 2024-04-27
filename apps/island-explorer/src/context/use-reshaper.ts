import { useEffect, useState } from "react";
import { create, Reshaper } from "reshape-state";
import { ContextData } from "./types";
import { create as createHandlers } from "./context-handlers";

export function useReshaper() {
  const [reshaper, setReshaper] = useState<Reshaper<ContextData> | null>(null);
  const [data, setData] = useState<ContextData>({});

  useEffect(() => {
    if (reshaper) {
      return;
    }

    const nextReshaper = create<ContextData>({ loopUntilSettled: true })
      .addHandlers(createHandlers())
      .addOnChange(nextData => console.log("useReshaper: nextData=", nextData))
      .addOnChange(nextData => setData({ ...nextData }));
    setReshaper(nextReshaper);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTimeout(() => nextReshaper.dispatch({ id: null } as any), 25);
  }, [reshaper]);

  useEffect(() => {
    reshaper?.setGetState(() => data);
  }, [data, reshaper]);

  return { data, reshaper };
}
