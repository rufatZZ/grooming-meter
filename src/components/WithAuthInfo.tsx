import React, { useState, useEffect } from 'react';
import { AuthContext } from 'context/auth';

export const WithAuthInfo: React.FC = props => {
    const { children } = props;
    const [username, setUsername] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        username && setLoggedIn(true);
    }, [username]);

    return <AuthContext.Provider value={{ username, isLoggedIn, handleLogin: setUsername }}>{children}</AuthContext.Provider>;
};
