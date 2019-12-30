import { combineReducers } from 'redux';
import { loginReducer } from './jwtAuthReducer';
import { updateGroupResultsReducer } from './updateGroupResultsReducer';
import { userSearchReducer } from './userSearchReducer';
import { groupDeleteMemberReducer } from './GroupPage/updateGroupMemberReducer';
import { updateGroupWaitingListReducer } from './GroupPage/updateGroupWaitingListReducer';
import { updateUserAccountReducer } from './UserPage/updateUserAccountReducer';
import { updateGroupInvitationsListReducer } from './GroupPage/updateGroupInvitationsListReducer';
import { updateSelectedGroupReducer } from './GroupPage/updateSelectedGroupReducer';

export const rootReducer = combineReducers({
    system: loginReducer,
    userAccount: updateUserAccountReducer,
    groupSearchResults: updateGroupResultsReducer,
    userSearchResults: userSearchReducer,
    selectedGroup: updateSelectedGroupReducer,
    currentSelectedMembers: groupDeleteMemberReducer,
    currentWaitingList: updateGroupWaitingListReducer,
    currentInvitationsList: updateGroupInvitationsListReducer
});

export type AppState = ReturnType<typeof rootReducer>

