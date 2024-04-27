import { AnimatedModalDialog } from "modal";
import { useState } from "react";
import { Landmark } from "../../../types/types";

export function LandmarkModal({ displayName, onClose }: Props) {
  const [hide, setHide] = useState(false);

  function handleExternalTap() {
    setHide(true);
  }

  function handleHidden() {
    onClose();
  }

  return (
    <AnimatedModalDialog
      className="modal"
      hide={hide}
      onExternalTap={handleExternalTap}
      onHidden={handleHidden}
    >
      <div className="content">
        <h1>{displayName}</h1>
      </div>
    </AnimatedModalDialog>
  );
}

interface Props extends Landmark {
  onClose: () => void;
}
