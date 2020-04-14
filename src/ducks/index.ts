import { combineReducers } from 'redux';

import { loginReducer } from 'ducks/login';
import { usersReducers } from 'ducks/users';

import { ILoginState, initialState as loginInitialState } from './login';
import { IUsersState, initialState as usersInitialState } from './users';

// TODO fix this types
export interface IAppReduxState {
    login: ILoginState;
    users: IUsersState;
}

export const reducer = combineReducers<IAppReduxState>({
    login: loginReducer,
    users: usersReducers
});

export const initialState: IAppReduxState = {
    login: loginInitialState,
    users: usersInitialState,
};
