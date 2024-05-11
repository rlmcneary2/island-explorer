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
  const getAnimation = useRef<(() => string) | null>(null);
  const callbackFunc = useRef<(() => void) | null>(null);
  const timeoutHandle = useRef(0);
  const disposed = useRef(false);

  getAnimation.current = () => animating;

  // On mount and unmount.
  useEffect(() => {
    // Let all of the useEffects run once before changing the animation state.
    // If we don't wait then the className gets changed before the component has
    // finished completely rendering and the animation may not work correctly.
    setTimeout(() => {
      logMessage(`AnimatedModalDialog: ${startAnimateInClassName}`);
      setAnimating(startAnimateInClassName);
    }, 0);

    return () => {
      disposed.current = true;
      if (
        getAnimation.current &&
        getAnimation.current() !== endAnimateOutClassName
      ) {
        logMessage(
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

    logMessage("AnimatedModalDialog: hide=true");
    logMessage(`AnimatedModalDialog: ${startAnimateOutClassName}`);
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
        logMessage(
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
      logMessage(`AnimatedModalDialog: ${startAnimateOutClassName}`);
      setAnimating(startAnimateOutClassName);
    }
  }, [animating, beforeAnimateOutClassName, startAnimateOutClassName]);

  //endAnimateOutClassName
  useEffect(() => {
    if (animating === endAnimateOutClassName) {
      if (timeoutHandle.current) {
        logMessage(
          `AnimatedModalDialog: clearing timeout for ${endAnimateOutClassName}`
        );

        clearTimeout(timeoutHandle.current);
        timeoutHandle.current = 0;
      }

      logMessage(
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

    logMessage("AnimatedModalDialog: starting timeout.");
    timeoutHandle.current = window.setTimeout(
      () => {
        logMessage("AnimatedModalDialog: timeout.");
        if (disposed.current) {
          return;
        }

        if (animating === startAnimateInClassName) {
          logMessage(`AnimatedModalDialog: ${endAnimateInClassName}.`);
          setAnimating(endAnimateInClassName);
        } else {
          logMessage(`AnimatedModalDialog: ${endAnimateOutClassName}.`);
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
      logMessage(`AnimatedModalDialog: animationTransitionEnd`);

      if (animating === startAnimateInClassName) {
        logMessage(`AnimatedModalDialog: ${endAnimateInClassName}`);
        setAnimating(endAnimateInClassName);
      } else if (animating === startAnimateOutClassName) {
        logMessage(`AnimatedModalDialog: ${endAnimateOutClassName}`);
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
      logMessage(`AnimatedModalDialog: handleAnimationEnd`);
      animationTransitionEnd(evt);
    },
    [animationTransitionEnd]
  );

  const handleTransitionEnd = useCallback<
    React.TransitionEventHandler<HTMLDivElement>
  >(
    evt => {
      logMessage(`AnimatedModalDialog: handleTransitionEnd`);
      animationTransitionEnd(evt);
    },
    [animationTransitionEnd]
  );

  const handleOnModalClose = useCallback<Required<ModalDialogProps>["onClose"]>(
    data => {
      callbackFunc.current = () => onClose && onClose(data);
      logMessage(`AnimatedModalDialog[close]: ${beforeAnimateOutClassName}`);
      setAnimating(beforeAnimateOutClassName);
    },
    [beforeAnimateOutClassName, onClose]
  );

  const handleOnModalExternalTap = useCallback(() => {
    callbackFunc.current = () => onExternalTap && onExternalTap();
    logMessage(
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

  logMessage(`AnimatedModalDialog: dialogClassName='${dialogClassName}'.`);

  return (
    <ModalDialog
      {...props}
      className={dialogClassName}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleTransitionEnd}
      onClose={handleOnModalClose}
      onExternalTap={onExternalTap ? handleOnModalExternalTap : undefined}
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

function logMessage(...args: Parameters<typeof console.log>) {
  /* Uncomment if logging is needed. */
  // console.log(...args);
}
