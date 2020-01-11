import axios from "axios";
axios.defaults.withCredentials = true; // to make use of jwt
import { Dispatch } from "redux";
import { GroupSearchActionType }from '../types/action/groupSearchActionType';
import { GroupSearchFormFields } from 'src/redux/types/userInterface/groupSearchFormFields';
import { GroupSearchResult } from '../types/userInterface/groupSearchResult';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/v1/" : "http://localhost:8080/api/v1/";

/**
 * Make GET request and dipatch the image data to be shown via redux  
 * @param e HTML Form Event
 * @param formFields Login form input data
 */
export function SearchGroups(event: React.FormEvent<HTMLFormElement> | null, 
                             formFields: GroupSearchFormFields,
                             existingGroups: GroupSearchResult[],
                             page: number,
                             token: string) {
    
    if (event !== null) { 
        event.preventDefault();
        page = 0; 
    }

    // Set data to send with Post request
    const data = formFields;
    const params = new URLSearchParams();
    const quantity = 9;
    params.append('origin', data.origin);
    params.append('destination', data.destination);
    params.append('originRange', data.originRange.toString());
    params.append('destinationRange', data.destinationRange.toString());
    params.append('page', page.toString());
    params.append('size', quantity.toString());
    
    return ((dispatch: Dispatch<GroupSearchActionType>) => {
        return (axios.get(`${url}groups`, {
            headers: {
                Authorization: "Bearer " + token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
            },
            params,
            withCredentials: true
        }).then((response) => {

            let initialState: {groups: GroupSearchResult[], page: number} = {
                groups: [],
                page: 0
            };

            if (event === null) { 
                initialState = {
                    groups: existingGroups,
                    page
                }; 
            }

            let payload = initialState;

            // Depending on response status, allow or not for login
            if (response.status === 200) {
                if(Array.isArray(response.data) && response.data.length){
                    const newResponseData = response.data;
                    const prevGroups:GroupSearchResult[] = [];
                    for(const key in initialState.groups){
                        if (initialState.groups.hasOwnProperty(key)){
                            prevGroups.push(initialState.groups[key]);
                        }
                    }

                    Object.keys(newResponseData)
                          .map((key) => (prevGroups.push(newResponseData[key])));
                    payload ={
                        groups: JSON.parse(JSON.stringify(prevGroups)),
                        page: ++page,
                    }; 
                }else{
                    payload ={
                        groups: initialState.groups,
                        page: 0,
                    }; 
                }
                
                dispatch({ type: 'UPDATE_GROUP_RESULTS', payload });         
            }else {
                // TODO: CREATE ERROR HANDLERS
                dispatch({ type: 'UPDATE_GROUP_RESULTS', payload });
            }
            // TODO: PUT THE RIGHT type for error inside the catch
        })
        .catch((error: any) => {
            // TODO: CREATE ERROR HANDLERS
            // tslint:disable-next-line:no-console
            console.log("Error in get is:", error.response );
            throw (error);
        }));   
    });
};