import { Redirect, Route, Switch } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import { MAP } from "../constants/routes";
import { BusRoute } from "./bus-route";
import { getRoutePath, ROUTE_TEMPLATE } from "../util/route";
import { UpdateAvailable } from "./toast/update-available/update-available";
import version from "../assets/version.json";

export default function Main() {
  console.log(`Main: version=${version.version}, commit=${version.commit}.`);

  return (
    <main className="main">
      <Header />
      <div className="content">
        <Switch>
          <Route path={ROUTE_TEMPLATE}>
            <BusRoute />
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
