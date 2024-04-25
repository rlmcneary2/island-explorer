import { useEffect, useRef } from "react";
import { ModalContainerProps } from "../types";
import useModalContext from "../context/use-modal-context";

/**
 * Set where modals should appear in the DOM.
 */
export function ModalContainer({ containerId, ...props }: ModalContainerProps) {
  const ref = useRef(null);
  const { el, elCollection, setEl } = useModalContext();

  useEffect(() => {
    if (ref.current) {
      const portalEl =
        containerId && elCollection ? elCollection[containerId] : el;
      if (portalEl !== ref.current) {
        containerId ? setEl(containerId, ref.current) : setEl(ref.current);
      }
    } else if (el !== null) {
      containerId ? setEl(containerId) : setEl();
    }
  }, [el, elCollection, containerId, setEl]);

  return <div {...props} ref={ref}></div>;
}
