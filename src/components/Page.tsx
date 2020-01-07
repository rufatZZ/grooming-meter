import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import io from 'socket.io-client';

import { IOption, IUser, IVoteRs } from 'models';
import { endpoint } from 'consts';

import { Timer } from 'components/Timer';
import { Users } from 'components/Users';
import { Voting } from 'components/Voting';
import { useAuthContext } from 'context/auth';

interface IProps { }
interface IState {
    endpoint?: any;
    users?: IUser[];
    username?: string;
    userVote?: string;
    options?: IOption[];
    votesList?: IVoteRs;
    timer?: string;
    isShowing?: boolean;
}

let socket: any;

export const GroomingMeter: React.FC<IProps> = props => {
    const [userVote, setUserVote] = useState('');
    const [users, setUsers] = useState([]);
    const [votesList, setVotesList] = useState({ votes: [], length: 0, average: 0 });
    const [isShowing, toggleShowing] = useState(false);

    const { username, isLoggedIn } = useAuthContext();
    let history = useHistory();

    const options: Array<any> = [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '5' }, { value: '8' }, { value: '13' }];
    const timer = '00:00';

    // const { NODE_ENV, REDIRECT_URL } = process.env;

    console.log('REDIRECT_URL as window.location.hostname');

    useEffect(() => {
        !isLoggedIn && history.push('/login');
    }, []);

    useEffect(() => {
        socket = io({ query: `session=${12345}` });
        socket.emit('join', { username });

        //@ts-ignore
        socket.on('updateUsers', (users: IUser[]) => setUsers(users));
        //@ts-ignore
        socket.on('updateVotes', (votesList: IVoteRs) => setVotesList(votesList));
        socket.on('toggleShow', (isShowing: boolean) => toggleShowing(isShowing));

        return () => socket.emit('leave');
    }, []);

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
                    <Timer timer={timer} />
                    <Users users={users} currentUser={username} />
                </div>
            </aside>
        </>
    );
};
