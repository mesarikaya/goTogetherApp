import { GroupUser } from '../../userInterface/groupUser';

export const UPDATE_GROUP_WAITINGLIST_REQUEST = 'UPDATE_GROUP_WAITINGLIST_REQUEST';

interface UpdateGroupWaitingList {
    type: typeof UPDATE_GROUP_WAITINGLIST_REQUEST
    payload: {
        users: GroupUser[]
    }
}

export type UpdateGroupWaitingListActionType = UpdateGroupWaitingList;