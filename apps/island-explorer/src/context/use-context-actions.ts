import { useContext, useMemo } from "react";
import { Context } from "./context";
import { ContextActions } from "./types";

export default function useContextActions(): ContextActions {
  const { setRoute, selectLandmark } = useContext(Context);

  return useMemo(
    () => ({ selectLandmark, setRoute }),
    [selectLandmark, setRoute]
  );
}
