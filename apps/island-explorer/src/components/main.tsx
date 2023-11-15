import "../styles/styles.scss";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import { Spinner } from "./spinner/spinner";
import { Directions } from "./directions/directions";
import { getRoutePath } from "../util/route";
import { UpdateAvailable } from "./toast/update-available/update-available";
import { DIRECTIONS, MAP, ROUTE_TEMPLATE } from "../constants/routes";
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
          <Route
            element={
              <Suspense fallback={<Spinner />}>
                <BusRoute />
              </Suspense>
            }
            path={ROUTE_TEMPLATE}
          />
          <Route element={<Directions />} path={`/${DIRECTIONS}`} />
          <Route
            element={<Navigate replace to={getRoutePath(3, MAP)} />}
            path="*"
          />
        </Routes>
      </div>
      <UpdateAvailable />
      <ModalContainer className="toast-container" containerId="toast" />
      <ModalContainer className="menu-container" containerId="menu" />
      <ModalContainer className="modal-container" />
    </main>
  );
}
