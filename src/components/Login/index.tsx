import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from 'context/auth';

export const Login = () => {
    let history = useHistory();
    const [username, setUsername] = useState('');
    const { handleLogin, isLoggedIn } = useAuthContext();

    useEffect(() => {
        isLoggedIn && history.push('/groom');
    }, [isLoggedIn]);

    return (
        <main className="login">
            <div className="d-flex flex-row flex-align-center flex-justify-center">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <button onClick={() => handleLogin(username)}>Join</button>
            </div>
        </main>
    );
};
