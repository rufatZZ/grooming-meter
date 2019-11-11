import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

interface IUser {
  id?: string;
  username?: string;
  session?: string;
}

interface IVote {
  id?: string;
  value?: string;
}

interface IOption {
  value?: string;
}

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
              <div className="content-holder">
                <div className="panel panel-primary">
                  <div className="subtitle">Vote</div>
                  <div className="voting-list mt-1 d-flex flex-row">
                    {options &&
                      options.map(opt => (
                        <div className="voting-list-item" key={opt.value}>
                          <input
                            type="radio"
                            name="optradio"
                            id={opt.value}
                            checked={opt.value === userVote}
                            onChange={() => this.handleVote(opt.value)}
                          />
                          <label htmlFor={opt.value}>{opt.value}</label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="panel panel-primary">
                  <div className="subtitle">Results</div>
                  <div className="mt-1"></div>
                </div>
              </div>
            </main>
            <aside>
              {/* Timer */}
              <div className="content-holder">
                <div className="timer">
                  <div className="panel mb-1">
                    <span className="subtitle">Time</span>
                    <br />
                    <div className="timer-time text-center">
                      <span>12:53</span>
                    </div>
                  </div>
                </div>
                {/*  Users */}
                <div className="users">
                  <div className="panel">
                    <span className="subtitle">
                      Users {users && `{ ${users.length} }`}
                    </span>
                    <ul>
                      {users &&
                        users.map((user, index) => (
                          <li key={user.id}>
                            {index + 1}. <i>{user.username}</i>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
