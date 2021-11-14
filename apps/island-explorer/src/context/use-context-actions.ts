import { useContext, useMemo } from "react";
import { Context } from "./context";
import { ContextActions } from "./types";

export default function useContextActions(): ContextActions {
  const { setRoute, selectStop } = useContext(Context);

  return useMemo(() => ({ selectStop, setRoute }), [selectStop, setRoute]);
}
