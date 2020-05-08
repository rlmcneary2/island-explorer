import React, { createContext, useEffect, useState } from 'react';
import { ContentState } from './types';
import { create } from './content-reshaper';

const reshaper = create();
export const Context = createContext<ContentState>({});

export function ContentStateProvider({
  children
}: React.PropsWithChildren<{}>) {
  const [state, setState] = useState<ContentState>({});

  useEffect(() => {
    !state.routeId && reshaper.dispatch({ id: 'INIT_ROUTES' });
  });

  useEffect(() => {
    const handleChange = nextState => setState({ ...nextState });

    reshaper.addOnChange(handleChange);
    reshaper.setGetState(() => state);

    return () => reshaper.removeOnChange(handleChange);
  }, [state]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
