import { combineReducers } from 'redux';

import { IAuthState, authReducer, initialState as authInitialState } from './auth';
import { IUsersState, usersReducers, initialState as usersInitialState } from './users';
import { IVotesState, votesReducers, initialState as votesInitialState } from './votes';

// TODO fix this types
export interface IAppReduxState {
    auth: IAuthState;
    users: IUsersState;
    votes: IVotesState;
}

export const reducer = combineReducers<IAppReduxState>({
    auth: authReducer,
    users: usersReducers,
    votes: votesReducers,
});

export const initialState: IAppReduxState = {
    auth: authInitialState,
    users: usersInitialState,
    votes: votesInitialState,
};
