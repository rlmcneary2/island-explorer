import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ModalContainer } from "modal";
import Header from "./header";
import { MAP } from "../constants/routes";
import { BusRoute } from "./bus-route";

export default function Main() {
  return (
    <main className="main">
      <Header />
      <div className="content">
        <Switch>
          <Route path="/:routeId/:routePage">
            <BusRoute />
          </Route>
          <Redirect to={`/1/${MAP}`} />
        </Switch>
      </div>
      <ModalContainer className="modal-container" />
    </main>
  );
}
