import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { Login } from 'components/Login';
import { GroomingMeter } from 'components/Page';
import { PrivateRoute } from 'components/PrivateRoute';
import { WithAuthInfo } from 'components/WithAuthInfo';

import './App.scss';

interface IProps {}

const App: React.FC<IProps> = () => {
    return (
        <div className="App">
            <div className="global-container">
                <div className="d-flex flex-row">
                    <nav className="sidebar">
                        <img className="mt-1" src={process.env.PUBLIC_URL + '/logo.png'} alt="logo" width="60" height="60" />
                    </nav>  
                    <WithAuthInfo>
                        <Router>
                            <Switch>
                                <Route exact path="/" render={() => <Redirect to="/login" />} />
                                <Route exact path="/login" component={Login} />
                                <PrivateRoute exact path="/groom" component={GroomingMeter} />
                            </Switch>
                        </Router>
                    </WithAuthInfo>
                </div>
            </div>
        </div>
    );
};

export default App;
