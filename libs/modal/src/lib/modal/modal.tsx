import React from "react";
import { createPortal } from "react-dom";
import useModalContent from "../context/use-modal-context";

/**
 * Creates a portal to the ModalContainer. Children are the contents of the modal.
 */
export function Modal({
  children
}: React.PropsWithChildren<unknown>): React.ReactPortal {
  const { el } = useModalContent();
  return el ? createPortal(children, el) : null;
}
