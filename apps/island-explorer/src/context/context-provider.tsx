import React, { useMemo } from "react";
import { ContextActions, ContextState } from "./types";
import { useReshaper } from "./use-reshaper";
import { Context } from "./context";
import { actionIds } from "./context-handlers";

export function ContextProvider({
  children
}: React.PropsWithChildren<unknown>) {
  const { data, reshaper } = useReshaper();

  const actions = useMemo<ContextActions>(() => {
    return {
      setRoute: (routeId: number) =>
        reshaper &&
        reshaper.dispatch({
          id: actionIds.ACTION_ROUTE_CHANGED,
          payload: routeId
        })
    };
  }, [reshaper]);

  const value = useMemo<ContextState>(() => {
    return { ...data, ...actions };
  }, [actions, data]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
