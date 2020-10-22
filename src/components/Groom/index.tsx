import isEmpty from 'lodash/isEmpty';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import io from 'socket.io-client';

import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { fetchSession, resetSession, updateSession, IAuthState, ISessionRq } from 'ducks/auth';
import { fetchUsers, IUsersState } from 'ducks/users';
import { fetchVotes, IVotesState, IVoteRq, submitVote } from 'ducks/votes';
import { Loading } from 'shared/components/Loading';
import { endpoint } from 'shared/consts';
import { IUser, IVotesInfo, IVote, ISession } from 'shared/models';
import { IAsyncData, IActionAsyncType, isError, isPending } from 'shared/utils/redux';

import { SessionSettings } from './SessionSettings';
import { Timer } from './Timer';
import { Users } from './Users';
import { Voting } from './Voting';

import './index.scss';

let socket: any;

interface IStateProps {
    sessionBranch: IAsyncData<ISession>;
    usersBranch: IAsyncData<IUser[]>;
    votesBranch: IAsyncData<IVotesInfo>;
    votesSubmitBranch: IAsyncData<null>;
}

interface IDispatchProps {
    getSession: typeof fetchSession;
    getUsers: typeof fetchUsers;
    getVotes: typeof fetchVotes;
    updateSession: typeof updateSession;
    resetSession: typeof resetSession;
    addVote: typeof submitVote;
}

interface IProps extends IStateProps, IDispatchProps {}

const GroomingMeterComponent: React.FC<IProps> = props => {
    const {
        getSession,
        getUsers,
        getVotes,
        resetSession,
        updateSession,
        addVote,
        sessionBranch,
        usersBranch,
        votesBranch,
        votesSubmitBranch,
    } = props;
    const { data: sessionData, error: sessionError } = sessionBranch || ({} as IAsyncData<ISession>);
    const { data: usersData, error: usersError } = usersBranch || ({} as IAsyncData<IUser[]>);
    const { data: votesData, error: votesError } = votesBranch || ({} as IAsyncData<IVotesInfo>);
    const { error: votesSubmitError } = votesSubmitBranch || ({} as IAsyncData<null>);
    const { isVotesShowing: isShowing, updatedAt: timeData } = sessionData || ({} as ISession);
    const [userVote, setUserVote] = useState('');
    const { user } = useAuthContext();
    const { sessionId, username, _id: userId } = user || ({} as IUser);
    const initialVotesData = { votes: [] as IVote[], length: 0, average: 0 } as IVotesInfo;
    const hasError = isError(usersBranch) || isError(votesBranch) || isError(votesSubmitBranch) || isError(sessionBranch);

    // TODO make these from server
    const options: Array<any> = [
        { value: '1' },
        { value: '2' },
        { value: '3' },
        { value: '5' },
        { value: '8' },
        { value: '13' },
        { value: '20' },
        { value: '40' },
        { value: '100' },
        { value: '?' },
    ];

    useEffect(() => {
        socket = io(endpoint, {
            transports: ['websocket'],
            query: { sessionId, userId },
        });

        socket.emit('join', { username });

        socket.on('updateSession', async () => {
            sessionId && getSession(sessionId);
        });

        socket.on('updateUsersList', async () => {
            sessionId && getUsers(sessionId);
        });

        socket.on('updateVotesList', async () => {
            sessionId && getVotes(sessionId);
        });

        socket.on('toggleChanged', () => {
            //TODO disable hide/show buttons;
        });

        socket.on('sessionReset', () => {
            //TODO disable every action
            setUserVote('');
        });

        return () => socket.emit('leave');
    }, [username, userId, sessionId, getSession, getUsers, getVotes]);

    const handleVote = (vote: string) => {
        setUserVote(vote);
        userId && sessionId && addVote({ userId, sessionId, vote });
    };

    const toggleShow = () => {
        sessionId && updateSession(sessionId, { isVotesShowing: !isShowing });
    };

    const handleReset = () => {
        sessionId && resetSession(sessionId);
    };

    const renderError = () =>
        hasError && (
            <div className="panel text-left">
                {isError(usersBranch) && (
                    <div className="panel panel-error bg-danger">Users - {!isEmpty(usersError) ? usersError.message : 'Unknown Error'}</div>
                )}
                {isError(votesBranch) && (
                    <div className="panel panel-error bg-danger">Users - {!isEmpty(votesError) ? votesError.message : 'Unknown Error'}</div>
                )}
                {isError(votesSubmitBranch) && (
                    <div className="panel panel-error bg-danger">
                        Users - {!isEmpty(votesSubmitError) ? votesSubmitError.message : 'Unknown Error'}
                    </div>
                )}
                {isError(sessionBranch) && (
                    <div className="panel panel-error bg-danger">Session - {!isEmpty(sessionError) ? sessionError.message : 'Unknown Error'}</div>
                )}
            </div>
        );

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Grooming - Voting</title>
            </Helmet>

            <div className="d-flex groom-content">
                <div className="content">
                    <Loading isLoading={isPending(sessionBranch) && isEmpty(sessionData)}>
                        <div className="content-holder">
                            {renderError()}
                            <Voting
                                options={options}
                                votesList={votesData || initialVotesData}
                                userVote={userVote}
                                handleVoting={handleVote}
                                isShowing={isShowing}
                                toggleShow={toggleShow}
                                handleReset={handleReset}
                                loading={isPending(votesBranch)}
                            />
                        </div>
                    </Loading>
                </div>

                <aside className="content-holder">
                    <Timer time={timeData} loading={isPending(sessionBranch)} />
                    <SessionSettings />
                    <Users users={usersData || []} currentUser={username} loading={isPending(usersBranch)} />
                </aside>
            </div>
        </>
    );
};
export const GroomingMeter = connect<IStateProps, {}, {}, IAppReduxState>(
    (state: IAppReduxState): IStateProps => ({
        sessionBranch: state.auth.session,
        usersBranch: state.users.list,
        votesBranch: state.votes.list,
        votesSubmitBranch: state.votes.submit,
    }),
    (dispatch: ThunkDispatch<IUsersState & IVotesState & IAuthState, any, IActionAsyncType<string, IUser[] & IVote[] & ISession>>) => ({
        getSession: (sessionId: string) => dispatch(fetchSession(sessionId)),
        updateSession: (sessionId: string, data: ISessionRq) => dispatch(updateSession(sessionId, data)),
        resetSession: (sessionId: string) => dispatch(resetSession(sessionId)),
        getUsers: (sessionId: string) => dispatch(fetchUsers(sessionId)),
        getVotes: (sessionId: string) => dispatch(fetchVotes(sessionId)),
        addVote: (data: IVoteRq) => dispatch(submitVote(data)),
    }),
)(GroomingMeterComponent);
