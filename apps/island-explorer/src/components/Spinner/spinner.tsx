import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Icon from "../../images/icon-bus.svg?react";

export function Spinner({ message }: SpinnerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(id);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="spinner">
      <div className="loading">
        <Icon />
      </div>
      {message ? (
        <span className="loading-message">
          <FormattedMessage id={message} />
        </span>
      ) : null}
    </div>
  );
}

interface SpinnerProps {
  message?: string;
}
