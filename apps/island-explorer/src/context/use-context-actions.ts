import { useContext, useMemo } from "react";
import { Context } from "./context";
import { ContextActions } from "./types";

export default function useContextActions(): ContextActions {
  const { setRoute } = useContext(Context);

  return useMemo(() => ({ setRoute }), [setRoute]);
}
