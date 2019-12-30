import { GroupSearchResult } from '../userInterface/groupSearchResult';

export const UPDATE_USER_ACCOUNT = 'UPDATE_USER_ACCOUNT';

interface UpdateUserAccount {
    type: typeof UPDATE_USER_ACCOUNT
    payload: {
        subscribedGroups: GroupSearchResult[],
        invitationList: GroupSearchResult[]
    }
}

export type UpdateUserAccountActionType = UpdateUserAccount;