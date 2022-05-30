import React from "react";
import { createPortal } from "react-dom";
import { ModalProps } from "../types";
import useModalContext from "../context/use-modal-context";

/**
 * Creates a portal to the ModalContainer. Children are the contents of the modal.
 */
export function Modal({
  children,
  containerId
}: React.PropsWithChildren<ModalProps>): React.ReactPortal {
  const { el, elCollection } = useModalContext();

  const nextPortal = containerId ? elCollection[containerId] : el;
  return nextPortal ? createPortal(children, nextPortal) : null;
}
