import { combineReducers } from 'redux';
import { loginReducer } from './jwtAuthReducer';
import { groupSearchReducer } from './groupSearchReducer';
import { userSearchReducer } from './userSearchReducer';
import { groupDeleteMemberReducer } from './groupDeleteMemberReducer';
import { updateGroupWaitingListReducer } from './updateGorupWaitingListReducer';

export const rootReducer = combineReducers({
    system: loginReducer,
    groupSearchResults: groupSearchReducer,
    userSearchResults: userSearchReducer,
    currentSelectedMembers: groupDeleteMemberReducer,
    currentWaitingList: updateGroupWaitingListReducer
});

export type AppState = ReturnType<typeof rootReducer>

