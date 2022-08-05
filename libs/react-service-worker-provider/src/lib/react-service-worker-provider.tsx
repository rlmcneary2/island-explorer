import React, { useEffect, useMemo, useRef, useState } from "react";
import { Context, ContextValue } from "./context";

export function ReactServiceWorkerProvider({
  children,
  filename,
  reloadOnSkipWaiting = false
}: React.PropsWithChildren<Props>) {
  const serviceWorkerRegistration = useRef<ServiceWorkerRegistration>();
  const [serviceWorker, setServiceWorker] = useState<ServiceWorker>();
  const [flag, setFlag] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [online, setOnline] = useState(window.navigator.onLine);

  // Listen for visibility changes and manually do an update to check for new
  // versions.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        serviceWorkerRegistration.current?.update();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Register the service worker file, get the ServiceWorkerRegistration, listen
  // for its events.
  useEffect(() => {
    function handleMessage(
      evt: MessageEvent<{ clientData: string; response: string }>
    ) {
      if (
        evt.data.clientData === "SKIP_WAITING" &&
        evt.data.response === "COMPLETED" &&
        reloadOnSkipWaiting
      ) {
        // Reload the page so the newly active SW becomes the owner.
        window.location.reload();
      } else {
        console.log(
          `ReactServiceWorkerProvider: message arrived from '${filename}'; evt=`,
          evt
        );
      }
    }

    function handleUpdateFound() {
      setFlag(current => current + 1);
    }

    let swr: ServiceWorkerRegistration;
    (async () => {
      navigator.serviceWorker.addEventListener("message", handleMessage);

      swr = await navigator.serviceWorker.register(filename);

      serviceWorkerRegistration.current = swr;

      swr.addEventListener("updatefound", handleUpdateFound);

      setFlag(current => current + 1);
    })();

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
      swr?.removeEventListener("updatefound", handleUpdateFound);
    };
  }, [filename, reloadOnSkipWaiting]);

  // Set the active SW.
  useEffect(() => {
    if (flag < 0) {
      return;
    }

    const swr = serviceWorkerRegistration.current;
    if (!swr || !swr.active) {
      return;
    }

    if (serviceWorker === swr.active) {
      return;
    }

    setServiceWorker(swr.active);
  }, [flag, serviceWorker]);

  // Connect to SW events.
  useEffect(() => {
    if (!serviceWorker) {
      return;
    }

    function handleStateChange(evt: Event) {
      setFlag(current => current + 1);
    }

    serviceWorker.addEventListener("statechange", handleStateChange);

    // It's possible that the user has reloaded the page and there is also an
    // update available. As the current SW is loading the one that is waiting
    // will be ignored. This timeout will force a check for an update then
    // change the flag causing a check for the status of a waiting SW.
    setTimeout(() => {
      serviceWorkerRegistration.current?.update().catch(err => {
        console.log(`ReactServiceWorkerProvider: update failed; err=`, err);
      });

      setTimeout(() => setFlag(current => current + 1), 30 * 1000);
    }, 5 * 1000);

    return () => {
      serviceWorker?.removeEventListener("statechange", handleStateChange);
    };
  }, [serviceWorker]);

  // Check to see if there is a new SW waiting.
  useEffect(() => {
    if (flag < 0) {
      return;
    }

    setWaiting(() =>
      serviceWorkerRegistration.current?.waiting &&
      serviceWorkerRegistration.current?.waiting.state === "installed"
        ? true
        : false
    );
  }, [flag]);

  // Listen for online offline events.
  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const value = useMemo<ContextValue>(
    () => ({
      skipWaiting: () => {
        serviceWorkerRegistration.current?.waiting?.postMessage("SKIP_WAITING");
      },
      waiting
    }),
    [waiting]
  );

  console.log(`ReactServiceWorkerProvider: online=${online}`);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

interface Props {
  /** The filename of the ServiceWorker file to load. */
  filename: string;
  /** If true the browser will reload when the skipWaiting function has
   * completed. */
  reloadOnSkipWaiting?: boolean;
}
