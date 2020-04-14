import axios from 'axios';

import { IUser } from 'models';
import { IActionType } from 'utils/redux';
import { endpoint } from 'consts';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export interface IUsersState {
    list: IUser[];
}

export const initialState = {
    list: [] as IUser[],
};

export const fetchUsers = (): ThunkAction<Promise<void>, IUsersState, any, IActionType<string, IUser[]>> => async (
    dispatch: ThunkDispatch<IUsersState, any, IActionType<string, IUser[]>>,
) => {
    const res = await axios({ url: `${endpoint}/api/users`, method: 'GET', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
    const response = res && res.data;

    dispatch({ type: 'FETCH_USERS_STARTED', payload: [] as IUser[] });

    if (response.status === 200) {
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
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
