import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { ModalProvider } from "modal";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import { ReactServiceWorkerProvider } from "react-service-worker-provider";
import messages from "./assets/messages-en-us.json";

ReactDOM.render(
  <ReactServiceWorkerProvider filename="service-worker.js">
    <BrowserRouter>
      <IntlProvider locale="en-US" messages={messages}>
        <ModalProvider>
          <ContextProvider>
            <Main />
          </ContextProvider>
        </ModalProvider>
      </IntlProvider>
    </BrowserRouter>
  </ReactServiceWorkerProvider>,
  document.getElementById("root")
);
