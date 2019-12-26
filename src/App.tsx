import React, { Component } from 'react';
import io from 'socket.io-client';

import { IOption, IUser, IVote } from './models';

import { Timer } from './components/Timer';
import { Users } from './components/Users';
import { Voting } from './components/Voting';

import './App.css';

interface IProps {}
interface IState {
    endpoint?: any;
    users?: IUser[];
    username?: string;
    userVote?: string;
    options?: IOption[];
    votes?: IVote[];
    timer?: string;
    isShowing?: boolean;
}

let socket: any;

class App extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            endpoint: 'http://127.0.0.1:5000/',
            userVote: '',
            users: [],
            votes: [],
            timer: '00:00',
            isShowing: false,
            options: [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '5' }, { value: '8' }, { value: '13' }],
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        const username = `${Date.now()}`;
        socket = io(endpoint, { query: `session=${12345}` });
        socket.emit('join', { username });
        this.setState({ username });

        socket.on('updateUsers', (users: IUser[]) => this.setState({ users }));
        socket.on('updateVotes', (votes: IVote[]) => this.setState({ votes }));
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
        socket.emit('handleShow', { isShowing: this.state.isShowing });
    };

    handleReset = () => {
        socket.emit('resetVotes');
    };

    render() {
        const { users, username, options, votes, timer, userVote, isShowing } = this.state;

        return (
            <div className="App">
                <div className="global-container">
                    <div className="d-flex flex-row">
                        <nav className="sidebar">
                            <h1>GM</h1>
                        </nav>
                        <main className="content">
                            <Voting
                                options={options}
                                votes={votes}
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
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
