import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';

import { useAuthContext } from 'context/auth';

import { processLogin, ILoginState, IActionType } from 'ducks/login';

interface IProps {
    processLogin: typeof processLogin;
}

export const LoginComponent = (props: IProps) => {
    const { processLogin } = props;
    let history = useHistory();
    const [username, setUsername] = useState('');
    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        isLoggedIn && history.push('/groom');
    }, [isLoggedIn]);

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Grooming - Login</title>
            </Helmet>
            <main className="login">
                <div className="login-content">
                    <div className="d-flex flex-row flex-align-center flex-justify-center">
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                processLogin(username);
                            }}
                        >
                            <input type="text" name="gm_username" value={username} onChange={e => setUsername(e.target.value)} />
                            <button type="submit">Join</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export const Login = connect<ILoginState>(null, (dispatch: ThunkDispatch<ILoginState, any, IActionType<string, string>>) => ({
    processLogin: (username: string) => dispatch(processLogin(username)),
}))(LoginComponent);
