import { UpdateGroupMemberActionType, UPDATE_GROUP_MEMBER_REQUEST } from '../../../redux/types/action/GroupPage/updateGroupMemberActionType';
import { GroupUser } from '../../types/userInterface/groupUser';

// Set initial state
const initialState: {users: GroupUser[]} = {
    users: []
};
export function groupDeleteMemberReducer(
    state = initialState,
    action: UpdateGroupMemberActionType): {users: GroupUser[]} {

    switch (action.type) {

        case UPDATE_GROUP_MEMBER_REQUEST:
            return Object.assign({}, 
                state, 
                {
                    users: {...action.payloads.users}
                }
            );
        default:
            return state;
    }
};