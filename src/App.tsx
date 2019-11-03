import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

interface User {
  id?: string;
  username?: string;
  session?: string;
}

interface IProps {}
interface IState {
  endpoint?: any;
  users?: User[];
}

let socket: any;

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      endpoint: "http://127.0.0.1:5000"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    socket = io(endpoint);

    socket.emit("join", { session: "12345", username: Date.now() });

    socket.on("updateUsers", (users: User[]) => {
      this.setState({ users });
    });
  }

  componentWillUnmount() {
    socket.emit("leave", { session: "12345" });
  }

  render() {
    const { users } = this.state;

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
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Reprehenderit, ipsa autem distinctio voluptate accusamus
                  veritatis voluptatem, illo incidunt saepe sequi nesciunt
                  dolores! Animi vel magnam ipsam ab ut, molestias distinctio!
                </div>
              </div>
            </main>
            <aside>
              <div className="content-holder">
                <div className="timer">
                  <div className="panel mb-1">
                    <span className="subtitle">Time</span><br/>
                    <span className="timer-time">00:00</span>
                  </div>
                </div>
                <div className="users">
                  <div className="panel">
                    <span className="subtitle">Users</span>
                    <ul>
                      {users &&
                        users.map(user => (
                          <li key={user.id}>{user.username}</li>
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
