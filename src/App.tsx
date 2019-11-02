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

    return <div className="App"></div>;
  }
}

export default App;
