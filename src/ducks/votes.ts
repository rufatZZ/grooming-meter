import axios from 'axios';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { endpoint } from 'shared/consts';
import { EProccessStatus } from 'shared/enums';
import { IVotesInfo } from 'shared/models';
import { IActionAsyncType, IAsyncData } from 'shared/utils/redux';

export interface IVotesState {
    submit: IAsyncData<null>;
    list: IAsyncData<IVotesInfo>;
}

export interface IVoteRq {
    userId: string;
    sessionId: string;
    vote: string;
}

export const initialState = {
    submit: { data: null, error: null, status: EProccessStatus.IDLE },
    list: { data: null, error: null, status: EProccessStatus.IDLE },
};

export const fetchVotes = (sessionId: string): ThunkAction<Promise<void>, IVotesState, any, IActionAsyncType<string, IVotesInfo>> => async (
    dispatch: ThunkDispatch<IVotesState, any, IActionAsyncType<string, IVotesInfo>>,
) => {
    try {
        dispatch({ type: 'FETCH_VOTES_STARTED', payload: { data: null, error: null, status: EProccessStatus.PENDING } });

        const response = await axios({
            url: `${endpoint}/api/votes`,
            method: 'GET',
            params: { sessionId },
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({ type: 'FETCH_VOTES_SUCCESS', payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS } });
        }
    } catch (error) {
        if (error.response) {
            dispatch({ type: 'FETCH_VOTES_FAILED', payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR } });
        } else {
            dispatch({ type: 'FETCH_VOTES_FAILED', payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR } });
        }
    }
};

export const submitVote = (data: IVoteRq): ThunkAction<Promise<void>, IVotesState, any, IActionAsyncType<string, null>> => async (
    dispatch: ThunkDispatch<IVotesState, any, IActionAsyncType<string, null>>,
) => {
    try {
        dispatch({ type: 'SUBMIT_VOTE_STARTED', payload: { data: null, error: null, status: EProccessStatus.PENDING } });

        const response = await axios({
            url: `${endpoint}/api/votes/add`,
            method: 'PUT',
            data: data,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (response.status === 200) {
            dispatch({ type: 'SUBMIT_VOTE_SUCCESS', payload: { data: response.data.data, error: null, status: EProccessStatus.SUCCESS } });
        }
    } catch (error) {
        if (error.response) {
            dispatch({ type: 'SUBMIT_VOTE_FAILED', payload: { data: null, error: error.response.data.error, status: EProccessStatus.ERROR } });
        } else {
            dispatch({ type: 'SUBMIT_VOTE_FAILED', payload: { data: null, error: { message: 'Unknown error' }, status: EProccessStatus.ERROR } });
        }
    }
};

export const votesReducers = (state: IVotesState = initialState, action: IActionAsyncType<string, IVotesInfo> & IActionAsyncType<string, null>) => {
    switch (action.type) {
        case 'SUBMIT_VOTE_STARTED':
        case 'SUBMIT_VOTE_SUCCESS':
        case 'SUBMIT_VOTE_FAILED':
            return { ...state, submit: action.payload };

        case 'FETCH_VOTES_STARTED':
        case 'FETCH_VOTES_SUCCESS':
        case 'FETCH_VOTES_FAILED':
            return { ...state, list: action.payload };
        default:
            return { ...state };
    }
};
