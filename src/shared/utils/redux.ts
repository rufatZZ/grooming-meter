import { compose } from "redux";

import { EProccessStatus } from "shared/enums";

export interface IAsyncData<T>{
    data: T | null,
    error: any
    status?: EProccessStatus;
}
export interface IActionAsyncType<T, P> {
    type: T;
    payload: IAsyncData<P>;
}
export interface IActionType<T, P> {
    type: T;
    payload: P;
}


export const composeEnhancers = !(typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? compose
    : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      });