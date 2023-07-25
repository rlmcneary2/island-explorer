import "../styles/styles.scss";
import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import { MAP } from "../constants/routes";
import { Directions } from "./directions/directions";
import { getRoutePath, ROUTE_TEMPLATE } from "../util/route";
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
        <Switch>
          <Route path={ROUTE_TEMPLATE}>
            <Suspense fallback={<p>Loading map...</p>}>
              <BusRoute />
            </Suspense>
          </Route>
          <Route path="/directions">
            <Directions />
          </Route>
          <Redirect to={getRoutePath(3, MAP)} />
        </Switch>
      </div>
      <UpdateAvailable />
      <ModalContainer className="toast-container" containerId="toast" />
      <ModalContainer className="menu-container" containerId="menu" />
      <ModalContainer className="modal-container" />
    </main>
  );
}
