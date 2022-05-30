import { useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AnimatedModalDialog } from "modal";

export function ConnectionStatus({
  connected,
  messageId
}: {
  connected: boolean;
  messageId: string;
}) {
  const [hide, setHide] = useState(true);
  const handleHidden = useCallback(() => setHide(true), []);

  useEffect(() => {
    setHide(current => {
      if (!connected && current) {
        return false;
      }

      if (connected) {
        return true;
      }

      return current;
    });
  }, [connected]);

  return (
    ((!connected && !hide) || (connected && !hide)) && (
      <AnimatedModalDialog
        className="toast"
        containerId="toast"
        hide={hide}
        onHidden={handleHidden}
      >
        <div className="content">
          <FormattedMessage id={messageId} />
        </div>
      </AnimatedModalDialog>
    )
  );
}
