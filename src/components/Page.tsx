import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import io from 'socket.io-client';

import { IUser, IVotesInfo, IVote } from 'models';
import { endpoint } from 'consts';
import { Timer } from 'components/Timer';
import { Users } from 'components/Users';
import { Voting } from 'components/Voting';
import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { fetchUsers, IUsersState } from 'ducks/users';
import { fetchVotes, IVotesState, IVoteRq, addVote } from 'ducks/votes';
import { IActionType } from 'utils/redux';

let socket: any;

interface IStateProps {
    usersList: IUser[];
    votesList: IVotesInfo;
}

interface IDispatchProps {
    getUsers: typeof fetchUsers;
    getVotes: typeof fetchVotes;
    submitVote: typeof addVote;
}

interface IProps extends IStateProps, IDispatchProps {}

type TProps = IProps & RouteComponentProps<{}>;

const GroomingMeterComponent: React.FC<TProps> = props => {
    const { getUsers, getVotes, submitVote, usersList, votesList } = props;
    const [timer, setTimer] = useState(0);
    const [userVote, setUserVote] = useState('');
    const [isShowing, toggleShowing] = useState(false);

    const { user } = useAuthContext();
    const { session, username, _id: userId } = user || ({} as IUser);

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
        // TODO get session from state.
        socket = io(endpoint, {
            transports: ['websocket'],
            query: { session, userId },
        });

        socket.emit('join', { username });

        socket.on('updateList', async () => {
            if (session) {
                getUsers(session);
                getVotes(session);
            }
        });
        //@ts-ignore
        // socket.on('toggleShow', (isShowing: boolean) => toggleShowing(isShowing));
        socket.on('timer', (time: number) => setTimer(time));

        return () => socket.emit('leave');
    }, [username, userId, getUsers]);

    const handleVote = (vote: string) => {
        setUserVote(vote);
        userId && session && submitVote({ userId, session, vote });
    };

    const toggleShow = () => {
        socket.emit('handleShow', { isShowing: !isShowing });
    };

    const handleReset = () => {
        socket.emit('resetVotes');
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
            usersList: state.users.list,
            votesList: state.votes.list,
        }),
        (dispatch: ThunkDispatch<IUsersState & IVotesState, any, IActionType<string, IUser[] & IVote[]>>) => ({
            getUsers: (session: string) => dispatch(fetchUsers(session)),
            getVotes: (session: string) => dispatch(fetchVotes(session)),
            submitVote: (data: IVoteRq) => dispatch(addVote(data)),
        }),
    )(GroomingMeterComponent),
);
