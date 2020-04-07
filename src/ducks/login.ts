import axios from 'axios';

export const login = (username: string) => {
    return { type: 'LOGIN', payload: username };
};

const initialState = {
    username: '',
};

//TODO fix types
export const loginReducer = (state: { username: string } = initialState, action: { type: string; payload: any }): { username: string } => {
    switch (action.type) {
        case 'LOGIN':
            console.log({ ...state, username: action.payload });
            return { ...state, username: action.payload };
        default:
            return { ...state };
    }
};