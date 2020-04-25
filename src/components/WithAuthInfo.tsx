import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { AuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { IAsyncData } from 'utils/redux';
import { IUser } from 'models';

interface IProps {
    loginBranch: IAsyncData<IUser>;
}

const WithAuthInfoComponent: React.FC<IProps> = props => {
    const { children, loginBranch } = props;
    const [isLoggedIn, setLoggedIn] = useState(false);
    const { data: loginData } = loginBranch || ({} as IAsyncData<IUser>);

    useEffect(() => {
        loginData && setLoggedIn(true);
    }, [loginData]);

    return <AuthContext.Provider value={{ user: loginData, isLoggedIn }}>{children}</AuthContext.Provider>;
};

export const WithAuthInfo = connect(
    (state: IAppReduxState) => ({
        loginBranch: state.auth.login,
    }),
    {},
)(WithAuthInfoComponent);
