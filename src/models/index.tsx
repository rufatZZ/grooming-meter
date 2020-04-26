export interface IUser {
    _id?: string;
    username?: string;
    sessionId?: string;
    isVoted?: boolean;
}

export interface IVote {
    id?: string;
    vote?: string;
}

export interface IVotesInfo {
    votes: Array<IVote[]>;
    length: number;
    average: number;
}

export interface IOption {
    value?: string;
}