import React, { useEffect, useState } from "react";
import { Modal } from "../modal/modal";
import { ModalDialogProps } from "../types";

export default function ModalDialog({
  children,
  onExternalTouch,
  ...props
}: React.PropsWithChildren<ModalDialogProps>) {
  const [el, setEl] = useState<HTMLDivElement>(null);

  useEffect(() => () => setEl(null), []);

  useEffect(() => {
    function handler(evt: MouseEvent) {
      evt.target === el && onExternalTouch && onExternalTouch();
    }

    el && el.addEventListener("click", handler);
    return () => el && el.removeEventListener("click", handler);
  }, [el, onExternalTouch]);

  return (
    <Modal>
      <div ref={ref => setEl(ref)} {...props}>
        {children}
      </div>
    </Modal>
  );
}
