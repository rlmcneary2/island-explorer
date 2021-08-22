import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import ModalDialog from "./modal-dialog";
import { ModalDialogProps } from "../types";

/**
 * Display a dialog that can be animated using CSS class names.
 */
export default function AnimatedModalDialog({
  animateInTimeout,
  animateOutTimeout,
  beforeAnimateInClassName = "animate-before-in",
  beforeAnimateOutClassName = "animate-before-out",
  className,
  endAnimateInClassName = "animate-end-in",
  endAnimateOutClassName = "animate-end-out",
  hide = false,
  onClose,
  onExternalTap,
  onHidden,
  startAnimateInClassName = "animate-start-in",
  startAnimateOutClassName = "animate-start-out",
  ...props
}: React.PropsWithChildren<Props>) {
  const [animating, setAnimating] = useState<string>(beforeAnimateInClassName);
  const getAnimation = useRef<() => string>(null);
  const callbackFunc = useRef<() => void>(null);
  const timeoutHandle = useRef(0);
  const disposed = useRef(false);

  getAnimation.current = () => animating;

  // On mount and unmount.
  useEffect(() => {
    // Let all of the useEffects run once before changing the animation state.
    // If we don't wait then the className gets changed before the component has
    // finished completely rendering and the animation may not work correctly.
    setTimeout(() => {
      console.log(`AnimatedModalDialog: ${startAnimateInClassName}`);
      setAnimating(startAnimateInClassName);
    }, 0);

    return () => {
      disposed.current = true;
      if (getAnimation.current() !== endAnimateOutClassName) {
        console.log(
          "AnimatedModalDialog: dialog being removed during animation."
        );
      }
    };
  }, [endAnimateOutClassName, startAnimateInClassName]);

  // The `hide` prop has changed.
  useEffect(() => {
    if (!hide) {
      return;
    }

    if (
      animating === beforeAnimateOutClassName ||
      animating === startAnimateOutClassName ||
      animating === endAnimateOutClassName
    ) {
      return;
    }

    console.log("AnimatedModalDialog: hide=true");
    console.log(`AnimatedModalDialog: ${startAnimateOutClassName}`);
    setAnimating(beforeAnimateOutClassName);
  }, [
    animating,
    beforeAnimateOutClassName,
    endAnimateOutClassName,
    hide,
    startAnimateOutClassName
  ]);

  // endAnimateInClassName
  useEffect(() => {
    if (animating === endAnimateInClassName) {
      if (timeoutHandle.current) {
        console.log(
          `AnimatedModalDialog: clearing timeout for ${endAnimateInClassName}`
        );
        clearTimeout(timeoutHandle.current);
        timeoutHandle.current = 0;
      }
    }
  }, [animating, endAnimateInClassName]);

  // beforeAnimateOutClassName
  useEffect(() => {
    if (animating === beforeAnimateOutClassName) {
      console.log(`AnimatedModalDialog: ${startAnimateOutClassName}`);
      setAnimating(startAnimateOutClassName);
    }
  }, [animating, beforeAnimateOutClassName, startAnimateOutClassName]);

  //endAnimateOutClassName
  useEffect(() => {
    if (animating === endAnimateOutClassName) {
      if (timeoutHandle.current) {
        console.log(
          `AnimatedModalDialog: clearing timeout for ${endAnimateOutClassName}`
        );

        clearTimeout(timeoutHandle.current);
        timeoutHandle.current = 0;
      }

      console.log(
        "AnimatedModalDialog: out animation complete, invoking callback."
      );

      if (hide) {
        onHidden && onHidden();
      }

      callbackFunc.current && callbackFunc.current();
      callbackFunc.current = null;
    }
  }, [animating, endAnimateOutClassName, hide, onHidden]);

  // startAnimateInClassName & startAnimateOutClassName
  useEffect(() => {
    if (
      animating !== startAnimateInClassName &&
      animating !== startAnimateOutClassName
    ) {
      return;
    }

    if (timeoutHandle.current) {
      return;
    }

    if (
      animating === startAnimateInClassName &&
      !animateInTimeout &&
      animateInTimeout !== 0
    ) {
      return;
    }

    if (
      animating === startAnimateOutClassName &&
      !animateOutTimeout &&
      animateOutTimeout !== 0
    ) {
      return;
    }

    console.log("AnimatedModalDialog: starting timeout.");
    timeoutHandle.current = setTimeout(
      () => {
        console.log("AnimatedModalDialog: timeout.");
        if (disposed.current) {
          return;
        }

        if (animating === startAnimateInClassName) {
          console.log(`AnimatedModalDialog: ${endAnimateInClassName}.`);
          setAnimating(endAnimateInClassName);
        } else {
          console.log(`AnimatedModalDialog: ${endAnimateOutClassName}.`);
          setAnimating(endAnimateOutClassName);
        }
      },
      startAnimateInClassName ? animateInTimeout : animateOutTimeout
    );
  }, [
    animateInTimeout,
    animateOutTimeout,
    animating,
    endAnimateInClassName,
    endAnimateOutClassName,
    startAnimateInClassName,
    startAnimateOutClassName
  ]);

  const animationTransitionEnd = useMemo<
    (
      event:
        | React.AnimationEvent<HTMLDivElement>
        | React.TransitionEvent<HTMLDivElement>
    ) => void
  >(
    () => () => {
      console.log(`AnimatedModalDialog: animationTransitionEnd`);

      if (animating === startAnimateInClassName) {
        console.log(`AnimatedModalDialog: ${endAnimateInClassName}`);
        setAnimating(endAnimateInClassName);
      } else if (animating === startAnimateOutClassName) {
        console.log(`AnimatedModalDialog: ${endAnimateOutClassName}`);
        setAnimating(endAnimateOutClassName);
      }
    },
    [
      animating,
      endAnimateInClassName,
      endAnimateOutClassName,
      startAnimateInClassName,
      startAnimateOutClassName
    ]
  );

  const handleAnimationEnd = useCallback<
    React.AnimationEventHandler<HTMLDivElement>
  >(
    evt => {
      console.log(`AnimatedModalDialog: handleAnimationEnd`);
      animationTransitionEnd(evt);
    },
    [animationTransitionEnd]
  );

  const handleTransitionEnd = useCallback<
    React.TransitionEventHandler<HTMLDivElement>
  >(
    evt => {
      console.log(`AnimatedModalDialog: handleTransitionEnd`);
      animationTransitionEnd(evt);
    },
    [animationTransitionEnd]
  );

  const handleOnModalClose = useCallback<ModalDialogProps["onClose"]>(
    data => {
      callbackFunc.current = () => onClose(data);
      console.log(`AnimatedModalDialog[close]: ${beforeAnimateOutClassName}`);
      setAnimating(beforeAnimateOutClassName);
    },
    [beforeAnimateOutClassName, onClose]
  );

  const handleOnModalExternalTap = useCallback(() => {
    callbackFunc.current = () => onExternalTap();
    console.log(
      `AnimatedModalDialog[externalTap]: ${beforeAnimateOutClassName}`
    );
    setAnimating(beforeAnimateOutClassName);
  }, [beforeAnimateOutClassName, onExternalTap]);

  let dialogClassName = className;
  if (animating) {
    dialogClassName += `${dialogClassName && animating ? " " : ""}${
      animating ? animating : ""
    }`;
  }

  console.log(`AnimatedModalDialog: dialogClassName='${dialogClassName}'.`);

  return (
    <ModalDialog
      {...props}
      className={dialogClassName}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleTransitionEnd}
      onClose={handleOnModalClose}
      onExternalTap={onExternalTap ? handleOnModalExternalTap : null}
    />
  );
}

interface Props extends ModalDialogProps {
  /** Maximum time in milliseconds to wait for the animation end event. */
  animateInTimeout?: number;
  /** Maximum time in milliseconds to wait for the animation end event. */
  animateOutTimeout?: number;
  /** Initial class set before the 'in' animation starts. */
  beforeAnimateInClassName?: string;
  /** Initial class set before the 'out' animation starts. */
  beforeAnimateOutClassName?: string;
  /** Class to set when the 'in' animation has completed. */
  endAnimateInClassName?: string;
  /** Class to set when the 'out' animation has completed. */
  endAnimateOutClassName?: string;
  /** If set to `true` the dialog will begin the 'out' animation. */
  hide?: boolean;
  /** Invoked after 'out' animation started via the `hide` prop has completed. */
  onHidden?: () => void;
  /** Class to set that animates the 'in' phase of the dialog's appearance. */
  startAnimateInClassName?: string;
  /** Class to set that animates the 'out' phase of the dialog's removal. */
  startAnimateOutClassName?: string;
}
