import { useEffect, useState } from "react";
import { Action, create, LoopAction, Reshaper } from "reshape-state";
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
      // .addOnChange(nextData => console.log("useReshaper: nextData=", nextData))
      .addOnChange(nextData => setData({ ...nextData }));

    setReshaper(nextReshaper);
  }, [reshaper]);

  useEffect(() => {
    reshaper?.setGetState(() => data);
  }, [data, reshaper]);

  useEffect(() => {
    if (reshaper) {
      setTimeout(() => {
        const action: LoopAction = { id: null };
        reshaper.dispatch(action as unknown as Action);
      }, 25);
    }
  }, [reshaper]);

  return { data, reshaper };
}
