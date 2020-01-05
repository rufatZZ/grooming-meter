import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { Login } from 'components/Login';
import { GroomingMeter } from 'components/Page';

import './App.css';
import { WithAuthInfo } from 'components/WithAuthInfo';

interface IProps {}

const App: React.FC<IProps> = () => {
    return (
        <div className="App">
            <div className="global-container">
                <div className="d-flex flex-row">
                    <nav className="sidebar">
                        <h1>GM</h1>
                    </nav>
                    <WithAuthInfo>
                        <Router>
                            <Route exact path="/" render={() => <Redirect to="/login" />} />
                            <Route exact path="/login" component={Login} />
                            <Route path="/groom" component={GroomingMeter} />
                        </Router>
                    </WithAuthInfo>
                </div>
            </div>
        </div>
    );
};

export default App;
