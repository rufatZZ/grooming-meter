import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { AuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';

interface IProps {
    username: string;
}

const WithAuthInfoComponent: React.FC<IProps> = props => {
    const { children, username } = props;
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        username && setLoggedIn(true);
    }, [username]);

    return <AuthContext.Provider value={{ username, isLoggedIn }}>{children}</AuthContext.Provider>;
};

export const WithAuthInfo = connect(
    (state: IAppReduxState) => ({
        username: state.login.username,
    }),
    {},
)(WithAuthInfoComponent);
