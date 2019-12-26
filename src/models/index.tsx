export interface IUser {
    id?: string;
    username?: string;
    session?: string;
    isVoted?: boolean;
}

export interface IVote {
    id?: string;
    vote?: string;
}

export interface IVoteRs {
    votes?: Array<IVote[]>;
    length?: number;
}

export interface IOption {
    value?: string;
}
