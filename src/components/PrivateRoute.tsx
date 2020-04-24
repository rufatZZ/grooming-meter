import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuthContext } from 'context/auth';

export const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
    const { isLoggedIn } = useAuthContext();

    return isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />;
};
