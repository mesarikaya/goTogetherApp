import axios from "axios";
axios.defaults.withCredentials = true; // to make use of jwt
import { Dispatch } from "redux";
import { GroupSearchFormFields } from 'src/redux/types/userInterface/groupSearchFormFields';
import { UserSearchResult } from '../types/userInterface/userSearchResult';
import { UserSearchActionType } from '../types/action/userSearchActionType';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/v1/" : "http://localhost:8080/api/v1/";

/**
 * Make GET request and dipatch the image data to be shown via redux  
 * @param e HTML Form Event
 * @param formFields Login form input data
 */
export function SearchUsers(event: React.FormEvent<HTMLFormElement> | null, 
                            formFields: GroupSearchFormFields,
                            existingUsers: UserSearchResult[],
                            page: number,
                            token: string) {
    
    if (event !== null) { 
        event.preventDefault();
        page = 0; 
    }
    
    // tslint:disable-next-line:no-console
    console.log('REDUX SEARCH GROUP ACTION IS IN PROGRESS', 'Requesting: ', event);
    // tslint:disable-next-line:no-console
    console.log('Page number is: ', page);
    // Set data to send with Post request
    const data = formFields;
    const params = new URLSearchParams();
    const quantity = 3;
    params.append('origin', data.origin);
    params.append('destination', data.destination);
    params.append('originRange', data.originRange.toString());
    params.append('destinationRange', data.destinationRange.toString());
    params.append('page', page.toString());
    params.append('size', quantity.toString());

    // tslint:disable-next-line:no-console
    console.log('environment is', process.env.NODE_ENV);
    
    return ((dispatch: Dispatch<UserSearchActionType>) => {
        return (axios.get(`${url}users`, {
            headers: {
                Authorization: "Bearer " + token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
            },
            params,
            withCredentials: true
        }).then((response) => {
            
            const initialState: {users: UserSearchResult[], page: number} = {
                users: existingUsers,
                page
            };

            let payload = initialState;
            // tslint:disable-next-line:no-console
            console.log("SENDING TO THE USER SEARCH REDUCER", response);
            // Depending on response status, allow or not for login
            if (response.status === 200) {
                // tslint:disable-next-line:no-console
                console.log("response is", response.data);
                if(Array.isArray(response.data) && response.data.length){
                    const newResponse = response.data;
                    // Flatten the userlist response
                    const newResponseData: UserSearchResult[] = [];
                    for(const key in newResponse){
                        if (newResponse.hasOwnProperty(key)){
                            for(const secondKey in newResponse[key]){
                                if (newResponse.hasOwnProperty(secondKey)){
                                    newResponseData.push(newResponse[key][secondKey]);
                                }
                            }
                        }
                    }

                    // tslint:disable-next-line:no-console
                    console.log("New flattened data for the user", newResponseData);
                    
                    const prevUsers: UserSearchResult[] = [];
                    for(const key in existingUsers){
                        if (existingUsers.hasOwnProperty(key)){
                            prevUsers.push(existingUsers[key]);
                        }
                    }
                    // tslint:disable-next-line: no-console
                    console.log("New response is: ", newResponseData);
                    
                    // tslint:disable-next-line: no-console
                    console.log("Existing group: ", prevUsers);
    
                    Object.keys(newResponseData)
                          .map((key) => (prevUsers.push(newResponseData[key])));
    
                    // tslint:disable-next-line: no-console
                    console.log("Final group: ", prevUsers);
                    payload ={
                        users: JSON.parse(JSON.stringify(prevUsers)),
                        page: ++page,
                    }; 
                }else{
                    // tslint:disable-next-line:no-console
                    console.log("setting page to 0");
                    payload ={
                        users: existingUsers,
                        page: 0,
                    }; 
                }
                                
                // tslint:disable-next-line:no-console
                console.log("SENDING TO THE REDUCER");
                dispatch({ type: 'SEARCH_USER_REQUEST', payload })         
            }else {
                // TODO: CREATE ERROR HANDLERS
                // tslint:disable-next-line:no-console
                console.log("Error in axios");
                dispatch({ type: 'SEARCH_USER_REQUEST', payload });
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