import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

interface IProps {}
interface IState {
  endpoint?: any;
  users?: Array<string>;
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

    socket.emit("join", { session: "12345", user: Date.now() });

    socket.on("updateUsers", (users: Array<string>) => {
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
        <header>
          <h2>Grooming-meter</h2>
        </header>
        <div className="App--sidebar">
          <ul>
            {users ? users.map(user => <li>{user}</li>) : <li>No users</li>}
          </ul>
        </div>
        <div className="App--main">sadada</div>
      </div>
    );
  }
}

export default App;
