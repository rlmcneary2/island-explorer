import { Outlet } from "react-router-dom";

export function Layout() {
  // Application headers, footers, etc. go here.
  return (
    <div>
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}
