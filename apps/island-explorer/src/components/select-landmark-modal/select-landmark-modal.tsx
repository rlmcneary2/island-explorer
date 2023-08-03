import React, { useCallback, useMemo, useRef, useState } from "react";
import { distance } from "fastest-levenshtein";
import type { Landmark } from "../../types/types";
import { AnimatedModalDialog } from "modal";
import type { ModalDialogProps } from "modal";

export function SelectLandmarkModal({
  landmarks,
  message,
  onClose,
  onExternalTap,
  onLandmarkSelect
}: SelectLandmarkModalProps) {
  const [hide, setHide] = useState(false);
  const [filter, setFilter] = useState("");
  const callbackFunc = useRef<(() => void) | undefined>();

  const handleExternalTap = useCallback(() => {
    callbackFunc.current = onExternalTap;
    setHide(true);
  }, [onExternalTap]);

  const handleHidden = useCallback(
    () => callbackFunc.current && callbackFunc.current(),
    []
  );

  const filterLower = filter.toLowerCase();
  const filteredLandmarks = useMemo<Landmark[]>(() => {
    if (!filterLower) {
      return landmarks.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
    }

    return landmarks
      .map(l => {
        const displayNameLower = l.displayName.toLowerCase();
        const dn = displayNameLower.includes(filterLower)
          ? -1
          : distance(filterLower, displayNameLower);
        return { dn, landmark: l };
      })
      .filter(({ dn }) => dn <= 5)
      .sort((a, b) => a.dn - b.dn)
      .map(({ landmark }) => landmark);
  }, [filterLower, landmarks]);

  const handleDismissClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    callbackFunc.current = onClose;
    setHide(true);
  };

  const handleFilterChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value }
  }) => {
    setFilter(value);
  };

  const handleLandmarkClick: (landmark: Landmark) => void = landmark => {
    callbackFunc.current = () => onLandmarkSelect(landmark);
    setHide(true);
  };

  return (
    <AnimatedModalDialog
      className="modal"
      hide={hide}
      onExternalTap={handleExternalTap}
      onHidden={handleHidden}
    >
      <div className="content dialog">
        <div className="container">
          <p>{message}</p>
          <label>
            Filter:{" "}
            <input autoFocus onChange={handleFilterChange} value={filter} />
          </label>
          <ul className="list">
            {filteredLandmarks.map(l => (
              <li
                className="list-item"
                key={l.id}
                onClick={() => handleLandmarkClick(l)}
              >
                {l.displayName}
              </li>
            ))}
          </ul>
          <button className="button" onClick={handleDismissClick}>
            Close
          </button>
        </div>
      </div>
    </AnimatedModalDialog>
  );
}

export interface SelectLandmarkModalProps
  extends Pick<ModalDialogProps, "onClose" | "onExternalTap"> {
  landmarks: Landmark[];
  message: string;
  onLandmarkSelect: (landmark: Landmark) => void;
}
