import axios from "axios";
axios.defaults.withCredentials = true; // to make use of jwt
import { Dispatch } from "redux";
import { GroupSearchResult } from '../types/userInterface/groupSearchResult';
import { DeleteGroupMemberActionType } from '../types/action/groupMemberDeleteActionType';
import { GroupUser } from '../types/userInterface/groupUser';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/v1/" : "http://localhost:8080/api/v1/";

/**
 * Delete the member from the group and update the store state
 * @param event 
 * @param key 
 * @param currentGroup 
 * @param groupSearchResults 
 * @param groupId 
 * @param userId 
 * @param token 
 */
export function DeleteMember(event: React.MouseEvent<HTMLButtonElement> | null,
                             currentGroup: GroupSearchResult,
                             groupId: string,
                             userId: string,
                             token: string) {
    
    if (event !== null) { 
        event.preventDefault();
    }
    
    const params = new URLSearchParams();
    params.append('groupId', groupId);
    params.append('userId', userId);

    return ((dispatch: Dispatch<DeleteGroupMemberActionType>) => {
        return (axios.delete(`${url}groups/members`, {
            headers: {
                Authorization: "Bearer " + token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
            },
            params,
            withCredentials: true
        }).then((response) => {
            
            const initialState: {users: GroupUser[]} = {users: currentGroup.members.users};
            let payload = initialState;

            // tslint:disable-next-line:no-console
            console.log("SENDING TO THE DELETE MEMBER DATA REDUCER", response);

            // Depending on response status, allow or not for login
            if (response.status === 200) {
                // tslint:disable-next-line:no-console
                console.log("response is", response.data);
                const responseData = response.data;
                if(responseData){ 
                    // tslint:disable-next-line: no-console
                    console.log("Payload for group after delete: ", responseData);
                    window.localStorage.setItem('selectedGroupCard', JSON.stringify(responseData));
                    payload = {users : responseData.members.users}; 
                }else{
                    payload = {users: currentGroup.members.users}; 
                }
                
                // Set the selected group item to the local storage
                // tslint:disable-next-line: no-console
                console.log("Setting the local storage 2:", JSON.stringify(responseData));
                dispatch({ type: 'DELETE_GROUP_MEMBER_REQUEST', payload });      
            }else {
                // TODO: CREATE ERROR HANDLERS
                // tslint:disable-next-line:no-console
                console.log("Error in axios");
                dispatch({ type: 'DELETE_GROUP_MEMBER_REQUEST', payload });
            }
            // TODO: PUT THE RIGHT type for error inside the catch
        })
        .catch((error: any) => {
            // handle error
            // tslint:disable-next-line:no-console
            console.log("Error in get is:", error.response );
            throw (error);
        }));   
    });
};