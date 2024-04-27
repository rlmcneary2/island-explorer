import { useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AnimatedModalDialog } from "modal";
import { useServiceWorker } from "service-worker-provider";

export function UpdateAvailable() {
  const { waiting = false, skipWaiting } = useServiceWorker(ctx => ctx) ?? {};
  const [hide, setHide] = useState(false);
  const [mount, setMount] = useState(false);
  const handleHidden = useCallback(() => setMount(false), []);

  useEffect(() => {
    if (waiting) {
      setMount(true);
      setHide(false);
    } else {
      setHide(true);
    }
  }, [waiting]);

  return mount ? (
    <AnimatedModalDialog
      className="toast"
      containerId="toast"
      hide={hide}
      onHidden={handleHidden}
    >
      <div className="content update">
        <FormattedMessage id={"UPDATE_AVAILABLE"} />
        <button
          className="button small narrow primary"
          onClick={() => skipWaiting && skipWaiting()}
        >
          <FormattedMessage id={"UPDATE_NOW"} />
        </button>
      </div>
    </AnimatedModalDialog>
  ) : null;
}
