import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { ModalProvider } from "modal";
import Main from "./components/main";
import { ContextProvider } from "./context/context-provider";
import { ServiceWorkerProvider } from "service-worker-provider";
import messages from "./assets/messages-en-us.json";

const root = document.getElementById("root");
root &&
  createRoot(root).render(
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
    </ServiceWorkerProvider>
  );
