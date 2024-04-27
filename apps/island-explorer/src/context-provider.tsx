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
      deselectLandmark: id =>
        reshaper &&
        reshaper.dispatch({
          id: actionIds.ACTION_DESELECT_LANDMARK,
          payload: id
        }),
      selectLandmark: landmark =>
        reshaper &&
        reshaper.dispatch({
          id: actionIds.ACTION_SELECT_LANDMARK,
          payload: landmark
        }),
      setOption: (name, value) =>
        reshaper &&
        reshaper.dispatch({
          id: actionIds.ACTION_SET_OPTION,
          payload: { name, value }
        }),
      setRoute: routeId =>
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
