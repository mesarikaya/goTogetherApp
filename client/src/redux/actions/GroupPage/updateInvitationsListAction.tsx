import axios from "axios";
axios.defaults.withCredentials = true; // to make use of jwt
import { Dispatch } from "redux";
import { GroupSearchResult } from '../../types/userInterface/groupSearchResult';
import { UpdateSelectedGroupActionType } from 'src/redux/types/action/GroupPage/updateSelectedGroupActionType';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/v1/" : "http://localhost:8080/api/v1/";

/**
 * Add the user to the group waitingList and update the store state
 * @param event 
 * @param currentGroup 
 * @param groupId
 * @param userId
 * @param token 
 */
export function updateInvitationsList(event: React.MouseEvent<HTMLButtonElement>,
                                      currentGroup: GroupSearchResult,
                                      groupId: string,
                                      userId: string,
                                      token: string,
                                      actionType: 'add'|'delete') {

    if (event !== null) { 
        event.preventDefault();
    }

    return ((dispatch: Dispatch<UpdateSelectedGroupActionType>) => {

        if(actionType==='add'){
            addToList(currentGroup, groupId, userId, token, dispatch);
        }else if (actionType==='delete'){
            deleteFromList(currentGroup, groupId, userId, token, dispatch);
        }
    });
};

function addToList(currentGroup: GroupSearchResult,
                   groupId: string,
                   userId: string,
                   token: string,
                   dispatch: Dispatch<UpdateSelectedGroupActionType>) {

    const data = {
        userId,
        groupId
    };

    return (axios.put(`${url}groups/invitationsList`, 
                data, 
                {headers: {
                    Authorization: "Bearer " + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Cache: "no-cache"
                },
                withCredentials: true
            }).then((response) => {
                executeResponse(currentGroup, response, dispatch);
                // TODO: PUT THE RIGHT type for error inside the catch
            })
            .catch((error: any) => {
                // handle error
                // tslint:disable-next-line:no-console
                console.log("Error in get is:", error.response );
                throw (error);
            }));
};

function deleteFromList(currentGroup: GroupSearchResult,
                        groupId: string,
                        userId: string,
                        token: string, 
                        dispatch: Dispatch<UpdateSelectedGroupActionType>) {

    const params = new URLSearchParams();
    params.append('groupId', groupId);
    params.append('userId', userId);
    
    return (axios.delete(`${url}groups/invitationsList`, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cache: "no-cache"
        },
        params,
        withCredentials: true
    }).then((response) => {
        executeResponse(currentGroup, response, dispatch);
        // TODO: PUT THE RIGHT type for error inside the catch
    }).catch((error: any) => {
        // handle error
        // tslint:disable-next-line:no-console
        console.log("Error in get is:", error.response );
        throw (error);
    }));
};

function executeResponse(currentGroup: GroupSearchResult, 
                         response: any, 
                         dispatch: Dispatch<UpdateSelectedGroupActionType>){

    const initialState: GroupSearchResult = currentGroup;
    let payload = initialState;

    // Depending on response status, allow or not for login
    if (response.status === 200) {
        const responseData = response.data;
        if(responseData){ 
            payload = responseData
        }else{
            payload = responseData
        }
        dispatch({ type: 'UPDATE_SELECTED_GROUP_REQUEST', payload });      
    }else {
        // TODO: CREATE ERROR HANDLERS
        // tslint:disable-next-line:no-console
        console.log("Error in axios");
        dispatch({ type: 'UPDATE_SELECTED_GROUP_REQUEST', payload });
    }
}

/* function executeResponse(currentGroup: GroupSearchResult, 
                         response: any, 
                         dispatch: Dispatch<UpdateGroupInvitationsListActionType>){

    const initialState: {users: GroupUser[]} = {users: currentGroup.invitationList.users};
    let payload = initialState;

    // tslint:disable-next-line:no-console
    console.log("SENDING TO THE UPDATE WAITINGLIST DATA REDUCER", response);

    // Depending on response status, allow or not for login
    if (response.status === 200) {
        // tslint:disable-next-line:no-console
        console.log("response is", response.data);
        const responseData = response.data;
        if(responseData){ 
            payload = {users: responseData.invitationList.users};
        }else{
            payload = {users: currentGroup.invitationList.users};
        }

        dispatch({ type: 'UPDATE_GROUP_INVITATIONSLIST_REQUEST', payload });
    }else {
        // TODO: CREATE ERROR HANDLERS
        // tslint:disable-next-line:no-console
        console.log("Error in axios");
        dispatch({ type: 'UPDATE_GROUP_INVITATIONSLIST_REQUEST', payload });
    }
} */