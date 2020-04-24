import { combineReducers } from 'redux';

import { authReducer } from 'ducks/auth';
import { usersReducers } from 'ducks/users';

import { IAuthState, initialState as authInitialState } from './auth';
import { IUsersState, initialState as usersInitialState } from './users';

// TODO fix this types
export interface IAppReduxState {
    auth: IAuthState;
    users: IUsersState;
}

export const reducer = combineReducers<IAppReduxState>({
    auth: authReducer,
    users: usersReducers
});

export const initialState: IAppReduxState = {
    auth: authInitialState,
    users: usersInitialState,
};
