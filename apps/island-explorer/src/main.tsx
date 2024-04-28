import "./styles/styles.scss";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from "react-router-dom";
import { App } from "./App";
import { BusRoute } from "./components/BusRoute/bus-route";
import { Directions } from "./components/Directions/directions";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route
        element={<BusRoute routeView="information" />}
        path="/route/:routeId/information"
      />
      <Route
        element={<BusRoute routeView="map" />}
        path="/route/:routeId/map"
      />
      <Route element={<Directions />} path="/directions" />
      <Route path="*" element={<Navigate to="/route/3/map" replace />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
