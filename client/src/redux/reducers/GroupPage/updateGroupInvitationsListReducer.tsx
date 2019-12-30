import { UpdateGroupInvitationsListActionType, UPDATE_GROUP_INVITATIONSLIST_REQUEST } from '../../../redux/types/action/GroupPage/updateGroupInvitationsListActionType';
import { GroupUser } from '../../types/userInterface/groupUser';

// Set initial state
const initialState: {users: GroupUser[]} = {
    users: []
};
export function updateGroupInvitationsListReducer(
    state = initialState,
    action: UpdateGroupInvitationsListActionType): {users: GroupUser[]} {
    // tslint:disable-next-line:no-console
    console.log('Inside UPDATE_GROUP_MEMBER_REDUCER, PAYLOAD IS: ', action);
    switch (action.type) {

        case UPDATE_GROUP_INVITATIONSLIST_REQUEST:
            // tslint:disable-next-line:no-console
            console.log('Inside UPDATE_GROUP_MEMBER_REDUCER, PAYLOAD IS: ', action.payload);
            return Object.assign({}, 
                state, 
                {
                    users: {...action.payload.users}
                }
            );
        default:
            return state;
    }
};