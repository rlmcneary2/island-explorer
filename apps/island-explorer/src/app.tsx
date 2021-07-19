import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { RemapGL } from "remapgl";
import { ModalProvider } from "modal";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import messages from "./assets/messages-en-us.json";

navigator.serviceWorker
  .register("service-worker.js")
  .then(
    args => args.installing && postCacheMessageToServiceWorker(args.installing)
  )
  .catch(err => {
    console.log("Service worker failure. ", err);
  });

navigator.serviceWorker.ready.then(() => {
  navigator.serviceWorker.controller &&
    postCacheMessageToServiceWorker(navigator.serviceWorker.controller);
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

// Cache files that are provided through external 3rd party libraries and may
// change outside this application.
function postCacheMessageToServiceWorker(worker: ServiceWorker) {
  const message: { requests: (string | MessageRequest)[]; name: string } = {
    requests: [
      {
        headers: { accept: "text/css,*/*;q=0.1" },
        url: RemapGL.defaultMapboxGLCss
      }
    ],
    name: "cache"
  };

  worker.postMessage(message);
}

interface MessageRequest extends Pick<Request, "url"> {
  headers: Record<string, string>;
}
