import { SecurityState } from './system/securityState';
import { GroupSearchResult } from './userInterface/groupSearchResult';
import { GroupSearchFormFields } from './userInterface/groupSearchFormFields';
import { UserSearchResult } from './userInterface/userSearchResult';
import { GroupUser } from './userInterface/groupUser';

export interface StoreState {
    system: SecurityState;
    groupSearchResults: {
        groups: GroupSearchResult[],
        page: number
    };
    userSearchResults: {
        users: UserSearchResult[],
        page: number
    };
    groupSearchFormFields: GroupSearchFormFields;
    currentSelectedMembers: {
        users: GroupUser[]
    };
    currentWaitingList: {
        users: GroupUser[]
    };
}