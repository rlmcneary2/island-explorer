import "../styles/styles.scss";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import { Spinner } from "./spinner/spinner";
import { Directions } from "./directions/directions";
import { ROUTE_TEMPLATE } from "../util/route";
import { UpdateAvailable } from "./toast/update-available/update-available";
import version from "../assets/version.json";

const BusRoute = lazy(() =>
  import(
    /* webpackChunkName: "busroute", webpackExports: "BusRoute" */ "./bus-route/bus-route"
  ).then(mod => ({ default: mod.BusRoute }))
);

export default function Main() {
  console.log(`Main: version=${version.version}, commit=${version.commit}.`);

  return (
    <main className="main">
      <Header />
      <div className="content">
        <Routes>
          <Route path={ROUTE_TEMPLATE}>
            <Suspense fallback={<Spinner />}>
              <BusRoute />
            </Suspense>
          </Route>
          <Route path="/directions">
            <Directions />
          </Route>
          {/* <Redirect to={getRoutePath(3, MAP)} /> */}
        </Routes>
      </div>
      <UpdateAvailable />
      <ModalContainer className="toast-container" containerId="toast" />
      <ModalContainer className="menu-container" containerId="menu" />
      <ModalContainer className="modal-container" />
    </main>
  );
}
