import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { ModalProvider } from "modal";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import { ServiceWorkerProvider } from "service-worker-provider";
import messages from "./assets/messages-en-us.json";

ReactDOM.render(
  <ServiceWorkerProvider url="service-worker.js" reloadOnSkipWaiting={true}>
    <BrowserRouter>
      <IntlProvider locale="en-US" messages={messages}>
        <ModalProvider>
          <ContextProvider>
            <Main />
          </ContextProvider>
        </ModalProvider>
      </IntlProvider>
    </BrowserRouter>
  </ServiceWorkerProvider>,
  document.getElementById("root")
);
