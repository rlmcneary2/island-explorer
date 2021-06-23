import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { ModalProvider } from "modal";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import messages from "./assets/messages-en-us.json";

navigator.serviceWorker
  .register("service-worker.js")
  .then(args => {
    console.log("Service worker success. ", args);
  })
  .catch(err => {
    console.log("Service worker failure. ", err);
  });

ReactDOM.render(
  <BrowserRouter>
    <IntlProvider locale="en-US" messages={messages}>
      <ModalProvider>
        <ContextProvider>
          <Main />
        </ContextProvider>
      </ModalProvider>
    </IntlProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
