import { UpdateGroupWaitingListActionType, UPDATE_GROUP_WAITINGLIST_REQUEST } from '../types/action/updateGroupWaitingListActionType';
import { GroupUser } from '../types/userInterface/groupUser';

// Set initial state
const initialState: {users: GroupUser[]} = {
    users: []
};
export function updateGroupWaitingListReducer(
    state = initialState,
    action: UpdateGroupWaitingListActionType): {users: GroupUser[]} {

    switch (action.type) {

        case UPDATE_GROUP_WAITINGLIST_REQUEST:
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