import { create as createReshaper } from 'reshape-state';
import { ContentState } from './types';
import { ROUTES_ROUTE_ID } from '../../constants/actions';

export function create() {
  return createReshaper<ContentState>().addHandlers([
    // No route ID.
    (state, action, dispatch) => {
      if (state.routeId) {
        return [state];
      }

      dispatch({ id: ROUTES_ROUTE_ID, payload: '1' });
      return [state];
    },

    // Route ID changed.
    (state, action, dispatch) => {
      if (action.id !== ROUTES_ROUTE_ID || state.routeId === action.payload) {
        return [state];
      }

      state.routeId = action.payload;
      return [state, true];
    },

    // Route changed.
    (state, action, dispatch) => {
      if (!state.routeId) {
        return [state];
      }

      if (state.routes && state.routes[state.routeId]) {
        return [state];
      }

      state.routes = state.routes || {};
      state.routes[state.routeId] = { name: `Route ${state.routeId}` };
      return [state, true];
    }
  ]);
}
