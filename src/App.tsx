import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

interface IProps {}
interface IState {
  endpoint ?: any;
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

    socket.emit('join', {user: 'rufat'});
  }

  componentWillUnmount() {
    socket.emit('leave', {user: 'rufat'});
  }

  render() {
    return (
      <div className="App">
        <header style={{ textAlign: "center" }}>
          <h2>Grooming-meter</h2>
        </header>
        <div className="App--sidebar">sdfsfsd</div>
        <div className="App--main">sadada</div>
      </div>
    );
  }
}

export default App;
