import React from "react";

export function Message({ children, type }: React.PropsWithChildren<Props>) {
  return <div className={`message${type ? ` ${type}` : ""}`}>{children}</div>;
}

export interface Props {
  type?: "tip" | "warning";
}
