import axios from 'axios';
import { endpoint } from 'consts';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export interface IActionType<T, P> {
    type: T;
    payload: P;
}

export interface ILoginState {
    username: string;
}

export const processLogin = (username: string): ThunkAction<Promise<void>, ILoginState, any, IActionType<string, string>> => async (
    dispatch: ThunkDispatch<ILoginState, any, IActionType<string, string>>,
) => {
    const response = await axios({
        url: `${endpoint}/api/login`,
        method: 'POST',
        data: { username },
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });

    if (response.status === 200) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: username } as IActionType<string, string>);
    } else {
        dispatch({ type: 'LOGIN_FAILED', payload: username } as IActionType<string, string>);
    }
};

const initialState = {
    username: '',
};

//TODO fix types
export const loginReducer = (state: ILoginState = initialState, action: IActionType<string, string>): ILoginState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            console.log({ ...state, username: action.payload });
            return { ...state, username: action.payload };
        default:
            return { ...state };
    }
};
