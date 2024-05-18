import React, { useEffect, useMemo } from "react";
import { ContextActions, ContextState } from "./types";
import { useReshaper } from "./use-reshaper";
import { useRouteId } from "./use-route-id";
import { Context } from "./context";
import { actionIds } from "./context-handlers";

export function ContextProvider({
  children
}: React.PropsWithChildren<unknown>) {
  const routeId = useRouteId();
  const { data, reshaper } = useReshaper();

  useEffect(() => {
    routeId &&
      reshaper &&
      reshaper.dispatch({
        id: actionIds.ACTION_ROUTE_CHANGED,
        payload: routeId
      });
  }, [reshaper, routeId]);

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
        })
    };
  }, [reshaper]);

  const value = useMemo<ContextState>(() => {
    return { ...data, ...actions };
  }, [actions, data]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
