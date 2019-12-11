import { combineReducers } from 'redux';
import { loginReducer } from './jwtAuthReducer';
import { groupSearchReducer } from './groupSearchReducer';
import { userSearchReducer } from './userSearchReducer';

export const rootReducer = combineReducers({
    system: loginReducer,
    groupSearchResults: groupSearchReducer,
    userSearchResults: userSearchReducer
});

export type AppState = ReturnType<typeof rootReducer>

