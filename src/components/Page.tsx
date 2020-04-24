import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import io from 'socket.io-client';

import { IUser, IVoteRs } from 'models';
import { endpoint } from 'consts';
import { Timer } from 'components/Timer';
import { Users } from 'components/Users';
import { Voting } from 'components/Voting';
import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { fetchUsers, IUsersState } from 'ducks/users';
import { IActionType } from 'utils/redux';

let socket: any;

interface IStateProps {
    usersList: IUser[];
}

interface IDispatchProps {
    getUsers: typeof fetchUsers;
}

interface IProps extends IStateProps, IDispatchProps {}

type TProps = IProps & RouteComponentProps<{}>;

const GroomingMeterComponent: React.FC<TProps> = props => {
    const { getUsers, usersList } = props;
    const [timer, setTimer] = useState(0);
    const [userVote, setUserVote] = useState('');
    const [votesList, setVotesList] = useState({ votes: [], length: 0, average: 0 });
    const [isShowing, toggleShowing] = useState(false);

    const { user } = useAuthContext();
    const { username } = user || ({} as IUser);

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
            query: { session: `${123446}`, userId: user._id },
        });

        username && socket.emit('join', { username });

        //@ts-ignore
        socket.on('updateUsers', async () => {
            getUsers();
        });
        //@ts-ignore
        socket.on('updateVotes', (votesList: IVoteRs) => setVotesList(votesList));
        socket.on('toggleShow', (isShowing: boolean) => toggleShowing(isShowing));
        socket.on('timer', (time: number) => setTimer(time));

        return () => socket.emit('leave');
    }, [user]);

    const handleVote = (value: string) => {
        setUserVote(value);
        socket.emit('vote', { vote: value });
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
        }),
        (dispatch: ThunkDispatch<IUsersState, any, IActionType<string, IUser[]>>) => ({
            getUsers: () => dispatch(fetchUsers()),
        }),
    )(GroomingMeterComponent),
);
