import { useEffect, useRef } from "react";
import useModalContext from "../context/use-modal-context";

export function ModalContainer(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
) {
  const ref = useRef(null);
  const { el, setEl } = useModalContext();

  useEffect(() => {
    if (ref.current) {
      if (el !== ref.current) {
        setEl(ref.current);
      }
    } else if (el !== null) {
      setEl(null);
    }
  }, [el, setEl]);

  return <div {...props} ref={ref}></div>;
}
