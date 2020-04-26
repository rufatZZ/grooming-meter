import axios from 'axios';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { endpoint } from 'consts';
import { IVotesInfo, IVote } from 'models';
import { IActionType } from 'utils/redux';

export interface IVotesState {
    list: IVotesInfo;
}

export interface IVoteRq {
    userId: string;
    sessionId: string;
    vote: string;
}

export const initialState = {
    list: { votes: [] as IVote[], length: 0, average: 0 } as IVotesInfo,
};

export const fetchVotes = (sessionId: string): ThunkAction<Promise<void>, IVotesState, any, IActionType<string, IVotesInfo>> => async (
    dispatch: ThunkDispatch<IVotesState, any, IActionType<string, IVotesInfo>>,
) => {
    const response = await axios({
        url: `${endpoint}/api/votes`,
        method: 'GET',
        params: { sessionId },
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });

    dispatch({ type: 'FETCH_VOTES_STARTED', payload: { votes: [] as IVote[], length: 0, average: 0 } as IVotesInfo });

    if (response.status === 200) {
        dispatch({ type: 'FETCH_VOTES_SUCCESS', payload: response.data.data });
    } else {
        dispatch({ type: 'FETCH_VOTES_FAILED', payload: { votes: [] as IVote[], length: 0, average: 0 } as IVotesInfo });
    }
};

export const addVote = (data: IVoteRq): ThunkAction<Promise<void>, IVotesState, any, IActionType<string, void>> => async (
    dispatch: ThunkDispatch<IVotesState, any, IActionType<string, void>>,
) => {
    const response = await axios({
        url: `${endpoint}/api/votes/add`,
        method: 'POST',
        data: data,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });

    dispatch({ type: '  ADD_VOTE_STARTED', payload: response.data.data });

    if (response.status === 200) {
        dispatch({ type: 'ADD_VOTES_SUCCESS', payload: response.data.data });
    } else {
        dispatch({ type: 'ADD_VOTES_FAILED', payload: response.data });
    }
};

export const votesReducers = (state: IVotesState = initialState, action: IActionType<string, IVotesInfo>) => {
    switch (action.type) {
        case 'FETCH_VOTES_SUCCESS':
            return { ...state, list: action.payload };
        default:
            return { ...state };
    }
};
