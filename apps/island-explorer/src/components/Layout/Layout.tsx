import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { UpdateAvailable } from "../Toast/update-available/update-available";
import { ModalContainer } from "modal";

export function Layout() {
  return (
    <main className="main">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <UpdateAvailable />
      <ModalContainer className="toast-container" containerId="toast" />
      <ModalContainer className="menu-container" containerId="menu" />
      <ModalContainer className="modal-container" />
    </main>
  );
}
