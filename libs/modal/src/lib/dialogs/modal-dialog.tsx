import React, { useEffect, useState } from "react";
import type { ContextValue } from "../context/context";
import { Modal } from "../modal/modal";
import { ModalDialogProps } from "../types";

/**
 * Creates a simple dialog (not animated).
 */
export default function ModalDialog({
  children,
  containerId,
  onExternalTap,
  ...props
}: React.PropsWithChildren<ModalDialogProps>) {
  const [el, setEl] = useState<ContextValue["el"]>();

  useEffect(() => {
    function handler(evt: MouseEvent) {
      evt.target === el && onExternalTap && onExternalTap();
    }

    el && el.addEventListener("click", handler);
    return () => {
      el && el.removeEventListener("click", handler);
    };
  }, [el, onExternalTap]);

  useEffect(() => () => setEl(undefined), []);

  return (
    <Modal containerId={containerId}>
      <div ref={ref => setEl(ref ?? undefined)} {...props}>
        {children}
      </div>
    </Modal>
  );
}
