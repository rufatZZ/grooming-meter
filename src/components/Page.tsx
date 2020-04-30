import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import io from 'socket.io-client';

import { Timer } from 'components/Timer';
import { Users } from 'components/Users';
import { Voting } from 'components/Voting';
import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { fetchSession, resetSession, updateSession, IAuthState, ISessionRq } from 'ducks/auth';
import { fetchUsers, IUsersState } from 'ducks/users';
import { fetchVotes, IVotesState, IVoteRq, addVote } from 'ducks/votes';
import { endpoint } from 'shared/consts';
import { IUser, IVotesInfo, IVote, ISession } from 'shared/models';
import { IActionType, IAsyncData } from 'shared/utils/redux';

let socket: any;

interface IStateProps {
    sessionBranch: IAsyncData<ISession>;
    usersList: IUser[];
    votesList: IVotesInfo;
}

interface IDispatchProps {
    getSession: typeof fetchSession;
    getUsers: typeof fetchUsers;
    getVotes: typeof fetchVotes;
    updateSession: typeof updateSession;
    resetSession: typeof resetSession;
    submitVote: typeof addVote;
}

interface IProps extends IStateProps, IDispatchProps {}

type TProps = IProps & RouteComponentProps<{}>;

const GroomingMeterComponent: React.FC<TProps> = props => {
    const { getSession, getUsers, getVotes, resetSession, updateSession, submitVote, sessionBranch, usersList, votesList } = props;
    const { data: sessionData } = sessionBranch || ({} as IAsyncData<ISession>);
    const { isVotesShowing: isShowing, updatedAt: timer } = sessionData || ({} as ISession);
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
    }, [username, userId, sessionId, getUsers, getVotes]);

    useEffect(() => {
        if (sessionData) {
        }
    }, [sessionData]);

    const handleVote = (vote: string) => {
        setUserVote(vote);
        userId && sessionId && submitVote({ userId, sessionId, vote });
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
            <main className="content">
                <Voting
                    options={options}
                    votesList={votesList}
                    userVote={userVote}
                    handleVoting={handleVote}
                    isShowing={isShowing}
                    toggleShow={toggleShow}
                    handleReset={handleReset}
                />
            </main>
            <aside>
                <div className="content-holder">
                    <Timer time={timer} />
                    <Users users={usersList} currentUser={username} />
                </div>
            </aside>
        </>
    );
};
export const GroomingMeter = withRouter<TProps, React.FC<TProps>>(
    connect<IStateProps, {}, {}, IAppReduxState>(
        (state: IAppReduxState): IStateProps => ({
            sessionBranch: state.auth.session,
            usersList: state.users.list,
            votesList: state.votes.list,
        }),
        (dispatch: ThunkDispatch<IUsersState & IVotesState & IAuthState, any, IActionType<string, IUser[] & IVote[] & IAsyncData<ISession>>>) => ({
            getSession: (sessionId: string) => dispatch(fetchSession(sessionId)),
            updateSession: (sessionId: string, data: ISessionRq) => dispatch(updateSession(sessionId, data)),
            resetSession: (sessionId: string) => dispatch(resetSession(sessionId)),
            getUsers: (sessionId: string) => dispatch(fetchUsers(sessionId)),
            getVotes: (sessionId: string) => dispatch(fetchVotes(sessionId)),
            submitVote: (data: IVoteRq) => dispatch(addVote(data)),
        }),
    )(GroomingMeterComponent),
);
