import axios from 'axios';
import { endpoint } from 'consts';

export const login = async (username: string) => {
    const response = await axios({
        url: `${endpoint}/api/login`,
        method: 'POST',
        data: { username },
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });
    console.log(await JSON.stringify(response));
    return { type: 'LOGIN', payload: username };
};

interface IActionType<T, P> {
    type: T;
    payload: P;
}

const initialState = {
    username: '',
};

//TODO fix types
export const loginReducer = (state: { username: string } = initialState, action: IActionType<string, any>): { username: string } => {
    switch (action.type) {
        case 'LOGIN':
            console.log({ ...state, username: action.payload });
            return { ...state, username: action.payload };
        default:
            return { ...state };
    }
};
