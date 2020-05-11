import axios from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { endpoint } from 'shared/consts';
import { EProccessStatus } from 'shared/enums';
import { IUser } from 'shared/models';
import { IActionAsyncType, IAsyncData } from 'shared/utils/redux';

export interface IUsersState {
    list: IAsyncData<IUser[]>;
}

export const initialState = {
    list: { data: null, error: null, status: EProccessStatus.IDLE },
};

export const fetchUsers = (sessionId: string): ThunkAction<Promise<void>, IUsersState, any, IActionAsyncType<string, IUser[]>> => async (
    dispatch: ThunkDispatch<IUsersState, any, IActionAsyncType<string, IUser[]>>,
) => {
    try {
        dispatch({ type: 'FETCH_USERS_STARTED', payload: { data: null, error: null, status: EProccessStatus.PENDING } });

        const response = await axios({
            url: `${endpoint}/api/users`,
            method: 'GET',
            params: { sessionId },
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({ type: 'FETCH_USERS_SUCCESS', payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS } });
        }
    } catch (error) {
        if (error.response) {
            dispatch({ type: 'FETCH_USERS_FAILED', payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR } });
        } else {
            dispatch({ type: 'FETCH_USERS_FAILED', payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR } });
        }
    }
};

export const usersReducers = (state: IUsersState = initialState, action: IActionAsyncType<string, IUser[]>) => {
    switch (action.type) {
        case 'FETCH_USERS_STARTED':
        case 'FETCH_USERS_SUCCESS':
        case 'FETCH_USERS_FAILED':
            return { ...state, list: action.payload };
        default:
            return { ...state };
    }
};
