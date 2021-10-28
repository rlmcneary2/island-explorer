import React, { useEffect, useState } from "react";
import { Message, Props as MessageProps } from "./message";

export function MessageDismissible({
  children,
  id,
  type
}: React.PropsWithChildren<Props>) {
  const [dismissed, setDismissed] = useState(
    localStorage.getItem(id) === "dismissed"
  );

  useEffect(() => {
    if (dismissed) {
      localStorage.setItem(id, "dismissed");
      setDismissed(true);
    } else {
      localStorage.removeItem(id);
    }
  }, [dismissed, id]);

  if (dismissed) {
    return null;
  }

  return (
    <Message type={type}>
      {children}
      <button onClick={() => setDismissed(true)}>
        <i className="icon-dismiss" />
      </button>
    </Message>
  );
}

interface Props extends MessageProps {
  id: string;
}
