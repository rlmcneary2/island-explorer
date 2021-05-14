import React, { useCallback } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { INFORMATION, MAP } from "../constants/routes";
import Information from "./information";

export default function Header() {
  const history = useHistory();
  const handleViewClick = useCallback(() => {
    const path = history.location.pathname
      .split("/")
      .map(x => {
        if (x === MAP) {
          return INFORMATION;
        } else if (x === INFORMATION) {
          return MAP;
        }
        return x;
      })
      .join("/");
    history.push(path);
  }, [history]);

  return (
    <div className="header">
      <button className="button primary">route</button>
      <button className="button" onClick={handleViewClick}>
        <FormattedMessage id="MENU" />
      </button>
    </div>
  );
}
