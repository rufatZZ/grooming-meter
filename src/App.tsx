import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { Login } from 'components/Login';
import GroomingMeter from 'components/Page';

import './App.css';

interface IProps {}

const App: React.FC<IProps> = () => {
    return (
        <div className="App">
            <div className="global-container">
                <div className="d-flex flex-row">
                    <nav className="sidebar">
                        <h1>GM</h1>
                    </nav>
                    <Router>
                        <Route exact path="/" render={() => <Redirect to="/login" />} />
                        <Route exact path="/login" component={Login} />
                        <Route path="/groom" component={GroomingMeter} />
                    </Router>
                </div>
            </div>
        </div>
    );
};

export default App;
