import { GroupSearchResult } from '../../types/userInterface/groupSearchResult';
import { UPDATE_USER_ACCOUNT, UpdateUserAccountActionType } from '../../types/action/updateUserAccountActionType';

// Set initial state
const initialState: {subscribedGroups: GroupSearchResult[], invitationList: GroupSearchResult[]} = {
    subscribedGroups: [],
    invitationList: []
};
export function updateUserAccountReducer(
    state = initialState,
    action: UpdateUserAccountActionType
    ): {subscribedGroups: GroupSearchResult[], invitationList: GroupSearchResult[]} {

    switch (action.type) {

        case UPDATE_USER_ACCOUNT:
            return Object.assign({}, 
                                 state, 
                                 {
                                    subscribedGroups: {...action.payload.subscribedGroups},
                                    invitationList: {...action.payload.invitationList}
                                 });
        default:
            return state;
    }
};