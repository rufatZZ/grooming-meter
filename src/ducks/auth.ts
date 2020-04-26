import axios from 'axios';
import { endpoint } from 'consts';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { IActionType, IAsyncData } from 'utils/redux';

export interface IAuthState {
    login: IAsyncData<string | any>;
}

export interface ILoginRq {
    username: string;
    session: string;
}

export const initialState = {
    login: { data: null, error: null },
};

export const processLogin = (data: ILoginRq): ThunkAction<Promise<void>, IAuthState, any, IActionType<string, string>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>,
) => {
    try {
        const response = await axios({
            url: `${endpoint}/api/login`,
            method: 'POST',
            data: data,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        dispatch({ type: 'LOGIN_STARED', payload: '' });

        if (response.status === 200) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
        }
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILED', payload: error });
    }
};

export const authReducer = (state: IAuthState = initialState, action: IActionType<string, string>): IAuthState => {
    switch (action.type) {
        case 'LOGIN_STARTED':
            return { ...state };
        case 'LOGIN_SUCCESS':
            return { ...state, login: { data: action.payload, error: null } };
        case 'LOGIN_FAILED':
            return { ...state, login: { data: null, error: action.payload } };
        default:
            return { ...state };
    }
};
