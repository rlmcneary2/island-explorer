import React from "react";

export default function Map({ routeId }: Props) {
  return <div className="map">{`Map route ${routeId || "?"}`}</div>;
}

type Props = {
  routeId?: string;
};
