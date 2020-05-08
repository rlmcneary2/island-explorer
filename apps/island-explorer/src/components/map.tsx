import React from 'react';

export default function Map({ routeId }: Props) {
  return <div>{`Map route ${routeId || '?'}`}</div>;
}

type Props = {
  routeId?: string;
};
