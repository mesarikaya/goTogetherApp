import { GroupSearchResult } from '../types/userInterface/groupSearchResult';
import { GroupSearchActionType, UPDATE_GROUP_RESULTS } from '../types/action/groupSearchActionType';

// Set initial state
const initialState: {groups: GroupSearchResult[], page: number} = {
    groups: [],
    page: 0
};
export function updateGroupResultsReducer(
    state = initialState,
    action: GroupSearchActionType
    ): {groups:GroupSearchResult[], page:number} {

    switch (action.type) {

        case UPDATE_GROUP_RESULTS:

            // tslint:disable-next-line:no-console
            console.log('Inside SEARCH_GROUP_REQUEST REDUCER, PAYLOAD IS: ', action.payload);

            return Object.assign({}, 
                                 state, 
                                 {
                                    groups: {...action.payload.groups},
                                    page: action.payload.page
                                 });
        default:
            return state;
    }
};