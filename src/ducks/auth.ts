import axios from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { endpoint } from 'shared/consts';
import { ISession } from 'shared/models';
import { IActionType, IAsyncData } from 'shared/utils/redux';

export interface IAuthState {
    login: IAsyncData<string | any>;
    session: IAsyncData<ISession | any>;
}

export interface ILoginRq {
    username: string;
    sessionId: string;
}

export const initialState = {
    login: { data: null, error: null },
    session: { data: null, error: null },
};

export const createSession = (): ThunkAction<Promise<void>, IAuthState, any, IActionType<string, string>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>,
) => {
    try {
        const response = await axios({
            url: `${endpoint}/api/session/add`,
            method: 'POST',
            data: {},
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        dispatch({ type: 'CREATE_SESSION_STARED', payload: '' });

        if (response.status === 200) {
            dispatch({ type: 'CREATE_SESSION_SUCCESS', payload: response.data.data });
        }
    } catch (error) {
        dispatch({ type: 'CREATE_SESSION_FAILED', payload: error });
    }
};

export const processLogin = (data: ILoginRq): ThunkAction<Promise<void>, IAuthState, any, IActionType<string, string>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>,
) => {
    try {
        const response = await axios({
            url: `${endpoint}/api/auth/login`,
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
        case 'CREATE_SESSION_SUCCESS':
            return { ...state, session: { data: action.payload, error: null } };
        default:
            return { ...state };
    }
};
