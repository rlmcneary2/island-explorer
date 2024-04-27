import { ServiceWorkerProvider } from "service-worker-provider";
import { Layout } from "./components/Layout/Layout";
import { IntlProvider } from "react-intl";
import { ModalProvider } from "modal";
import messages from "../assets/messages-en-us.json";

export function App() {
  // Providers go here
  return (
    <ServiceWorkerProvider url="service-worker.js" reloadOnSkipWaiting={true}>
      <IntlProvider locale="en-US" messages={messages}>
        <ModalProvider>
          {/* <ContextProvider>
            <Layout />
          </ContextProvider> */}
          <Layout />
        </ModalProvider>
      </IntlProvider>
    </ServiceWorkerProvider>
  );
}
