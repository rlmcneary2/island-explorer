import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import messages from "./assets/messages-en-us.json";

ReactDOM.render(
  <BrowserRouter>
    <IntlProvider locale="en-US" messages={messages}>
      <ContextProvider>
        <Main />
      </ContextProvider>
    </IntlProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
