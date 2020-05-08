import { useContext, useState, useEffect } from 'react';
import { Context } from './content-context';
import { ContentState } from './types';

export default function useContent<T>(
  selector?: (state: ContentState) => T
): T {
  const ctx = useContext(Context);
  const [state, setState] = useState<T>();

  useEffect(() => {
    const s = selector ? selector(ctx) : ctx;
    if (s !== state) {
      setState(s as any);
    }
  }, [ctx, selector, state]);

  return state;
}
