import { GroupUser } from '../../userInterface/groupUser';

export const UPDATE_GROUP_INVITATIONSLIST_REQUEST = 'UPDATE_GROUP_INVITATIONSLIST_REQUEST';

interface UpdateGroupInvitationsList {
    type: typeof UPDATE_GROUP_INVITATIONSLIST_REQUEST
    payload: {
        users: GroupUser[]
    }
}

export type UpdateGroupInvitationsListActionType = UpdateGroupInvitationsList;