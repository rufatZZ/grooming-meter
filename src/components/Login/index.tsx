import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { createSession, processLogin, cleanLoginBranch, cleanSessionBranch, IAuthState, ILoginRq, fetchSession } from 'ducks/auth';
import { Loading } from 'shared/components/Loading';
import { EAuthAction } from 'shared/enums';
import { ISession, IUser } from 'shared/models';
import { IActionType, IAsyncData, isError, isPending } from 'shared/utils/redux';

import './index.scss';

interface IStateProps {
    sessionBranch: IAsyncData<ISession>;
    loginBranch: IAsyncData<IUser>;
}

interface IDispatchProps {
    createSession: typeof createSession;
    getSession: typeof fetchSession;
    processLogin: typeof processLogin;
    cleanLoginBranch: typeof cleanLoginBranch;
    cleanSessionBranch: typeof cleanSessionBranch;
}

interface IProps extends IStateProps, IDispatchProps {}

type TProps = IProps & RouterProps;

const LoginComponent: React.FC<TProps> = (props: TProps) => {
    const { history, createSession, getSession, processLogin, loginBranch, sessionBranch, cleanLoginBranch, cleanSessionBranch } = props;
    const { error: loginError } = loginBranch || ({} as IAsyncData<IUser>);
    const { data: sessionData, error: sessionError } = sessionBranch || ({} as IAsyncData<ISession>);
    const [username, setUsername] = useState('');
    const [formAction, setFormAction] = useState('');
    const [sessionId, setSessionId] = useState('');
    const { isLoggedIn } = useAuthContext();
    const { location } = history;

    const isJoinSession = formAction === EAuthAction.JOIN_SESSION;
    const loading = isPending(loginBranch) || isPending(sessionBranch);

    const goToAuthOptions = () => {
        setFormAction('');
        setSessionId('');
        cleanLoginBranch();
        cleanSessionBranch();
    };

    const goToJoinSession = () => {
        cleanLoginBranch();
        cleanSessionBranch();
        setFormAction(EAuthAction.JOIN_SESSION);
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        processLogin({ username, sessionId });
    };

    useEffect(() => {
        if (location.state && location.state.from) {
            const locationState = location.state;
            const groomingPath = locationState.from.pathname.split('groom/');
            getSession(groomingPath[1]);
        }
    }, [getSession, location]);

    useEffect(() => {
        isLoggedIn && history.push(`/groom/${sessionId}`);
    }, [isLoggedIn, history, sessionId]);

    useEffect(() => {
        if (sessionData) {
            setFormAction(EAuthAction.JOIN_SESSION);
            setSessionId(sessionData._id);
        }
    }, [sessionData]);

    const renderError = () =>
        (isError(loginBranch) || isError(sessionBranch)) && (
            <div>
                <div className="panel panel-error bg-danger">{(sessionError || loginError).message || 'Unknown Error'}</div>
            </div>
        );

    const renderAuthOptions = () => (
        <div className="auth-actions">
            <button type="button" className="mb-1" onClick={createSession}>
                Create Session
            </button>
            <button type="button" onClick={goToJoinSession}>
                Join Session
            </button>
        </div>
    );

    const renderJoinSession = () => (
        <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column">
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
            <div className="login-actions">
                {formAction && (
                    <button type="button" onClick={() => goToAuthOptions()}>
                        Back
                    </button>
                )}
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

            <div className="d-flex flex-row flex-align-center flex-justify-center full-window-height">
                <div className="auth">
                    <div className="d-flex flex-column flex-align-center flex-justify-center">
                        {renderError()}
                        <Loading isLoading={loading}>{isJoinSession ? renderJoinSession() : renderAuthOptions()}</Loading>
                    </div>
                </div>
            </div>
        </>
    );
};

const Login = withRouter<any, React.FC<TProps>>(
    connect<IStateProps, {}, {}, IAppReduxState>(
        (state: IAppReduxState) => ({
            loginBranch: state.auth.login,
            sessionBranch: state.auth.session,
        }),
        (dispatch: ThunkDispatch<IAuthState, any, IActionType<string, string>>) => ({
            processLogin: (data: ILoginRq) => dispatch(processLogin(data)),
            getSession: (sessionId: string) => dispatch(fetchSession(sessionId)),
            createSession: () => dispatch(createSession()),
            cleanLoginBranch: () => dispatch(cleanLoginBranch()),
            cleanSessionBranch: () => dispatch(cleanSessionBranch()),
        }),
    )(LoginComponent),
);

export default Login;
