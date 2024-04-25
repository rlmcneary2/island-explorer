import { useContext } from "react";
import Context from "./context";

export default function useModalContext() {
  const ctx = useContext(Context);
  return ctx;
}
