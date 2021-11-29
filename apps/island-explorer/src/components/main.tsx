import { Redirect, Route, Switch } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import { MAP } from "../constants/routes";
import { BusRoute } from "./bus-route";
import { getRoutePath, ROUTE_TEMPLATE } from "../util/route";
import { LANDMARK_PATH_TEMPLATE } from "../util/landmark";

export default function Main() {
  return (
    <main className="main">
      <Header />
      <div className="content">
        <Switch>
          <Route path={LANDMARK_PATH_TEMPLATE}>LANDMARK</Route>
          <Route path={ROUTE_TEMPLATE}>
            <BusRoute />
          </Route>
          <Redirect to={getRoutePath(3, MAP)} />
        </Switch>
      </div>
      <ModalContainer className="modal-container" />
    </main>
  );
}
