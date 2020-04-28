import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Helmet } from 'react-helmet';
import { RouterProps, withRouter } from 'react-router';

import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { createSession, processLogin, IAuthState, ILoginRq } from 'ducks/auth';
import { EAuthAction } from 'shared/enums';
import { ISession } from 'shared/models';
import { IActionType, IAsyncData } from 'shared/utils/redux';

interface IStateProps {
    sessionBranch: IAsyncData<ISession>;
}

interface IDispatchProps {
    createSession: typeof createSession;
    processLogin: typeof processLogin;
}

interface IProps extends IStateProps, IDispatchProps {}

type TProps = IProps & RouterProps;

export const LoginComponent: React.FC<TProps> = (props: TProps) => {
    const { history, createSession, processLogin, sessionBranch } = props;
    const { data: sessionData } = sessionBranch || ({} as IAsyncData<ISession>);
    const [username, setUsername] = useState('');
    const [formAction, setFormAction] = useState('');
    const [sessionId, setSessionId] = useState('');
    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        isLoggedIn && history.push('/groom');
    }, [isLoggedIn, history]);

    useEffect(() => {
        if (sessionData) {
            setFormAction(EAuthAction.JOIN_SESSION);
            setSessionId(sessionData._id);
        }
    }, [sessionData]);

    const renderAuthOptions = () => (
        <>
            <button className="mr-1" onClick={createSession}>
                Create Session
            </button>
            <button className="ml-1" onClick={() => setFormAction(EAuthAction.JOIN_SESSION)}>
                Join Session
            </button>
        </>
    );

    const renderJoinSession = () => (
        <form
            onSubmit={e => {
                e.preventDefault();
                processLogin({ username, sessionId });
            }}
        >
            {!sessionData && (
                <input
                    type="text"
                    name="gm_session"
                    placeholder="Session ID"
                    required
                    value={sessionId}
                    onChange={e => setSessionId(e.target.value)}
                />
            )}
            <input type="text" name="gm_username" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} />
            <button type="submit">Join</button>
        </form>
    );

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Grooming - Login</title>
            </Helmet>
            <main className="auth">
                <div className="auth-content">
                    <div className="d-flex flex-column flex-align-center flex-justify-center">
                        <div className="d-flex flex-row flex-align-center flex-justify-center">
                            {(() => {
                                switch (formAction) {
                                    case EAuthAction.JOIN_SESSION:
                                        return renderJoinSession();
                                    default:
                                        return renderAuthOptions();
                                }
                            })()}
                        </div>
                        {formAction && (
                            <div>
                                <button onClick={() => setFormAction('')}>Back</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export const Login = withRouter<any, React.FC<TProps>>(
    connect<IStateProps, {}, {}, IAppReduxState>(
        (state: IAppReduxState) => ({
            sessionBranch: state.auth.session,
        }),
        (dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>) => ({
            processLogin: (data: ILoginRq) => dispatch(processLogin(data)),
            createSession: () => dispatch(createSession()),
        }),
    )(LoginComponent),
);
