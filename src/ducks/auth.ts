import axios from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { endpoint } from 'shared/consts';
import { EProccessStatus } from 'shared/enums';
import { ISession, IUser } from 'shared/models';
import { IActionAsyncType, IAsyncData } from 'shared/utils/redux';
import { Dispatch } from 'redux';

export interface IAuthState {
    login: IAsyncData<string | any>;
    session: IAsyncData<ISession | any>;
}

export interface ILoginRq {
    username: string;
    sessionId: string;
}

export interface ISessionRq extends Partial<ISession> {}

export const initialState = {
    login: { data: null, error: null, status: EProccessStatus.IDLE },
    session: { data: null, error: null, status: EProccessStatus.IDLE },
};

export const createSession = (): ThunkAction<
    Promise<void>,
    IAuthState,
    any,
    IActionAsyncType<string, ISession>
> => async (dispatch: ThunkDispatch<IAuthState, any, IActionAsyncType<string, ISession>>) => {
    try {
        dispatch({
            type: 'CREATE_SESSION_STARTED',
            payload: { data: null, error: null, status: EProccessStatus.PENDING },
        });

        const response = await axios({
            url: `${endpoint}/api/session/add`,
            method: 'POST',
            data: {},
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({
                type: 'CREATE_SESSION_SUCCESS',
                payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS },
            });
        }
    } catch (error) {
        if (error.response) {
            dispatch({
                type: 'CREATE_SESSION_FAILED',
                payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR },
            });
        } else {
            dispatch({
                type: 'CREATE_SESSION_FAILED',
                payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR },
            });
        }
    }
};

export const updateSession = (
    sessionId: string,
    data: ISessionRq,
): ThunkAction<Promise<void>, IAuthState, any, IActionAsyncType<string, ISession>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionAsyncType<string, ISession>>,
) => {
    try {
        dispatch({
            type: 'UPDATE_SESSION_STARED',
            payload: { data: null, error: null, status: EProccessStatus.PENDING },
        });

        const response = await axios({
            url: `${endpoint}/api/session/${sessionId}`,
            method: 'PUT',
            data: data,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({
                type: 'UPDATE_SESSION_SUCCESS',
                payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS },
            });
        }
    } catch (error) {
        if (error.response) {
            dispatch({
                type: 'UPDATE_SESSION_FAILED',
                payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR },
            });
        } else {
            dispatch({
                type: 'UPDATE_SESSION_FAILED',
                payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR },
            });
        }
    }
};

export const resetSession = (
    sessionId: string,
): ThunkAction<Promise<void>, IAuthState, any, IActionAsyncType<string, ISession>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionAsyncType<string, ISession>>,
) => {
    try {
        dispatch({
            type: 'RESET_SESSION_STARTED',
            payload: { data: null, error: null, status: EProccessStatus.PENDING },
        });

        const response = await axios({
            url: `${endpoint}/api/session/${sessionId}/reset`,
            method: 'PUT',
            data: {},
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({
                type: 'RESET_SESSION_SUCCESS',
                payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS },
            });
        }
    } catch (error) {
        if (error.response) {
            dispatch({
                type: 'RESET_SESSION_FAILED',
                payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR },
            });
        } else {
            dispatch({
                type: 'RESET_SESSION_FAILED',
                payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR },
            });
        }
    }
};

export const fetchSession = (
    sessionId: string,
): ThunkAction<Promise<void>, IAuthState, any, IActionAsyncType<string, ISession>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionAsyncType<string, ISession>>,
) => {
    try {
        dispatch({
            type: 'FETCH_SESSION_STARTED',
            payload: { data: null, error: null, status: EProccessStatus.PENDING },
        });

        const response = await axios({
            url: `${endpoint}/api/session/${sessionId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({
                type: 'FETCH_SESSION_SUCCESS',
                payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS },
            });
        }
    } catch (error) {
        if (error.response) {
            dispatch({
                type: 'FETCH_SESSION_FAILED',
                payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR },
            });
        } else {
            dispatch({
                type: 'FETCH_SESSION_FAILED',
                payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR },
            });
        }
    }
};

export const cleanSessionBranch = () => (dispatch: Dispatch<IActionAsyncType<string, ISession>>) => {
    dispatch({ type: 'CLEAR_SESSION', payload: { data: null, error: null, status: EProccessStatus.IDLE } });
};

export const processLogin = (
    data: ILoginRq,
): ThunkAction<Promise<void>, IAuthState, any, IActionAsyncType<string, IUser>> => async (
    dispatch: ThunkDispatch<IAuthState, any, IActionAsyncType<string, IUser>>,
) => {
    try {
        dispatch({ type: 'LOGIN_STARTED', payload: { data: null, error: null, status: EProccessStatus.PENDING } });

        const response = await axios({
            url: `${endpoint}/api/auth/login`,
            method: 'POST',
            data: data,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS },
            });
        }
    } catch (error) {
        if (error.response) {
            dispatch({
                type: 'LOGIN_FAILED',
                payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR },
            });
        } else {
            dispatch({
                type: 'LOGIN_FAILED',
                payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR },
            });
        }
    }
};

export const cleanLoginBranch = () => (dispatch: Dispatch<IActionAsyncType<string, IUser>>) => {
    dispatch({ type: 'CLEAR_LOGIN', payload: { data: null, error: null, status: EProccessStatus.IDLE } });
};

export const authReducer = (
    state: IAuthState = initialState,
    action: IActionAsyncType<string, IUser | ISession>,
): IAuthState => {
    switch (action.type) {
        case 'CLEAR_LOGIN':
        case 'LOGIN_STARTED':
        case 'LOGIN_SUCCESS':
        case 'LOGIN_FAILED':
            return { ...state, login: action.payload };

        case 'CLEAR_SESSION':
        case 'CREATE_SESSION_STARTED':
        case 'CREATE_SESSION_SUCCESS':
        case 'CREATE_SESSION_FAILED':
            return { ...state, session: action.payload };

        case 'UPDATE_SESSION_STARTED':
        case 'UPDATE_SESSION_SUCCESS':
        case 'UPDATE_SESSION_FAILED':
            return { ...state, session: action.payload };

        case 'FETCH_SESSION_STARTED':
        case 'FETCH_SESSION_SUCCESS':
        case 'FETCH_SESSION_FAILED':
            return { ...state, session: action.payload };

        default:
            return { ...state };
    }
};
