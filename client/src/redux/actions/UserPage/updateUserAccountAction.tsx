import axios from "axios";
axios.defaults.withCredentials = true; // to make use of jwt
import { Dispatch } from "redux";
import { GroupSearchResult } from '../../types/userInterface/groupSearchResult';
import { UpdateUserAccountActionType } from '../../types/action/updateUserAccountActionType';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/v1/" : "http://localhost:8080/api/v1/";

/**
 * Make GET request and dipatch the image data to be shown via redux  
 * @param e HTML Form Event
 * @param formFields Login form input data
 */
export function updateUserAccount(event: React.MouseEvent<HTMLButtonElement> | null, 
                                  existingGroups: GroupSearchResult[],
                                  userId: string,
                                  token: string) {
    
    if (event !== null) { 
        event.preventDefault();
    }
    
    // Set data to send with Post request
    const params = new URLSearchParams();
    params.append('userId', userId);
    return ((dispatch: Dispatch<UpdateUserAccountActionType>) => {
        return (axios.get(`${url}user`, {
            headers: {
                Authorization: "Bearer " + token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
            },
            params,
            withCredentials: true
        }).then((response) => {
            
            const initialState: {subscribedGroups: GroupSearchResult[], invitationList: GroupSearchResult[]} = {
                subscribedGroups: [],
                invitationList: []
            };

            let payload = initialState;

            const subscribedGroups:GroupSearchResult[] = [];
            const invitationList:GroupSearchResult[] = [];
            // Depending on response status, allow or not for login
            if (response.status === 200) {
                // tslint:disable-next-line:no-console
                console.log("User Account response is", response.data);
                if(Array.isArray(response.data) && response.data.length){

                    const newResponseData:GroupSearchResult[] = response.data;      
                    Object.keys(newResponseData)
                          .map((key) => {
                                return Object.keys(newResponseData[key].members.users).map((key2) => {
                                    let obj = newResponseData[key].members.users[key2];
                                    if (obj && !(Object.keys(obj).length === 0 && obj.constructor === Object)){
                                        if(obj.userId===userId){
                                            subscribedGroups.push(newResponseData[key]);
                                        }
                                    }

                                    obj = newResponseData[key].invitationList.users[key2];
                                    if (obj && !(Object.keys(obj).length === 0 && obj.constructor === Object)){
                                        if(obj.userId===userId){
                                            invitationList.push(newResponseData[key]);
                                        }
                                    }

                                    return true;
                                });
                          });

                    payload ={
                        subscribedGroups: JSON.parse(JSON.stringify(subscribedGroups)),
                        invitationList: JSON.parse(JSON.stringify(invitationList))
                    };
                }else{
                    payload = initialState;
                }
                
                dispatch({ type: 'UPDATE_USER_ACCOUNT', payload });        
            }else {
                // TODO: CREATE ERROR HANDLERS
                // tslint:disable-next-line:no-console
                console.log("Error in axios");                
                dispatch({ type: 'UPDATE_USER_ACCOUNT', payload });
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