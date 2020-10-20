import { compose } from 'redux';

import { EProccessStatus } from 'shared/enums';

export interface IAsyncData<T> {
    data: T | null;
    error: any;
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

export const isError = (branch: IAsyncData<any>): boolean => branch.status === EProccessStatus.ERROR;
export const isInitial = (branch: IAsyncData<any>): boolean => branch.status === EProccessStatus.IDLE;
export const isPending = (branch: IAsyncData<any>): boolean => branch.status === EProccessStatus.PENDING;
export const isSuccess = (branch: IAsyncData<any>): boolean => branch.status === EProccessStatus.SUCCESS;

export const composeEnhancers = !(typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? compose
    : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      });
