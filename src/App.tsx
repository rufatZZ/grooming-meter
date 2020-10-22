import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { Login } from 'components/Login';
import { GroomingMeter } from 'components/Groom';
import { PrivateRoute } from 'components/PrivateRoute';
import { WithAuthInfo } from 'components/WithAuthInfo';

const App: React.FC = () => {
    return (
        <div className="global-container">
            <WithAuthInfo>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/login" />} />
                        <Route exact path="/login" component={Login} />
                        <PrivateRoute exact strict path="/groom/:sessionId" component={GroomingMeter} />
                        <Redirect to="/login" />
                    </Switch>
                </Router>
            </WithAuthInfo>
        </div>
    );
};

export default App;
