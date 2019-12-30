import { GroupUser } from '../../userInterface/groupUser';

export const UPDATE_GROUP_MEMBER_REQUEST = 'UPDATE_GROUP_MEMBER_REQUEST';

interface UpdateGroupMember {
    type: typeof UPDATE_GROUP_MEMBER_REQUEST
    payloads: {users: GroupUser[]}
}

export type UpdateGroupMemberActionType = UpdateGroupMember;