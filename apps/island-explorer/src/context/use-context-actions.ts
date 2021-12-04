import { useContext, useMemo } from "react";
import { Context } from "./context";
import { ContextActions } from "./types";

export default function useContextActions(): ContextActions {
  const { deselectLandmark, setRoute, selectLandmark } = useContext(Context);

  return useMemo(
    () => ({ deselectLandmark, selectLandmark, setRoute }),
    [deselectLandmark, selectLandmark, setRoute]
  );
}
