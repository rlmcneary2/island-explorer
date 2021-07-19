import React from "react";

export default function Information({ routeId }: Props) {
  return (
    <div className="information">{`Information route ${routeId || "?"}`}</div>
  );
}

type Props = {
  routeId?: number;
};
