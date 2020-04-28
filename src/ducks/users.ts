import axios from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { endpoint } from 'shared/consts';
import { IUser } from 'shared/models';
import { IActionType } from 'shared/utils/redux';

export interface IUsersState {
    list: IUser[];
}

export const initialState = {
    list: [] as IUser[],
};

export const fetchUsers = (sessionId: string): ThunkAction<Promise<void>, IUsersState, any, IActionType<string, IUser[]>> => async (
    dispatch: ThunkDispatch<IUsersState, any, IActionType<string, IUser[]>>,
) => {
    const response = await axios({
        url: `${endpoint}/api/users`,
        method: 'GET',
        params: { sessionId },
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });

    dispatch({ type: 'FETCH_USERS_STARTED', payload: [] as IUser[] });

    if (response.status === 200) {
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data.data });
    } else {
        dispatch({ type: 'FETCH_USERS_FAILED', payload: [] as IUser[] });
    }
};

export const usersReducers = (state: IUsersState = initialState, action: IActionType<string, IUser[]>) => {
    switch (action.type) {
        case 'FETCH_USERS_SUCCESS':
            return { ...state, list: action.payload };
        default:
            return { ...state };
    }
};
