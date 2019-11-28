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

export interface IOption {
    value?: string;
}
