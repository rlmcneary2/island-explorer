import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import { App } from "./app/App";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<div>Map</div>} path="/route/:routeId/map" />
      <Route
        element={<div>Information</div>}
        path="/route/:routeId/Information"
      />
      <Route element={<div>Directions</div>} path="/directions" />
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
