import React, { useCallback, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Modal } from "modal";
import { INFORMATION, MAP } from "../constants/routes";
import Information from "./information";

export default function Header() {
  const [modalText, setModalText] = useState<string>(null);
  const history = useHistory();
  const handleViewClick = useCallback(() => {
    setModalText(current => (current === null ? "MODAL!" : null));
  }, []);

  return (
    <div className="header">
      <button className="button primary">route</button>
      <button className="button" onClick={handleViewClick}>
        <FormattedMessage id="MENU" />
      </button>
      {modalText ? <Modal>{modalText}</Modal> : null}
    </div>
  );
}
