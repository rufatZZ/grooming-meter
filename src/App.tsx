import React, { Component } from "react";
import io from "socket.io-client";

import { IOption, IUser, IVote } from "./models";

import { Voting } from "./components/Voting";
import { Timer } from "./components/Timer";
import { Users } from "./components/Users";

import "./App.css";

interface IProps {}
interface IState {
  endpoint?: any;
  users?: IUser[];
  userVote?: string;
  options?: IOption[];
  votes?: IVote[];
}

let socket: any;

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      endpoint: "http://127.0.0.1:5000/",
      userVote: "",
      options: [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "5" },
        { value: "8" },
        { value: "13" }
      ]
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    socket = io(endpoint, { query: `session=${12345}` });
    socket.emit("join", { username: Date.now() });
    socket.on("updateUsers", (users: IUser[]) => {
      this.setState({ users });
    });

    socket.on("updateVotes", (votes: IVote[]) => console.log(votes));
  }

  componentWillUnmount() {
    socket.emit("leave");
  }

  handleVote(value?: string) {
    this.setState({ userVote: value });
    socket.emit("vote", { vote: value });
  }

  render() {
    const { users, options, userVote } = this.state;

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
                userVote={userVote}
                handleVoting={this.handleVote}
              />
            </main>
            <aside>
              <div className="content-holder">
                {/* Timer */}
                <Timer />
                {/*  Users */}
                <Users users={users} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
