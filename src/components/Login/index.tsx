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
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleLogin(username);
                    }}
                >
                    <input type="text" name="gm_username" value={username} onChange={e => setUsername(e.target.value)} />
                    <button type="submit">Join</button>
                </form>
            </div>
        </main>
    );
};
