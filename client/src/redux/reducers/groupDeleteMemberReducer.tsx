import { DeleteGroupMemberActionType, DELETE_GROUP_MEMBER_REQUEST } from '../types/action/groupMemberDeleteActionType';
import { GroupUser } from '../types/userInterface/groupUser';

// Set initial state
const initialState: {users: GroupUser[]} = {
    users: []
};
export function groupDeleteMemberReducer(
    state = initialState,
    action: DeleteGroupMemberActionType): {users: GroupUser[]} {

    switch (action.type) {

        case DELETE_GROUP_MEMBER_REQUEST:
            // tslint:disable-next-line:no-console
            console.log('Inside DELETE_GROUP_MEMBER_REDUCER, PAYLOAD IS: ', action.payload);
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