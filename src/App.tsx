import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

interface IUser {
  id?: string;
  username?: string;
  session?: string;
}

interface IOption {
  value?: number;
}

interface IProps {}
interface IState {
  endpoint?: any;
  users?: IUser[];
  options: IOption[];
}

let socket: any;

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      endpoint: "http://127.0.0.1:5000",
      options: [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 5 },
        { value: 8 },
        { value: 13 }
      ]
    };
  }

  componentDidMount() {
    
    const { endpoint } = this.state;
    socket = io(endpoint);

    socket.emit("join", { session: "12345", username: Date.now() });

    socket.on("updateUsers", (users: IUser[]) => {
      this.setState({ users });
    });
  }

  componentWillUnmount() {
    socket.emit("leave", { session: "12345" });
  }

  handleVote(value?: number) {
    console.log(value);
  }

  render() {
    const { users, options } = this.state;

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
                  <div className="mt-1 ">
                    {options &&
                      options.map(opt => (
                        <label key={opt.value} className="voting-items">
                          <input
                            type="radio"
                            name="optradio"
                            onChange={() => this.handleVote(opt.value)}
                          />
                          {opt.value}
                        </label>
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
                      <span>00:00</span>
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
