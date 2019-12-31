import React, { Component } from 'react';
import io from 'socket.io-client';

import { IOption, IUser, IVoteRs } from 'models';
import { endpoint } from 'consts';

import { Timer } from 'components/Timer';
import { Users } from 'components/Users';
import { Voting } from 'components/Voting';

interface IProps {}
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

class GroomingMeter extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            userVote: '',
            users: [],
            votesList: { votes: [], length: 0, average: 0 },
            timer: '00:00',
            isShowing: false,
            options: [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '5' }, { value: '8' }, { value: '13' }],
        };
    }

    componentDidMount() {
        const username = `${Date.now()}`;
        socket = io(endpoint, { query: `session=${12345}` });
        socket.emit('join', { username });
        this.setState({ username });

        socket.on('updateUsers', (users: IUser[]) => this.setState({ users }));
        socket.on('updateVotes', (votesList: IVoteRs) => this.setState({ votesList }));
        socket.on('toggleShow', (isShowing: boolean) => this.setState({ isShowing }));
    }

    componentWillUnmount() {
        socket.emit('leave');
    }

    handleVote = (value?: string) => {
        this.setState({ userVote: value });
        socket.emit('vote', { vote: value });
    };

    toggleShow = () => {
        socket.emit('handleShow', { isShowing: !this.state.isShowing });
    };

    handleReset = () => {
        socket.emit('resetVotes');
    };

    render() {
        const { users, username, options, votesList, timer, userVote, isShowing } = this.state;

        return (
            <>
                <main className="content">
                    <Voting
                        options={options}
                        votesList={votesList}
                        userVote={userVote}
                        handleVoting={this.handleVote}
                        isShowing={isShowing}
                        toggleShow={this.toggleShow}
                        handleReset={this.handleReset}
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
    }
}

export default GroomingMeter;
