import { useContext, useMemo } from "react";
import { Context } from "./context";
import { ContextActions } from "./types";

export default function useContextActions(): ContextActions {
  const { deselectLandmark, selectLandmark, setOption } = useContext(Context);

  return useMemo(
    () => ({ deselectLandmark, selectLandmark, setOption }),
    [deselectLandmark, selectLandmark, setOption]
  );
}
