import { compose } from "redux";

export interface IActionType<T, P> {
    type: T;
    payload: P;
}

export const composeEnhancers = !(typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? compose
    : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      });