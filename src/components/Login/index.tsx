import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Helmet } from 'react-helmet';
import { RouterProps, withRouter } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { createSession, processLogin, IAuthState, ILoginRq } from 'ducks/auth';
import { WithLoading } from 'shared/components/WithLoading';
import { EAuthAction, EProccessStatus } from 'shared/enums';
import { ISession, IUser } from 'shared/models';
import { IActionType, IAsyncData } from 'shared/utils/redux';

interface IStateProps {
    sessionBranch: IAsyncData<ISession>;
    loginBranch: IAsyncData<IUser>;
}

interface IDispatchProps {
    createSession: typeof createSession;
    processLogin: typeof processLogin;
}

interface IProps extends IStateProps, IDispatchProps {}

type TProps = IProps & RouterProps;

export const LoginComponent: React.FC<TProps> = (props: TProps) => {
    const { history, createSession, processLogin, loginBranch, sessionBranch } = props;
    const { error: loginError } = loginBranch || ({} as IAsyncData<IUser>);
    const { data: sessionData, error: sessionError } = sessionBranch || ({} as IAsyncData<ISession>);
    const [username, setUsername] = useState('');
    const [formAction, setFormAction] = useState('');
    const [sessionId, setSessionId] = useState('');
    const { isLoggedIn } = useAuthContext();

    console.log(sessionBranch);

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
            <div className="d-flex flex-column">
                {/* TODO check show options for clean session data after create and back button. */}
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
            </div>
            <div className="auth-actions">
                {formAction && <button onClick={() => setFormAction('')}>Back</button>}
                <button type="submit">Join</button>
            </div>
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
                        <div>
                            {!isEmpty(loginError) && (
                                <div className="panel panel-error bg-danger" style={{ color: 'white' }}>
                                    {loginError.message}
                                </div>
                            )}
                            {!isEmpty(sessionError) && (
                                <div className="panel panel-error bg-danger" style={{ color: 'white' }}>
                                    {sessionError.message}
                                </div>
                            )}
                        </div>
                        <WithLoading isLoading={loginBranch.status === EProccessStatus.PENDING || sessionBranch.status === EProccessStatus.PENDING}>
                            {(() => {
                                switch (formAction) {
                                    case EAuthAction.JOIN_SESSION:
                                        return renderJoinSession();
                                    default:
                                        return renderAuthOptions();
                                }
                            })()}
                        </WithLoading>
                    </div>
                </div>
            </main>
        </>
    );
};

export const Login = withRouter<any, React.FC<TProps>>(
    connect<IStateProps, {}, {}, IAppReduxState>(
        (state: IAppReduxState) => ({
            loginBranch: state.auth.login,
            sessionBranch: state.auth.session,
        }),
        (dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>) => ({
            processLogin: (data: ILoginRq) => dispatch(processLogin(data)),
            createSession: () => dispatch(createSession()),
        }),
    )(LoginComponent),
);
