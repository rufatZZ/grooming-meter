import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Helmet } from 'react-helmet';
import { RouterProps, withRouter } from 'react-router';

import { useAuthContext } from 'context/auth';

import { IAppReduxState } from 'ducks';
import { processLogin, IAuthState } from 'ducks/auth';
import { IActionType } from 'utils/redux';

interface IProps {
    processLogin: typeof processLogin;
}

type TProps = IProps & RouterProps;

export const LoginComponent: React.FC<TProps> = (props: TProps) => {
    const { history, processLogin } = props;
    const [username, setUsername] = useState('');
    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        isLoggedIn && history.push('/groom');
    }, [isLoggedIn, history]);

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
                            // fix manual session adding 
                            onSubmit={e => {
                                e.preventDefault();
                                processLogin(username, '123446');
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

export const Login = withRouter<any, React.FC<TProps>>(
    connect<IAppReduxState>(null, (dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>) => ({
        processLogin: (username: string, session: string) => dispatch(processLogin(username, session)),
    }))(LoginComponent),
);