import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { RemapGL } from "remapgl";
import { ModalProvider } from "modal";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import messages from "./assets/messages-en-us.json";
import { postCacheMessageToServiceWorker } from "./util/service-worker";

const requests = [
  {
    headers: { accept: "text/css,*/*;q=0.1" },
    url: RemapGL.defaultMapboxGLCss
  }
];

navigator.serviceWorker
  .register("service-worker.js")
  .then(
    args =>
      args.installing &&
      postCacheMessageToServiceWorker(requests, args.installing)
  )
  .catch(err => {
    console.log("Service worker failure. ", err);
  });

postCacheMessageToServiceWorker(requests);

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
