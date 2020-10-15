import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import isEmpty from 'lodash/isEmpty';
import io from 'socket.io-client';

import { Timer } from 'components/Timer';
import { SessionSettings } from 'components/SessionSettings';
import { Users } from 'components/Users';
import { Voting } from 'components/Voting';
import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { fetchSession, resetSession, updateSession, IAuthState, ISessionRq } from 'ducks/auth';
import { fetchUsers, IUsersState } from 'ducks/users';
import { fetchVotes, IVotesState, IVoteRq, submitVote } from 'ducks/votes';
import { WithLoading } from 'shared/components/WithLoading';
import { endpoint } from 'shared/consts';
import { EProccessStatus } from 'shared/enums';
import { IUser, IVotesInfo, IVote, ISession } from 'shared/models';
import { IAsyncData, IActionAsyncType } from 'shared/utils/redux';

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

type TProps = IProps & RouteComponentProps<{}>;

const GroomingMeterComponent: React.FC<TProps> = props => {
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

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Grooming - Voting</title>
            </Helmet>
            <div className="d-flex full-window-height">
                <main className="content">
                    <WithLoading isLoading={sessionBranch.status === EProccessStatus.PENDING && sessionBranch.data === null}>
                        <div className="content-holder">
                            <div className="panel text-left">
                                {usersBranch.status === EProccessStatus.ERROR && (
                                    <div className="panel panel-error bg-danger" style={{ color: 'white' }}>
                                        Users - {!isEmpty(usersError) ? usersError.message : 'Unknown Error'}
                                    </div>
                                )}
                                {votesBranch.status === EProccessStatus.ERROR && (
                                    <div className="panel panel-error bg-danger" style={{ color: 'white' }}>
                                        Users - {!isEmpty(votesError) ? votesError.message : 'Unknown Error'}
                                    </div>
                                )}
                                {votesSubmitBranch.status === EProccessStatus.ERROR && (
                                    <div className="panel panel-error bg-danger" style={{ color: 'white' }}>
                                        Users - {!isEmpty(votesSubmitError) ? votesSubmitError.message : 'Unknown Error'}
                                    </div>
                                )}
                                {sessionBranch.status === EProccessStatus.ERROR && (
                                    <div className="panel panel-error bg-danger" style={{ color: 'white' }}>
                                        Session - {!isEmpty(sessionError) ? sessionError.message : 'Unknown Error'}
                                    </div>
                                )}
                            </div>
                            <Voting
                                options={options}
                                votesList={votesData || ({ votes: [] as IVote[], length: 0, average: 0 } as IVotesInfo)}
                                userVote={userVote}
                                handleVoting={handleVote}
                                isShowing={isShowing}
                                toggleShow={toggleShow}
                                handleReset={handleReset}
                                loading={votesBranch.status === EProccessStatus.PENDING}
                            />
                        </div>
                    </WithLoading>
                </main>
                <aside>
                    <div className="content-holder">
                        <Timer time={timeData} loading={sessionBranch.status === EProccessStatus.PENDING} />
                        <SessionSettings sessionInfo={sessionData || ({} as ISession)} />
                        <Users users={usersData || []} currentUser={username} loading={usersBranch.status === EProccessStatus.PENDING} />
                    </div>
                </aside>
            </div>
        </>
    );
};
export const GroomingMeter = withRouter<TProps, React.FC<TProps>>(
    connect<IStateProps, {}, {}, IAppReduxState>(
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
    )(GroomingMeterComponent),
);
