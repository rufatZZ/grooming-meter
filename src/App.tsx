import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { Login } from 'components/Login';
import { GroomingMeter } from 'components/Page';
import { WithAuthInfo } from 'components/WithAuthInfo';

import logo from 'assets/img/logo.svg';
import './App.css';

interface IProps {}

const App: React.FC<IProps> = () => {
    console.log(logo);
    return (
        <div className="App">
            <div className="global-container">
                <div className="d-flex flex-row">
                    <nav className="sidebar">
                        <img src={logo} alt="logo"/>
                    </nav>
                    <WithAuthInfo>
                        <Router>
                            <Route exact path="/" render={() => <Redirect to="/login" />} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/groom" component={GroomingMeter} />
                        </Router>
                    </WithAuthInfo>
                </div>
            </div>
        </div>
    );
};

export default App;
