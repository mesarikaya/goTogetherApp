import { GroupUser } from '../userInterface/groupUser';

export const DELETE_GROUP_MEMBER_REQUEST = 'DELETE_GROUP_MEMBER_REQUEST';

interface DeleteGroupMember {
    type: typeof DELETE_GROUP_MEMBER_REQUEST
    payload: {users: GroupUser[]}
}

export type DeleteGroupMemberActionType = DeleteGroupMember;