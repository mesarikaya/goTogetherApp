import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import { JwtAuthActionTypes } from './types/action/jwtAuthActionType';
import { rootReducer, AppState } from "./reducers/rootReducer";
import { SecurityState } from './types/system/securityState';
import { GroupSearchResult } from './types/userInterface/groupSearchResult';
import { GroupSearchActionType } from './types/action/groupSearchActionType';
import { UserSearchActionType } from './types/action/userSearchActionType';
import { UserSearchResult } from './types/userInterface/userSearchResult';

// Create history
export const history = createBrowserHistory();

// Set initial state
const system: SecurityState = {
    cookie: "none",
    loggedIn: false,
    userName: "guest",
    token: ''
};

const groupSearchResults: {groups: GroupSearchResult[], page: number} = {
    groups: [],
    page: 0
};

const userSearchResults: {users: UserSearchResult[], page: number} = {
    users: [],
    page: 0
};

const initialState: AppState = {
    system,
    groupSearchResults,
    userSearchResults
};

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

// Create the store with reducer, initial state and middleware
export const store = createStore<AppState, JwtAuthActionTypes&GroupSearchActionType&UserSearchActionType, any,  any>(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(myRouterMiddleware, thunk, logger))
);


