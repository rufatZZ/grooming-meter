import isEmpty from 'lodash/isEmpty';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

import { useAuthContext } from 'context/auth';
import { IAppReduxState } from 'ducks';
import { createSession, processLogin, cleanLoginBranch, cleanSessionBranch, IAuthState, ILoginRq, fetchSession } from 'ducks/auth';
import { WithLoading } from 'shared/components/WithLoading';
import { EAuthAction } from 'shared/enums';
import { ISession, IUser } from 'shared/models';
import { IActionType, IAsyncData, isPending } from 'shared/utils/redux';

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

export const LoginComponent: React.FC<TProps> = (props: TProps) => {
    const { history, createSession, getSession, processLogin, loginBranch, sessionBranch, cleanLoginBranch, cleanSessionBranch } = props;
    const { error: loginError } = loginBranch || ({} as IAsyncData<IUser>);
    const { data: sessionData, error: sessionError } = sessionBranch || ({} as IAsyncData<ISession>);
    const [username, setUsername] = useState('');
    const [formAction, setFormAction] = useState('');
    const [sessionId, setSessionId] = useState('');
    const { isLoggedIn } = useAuthContext();
    const isJoinSession = formAction === EAuthAction.JOIN_SESSION;
    const {
        location: { state: locationState },
    } = history;

    const loading = isPending(loginBranch) || isPending(sessionBranch);

    const goToAuthOptions = () => {
        setFormAction('');
        setSessionId('');
        cleanLoginBranch();
        cleanSessionBranch();
    };

    useEffect(() => {
        if (locationState.from) {
            const groomingPath = locationState.from.pathname.split('groom/');
            getSession(groomingPath[1]);
        }
    }, [getSession, locationState]);

    useEffect(() => {
        isLoggedIn && history.push(`/groom/${sessionId}`);
    }, [isLoggedIn, history, sessionId]);

    useEffect(() => {
        if (sessionData) {
            setFormAction(EAuthAction.JOIN_SESSION);
            setSessionId(sessionData._id);
        }
    }, [sessionData]);

    const AuthOptions = () => (
        <div className="auth-actions">
            <button type="button" className="mb-1" onClick={createSession}>
                Create Session
            </button>
            <button type="button" onClick={() => setFormAction(EAuthAction.JOIN_SESSION)}>
                Join Session
            </button>
        </div>
    );

    const renderError = () =>
        (loginError || sessionError) && (
            <div>
                {!isEmpty(loginError) && <div className="panel panel-error bg-danger">{loginError.message}</div>}
                {!isEmpty(sessionError) && <div className="panel panel-error bg-danger">{sessionError.message}</div>}
            </div>
        );

    const JoinSession = () => (
        <form
            onSubmit={e => {
                e.preventDefault();
                processLogin({ username, sessionId });
            }}
        >
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
                        <WithLoading isLoading={loading}>{isJoinSession ? <JoinSession /> : <AuthOptions />}</WithLoading>
                    </div>
                </div>
            </div>
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
            getSession: (sessionId: string) => dispatch(fetchSession(sessionId)),
            createSession: () => dispatch(createSession()),
            cleanLoginBranch: () => dispatch(cleanLoginBranch()),
            cleanSessionBranch: () => dispatch(cleanSessionBranch()),
        }),
    )(LoginComponent),
);
