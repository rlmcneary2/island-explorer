import React, { useEffect, useMemo, useRef, useState } from "react";
import { Context, ContextValue } from "./context";

export function ReactServiceWorkerProvider({
  children,
  filename
}: React.PropsWithChildren<Props>) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [stateChange, setStateChange] = useState<
    "installed" | "activating" | "activated" | null
  >(null);
  const timeoutId = useRef(0);
  const serviceWorker = useRef<ServiceWorker>();

  useEffect(() => {
    let reg: ServiceWorkerRegistration;

    function handleVisibilityChange() {
      console.log(
        `ReactServiceWorkerProvider: document visibility=${document.visibilityState}`
      );
      if (document.visibilityState === "visible") {
        console.log("ReactServiceWorkerProvider: registration update.");
        reg?.update();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    function handleStateChange(evt: Event) {
      // After "installed" the "activating" phase should happen. If that
      // doesn't happen and some other state hasn't happened. The user should
      // be prompted to install.
      const target = evt.target as ServiceWorker;
      console.log(
        `ReactServiceWorkerProvider: service-worker statechange; state='${target.state}'`
      );

      if (target.state === "installed") {
        serviceWorker.current = target;
        setStateChange("installed");
      } else if (target.state === "activating") {
        setStateChange("activating");
      } else if (target.state === "activated") {
        serviceWorker.current = target;
        setStateChange("activated");
      } else {
        setStateChange(null);
      }
    }

    let updatedReg: ServiceWorker;

    function handleUpdateFound() {
      console.log(
        "ReactServiceWorkerProvider: service-worker update available."
      );
      const updatedReg = reg?.installing ?? reg?.waiting ?? reg?.active;
      updatedReg?.addEventListener("statechange", handleStateChange);
    }

    (async () => {
      navigator.serviceWorker.addEventListener("message", evt =>
        console.log("ReactServiceWorkerProvider: message arrived.", evt)
      );

      reg = await navigator.serviceWorker.register(filename);
      reg.addEventListener("updatefound", handleUpdateFound);

      if (reg.waiting) {
        serviceWorker.current = reg.waiting;
        setUpdateAvailable(true);
        console.log(`ReactServiceWorkerProvider: workerWaiting=${reg.waiting}`);
      }
    })();

    return () => {
      updatedReg?.removeEventListener("statechange", handleStateChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reg?.removeEventListener("updatefound", handleUpdateFound);
    };
  }, [filename]);

  useEffect(() => {
    if (stateChange === "installed") {
      timeoutId.current = setTimeout(() => {
        setUpdateAvailable(true);
        setStateChange(null);
      }, 1000);
    } else if (stateChange === "activating") {
      timeoutId.current && clearTimeout(timeoutId.current);
      timeoutId.current = 0;
      setStateChange(null);
    } else if (stateChange === "activated") {
      timeoutId.current && clearTimeout(timeoutId.current);
      timeoutId.current = 0;
      setUpdateAvailable(false);
    }
  }, [stateChange]);

  const value = useMemo<ContextValue>(
    () => ({
      update: () => {
        serviceWorker.current?.postMessage("SKIP_WAITING");
      },
      updateAvailable
    }),
    [updateAvailable]
  );

  console.log("ReactServiceWorkerProvider: value=", value);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

interface Props {
  filename: string;
}
