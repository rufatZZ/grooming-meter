import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { loginReducer } from 'ducks/login';
import { composeEnhancers } from 'utils/redux';

const reducer = combineReducers({
    login: loginReducer,
    //TODO fix this types
    users: {} as any,
    votes: {} as any,
    timer: {} as any,
});

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
