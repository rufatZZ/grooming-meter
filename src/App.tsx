import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import PrivateRoute from 'components/PrivateRoute';
import WithAuthInfo from 'components/WithAuthInfo';
import { Loading } from 'shared/components/Loading';

const Login = lazy(() => import('components/Login'));
const GroomingMeter = lazy(() => import('components/Groom'));

const App: React.FC = () => {
    return (
        <div className="global-container">
            <Suspense fallback={<Loading />}>
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
            </Suspense>
        </div>
    );
};

export default App;
