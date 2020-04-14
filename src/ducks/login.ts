import axios from 'axios';
import { endpoint } from 'consts';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { IActionType } from 'utils/redux';

export interface ILoginState {
    username: string;
}

export const initialState = {
    username: '',
};

export const processLogin = (username: string): ThunkAction<Promise<void>, ILoginState, any, IActionType<string, string>> => async (
    dispatch: ThunkDispatch<ILoginState, any, IActionType<string, string>>,
) => {
    const response = await axios({
        url: `${endpoint}/api/login`,
        method: 'POST',
        data: { username },
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });

    dispatch({ type: 'LOGIN_STARED', payload: '' });

    if (response.status === 200) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: username });
    } else {
        dispatch({ type: 'LOGIN_FAILED', payload: '' });
    }
};

//TODO fix types
export const loginReducer = (state: ILoginState = initialState, action: IActionType<string, string>): ILoginState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, username: action.payload };
        default:
            return { ...state };
    }
};
