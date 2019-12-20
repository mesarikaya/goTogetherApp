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
import { DeleteGroupMemberActionType } from './types/action/groupMemberDeleteActionType';
import { GroupUser } from './types/userInterface/groupUser';
import { UpdateGroupWaitingListActionType } from './types/action/updateGroupWaitingListActionType';

// Create history
export const history = createBrowserHistory();

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

/**
 * This function accepts the app state, and saves it to localStorage
 * @param state
 */
const saveState = (state:AppState) => {
    try {
        // Convert the state to a JSON string 
        const serialisedState = JSON.stringify(state);

        // Save the serialised state to localStorage against the key 'app_state'
        window.localStorage.setItem('app_state', serialisedState);
    } catch (err) {
        // Log errors here, or ignore
    }
};

/**
 * This function checks if the app state is saved in localStorage
 */
const loadState = () => {
    try {
        // Load the data saved in localStorage, against the key 'app_state'
        const serializedState = window.localStorage.getItem('app_state');

        // Passing undefined to createStore will result in our app getting the default state
        // If no data is saved, return undefined
        if (!serializedState) { return undefined; }

        // De-serialise the saved state, and return it.
        return JSON.parse(serializedState);
    } catch (err) {
        // Return undefined if localStorage is not available, 
        // or data could not be de-serialised, 
        // or there was some other error
        return undefined;
    }
};

/**
 * Create the app store
 */
let initialState:AppState = loadState();

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

// Set selected group initial state
const currentSelectedMembers: {users: GroupUser[]} = {
    users: []
};

const currentWaitingList: {users: GroupUser[]} = {
    users: []
};

if (typeof (initialState) === "undefined"){
    initialState = {
        system,
        groupSearchResults,
        userSearchResults,
        currentSelectedMembers,
        currentWaitingList
    };
}

// Create the store with reducer, initial state and middleware
export const store = createStore<AppState, JwtAuthActionTypes&GroupSearchActionType&UserSearchActionType&DeleteGroupMemberActionType&UpdateGroupWaitingListActionType, any,  any>(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(myRouterMiddleware, thunk, logger))
);

store.subscribe(() => {
    saveState(store.getState());
});