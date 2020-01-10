import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { Login } from 'components/Login';
import { GroomingMeter } from 'components/Page';
import { WithAuthInfo } from 'components/WithAuthInfo';

import './App.css';

interface IProps {}

const App: React.FC<IProps> = () => {
    return (
        <div className="App">
            <div className="global-container">
                <div className="d-flex flex-row">
                    <nav className="sidebar">
                        <img className="mt-1" src={process.env.PUBLIC_URL + '/logo.png'} alt="logo" width="60" height="60"/>
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
