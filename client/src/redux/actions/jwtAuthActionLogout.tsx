import axios from "axios";
axios.defaults.withCredentials = true;
import { Dispatch } from "redux";
import { JwtAuthActionTypes }from '../types/action/jwtAuthActionType';
import { UpdateResponseStatusActionType } from '../types/action/updateResponseStatusActionType';
import { SecurityState } from '../types/system/securityState';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/auth/" : "http://localhost:8080/api/auth/";

/**
 * Make GET request and dipatch the image data to be shown via redux  
 * @param e HTML Form Event
 * @param params query parameters
 */
export function onLogoutUpdateAuth(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
                                   currentState: SecurityState) {
    
    if (event !== null) { event.preventDefault(); }
    
    const params = {
        userName: currentState.userName,
        token: currentState.token
    };

    const payload = {
        cookie: "authenticated cookie",
        loggedIn: false,
        userName: '',
        token: ""
    };

    return ((dispatch: Dispatch<JwtAuthActionTypes|UpdateResponseStatusActionType>) => {
        return (axios.get(`${url}logout`, { 
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer " + currentState.token,
                'Content-Type': 'application/json',
                Cache: "no-cache"
              },
              params,
              withCredentials: true
            // TODO: Change the response type from any to a proper one soon
        }).then((response:any) => {
            
            
            // tslint:disable-next-line: no-console
            console.log("Status is:" + response.status);
            // Depending on response status, allow or not for login
            if (response.status === 200) {
                dispatch({ type: 'AUTH_REQUEST', payload });
                const payloads = {
                    type: "SUCCESS",
                    message: "Log out is successful!"
                };
                dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payloads });   
            }
            else {

                dispatch({ type: 'AUTH_REQUEST', payload });

                const payloads = {
                    type: "FAILURE",
                    message: response.statusText
                };                
                dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payloads });  
            }
        }).catch((error: any) => {
            
            dispatch({ type: 'AUTH_REQUEST', payload });

            let payloads = {
                type: "FAILURE",
                message: "Server error"
            };

            if(error.response.status!==null || error.response.status!==undefined){
                if (error.response.status === 401) {
                    payloads = {
                        type: "FAILURE",
                        message: "Error: Wrong credentials or Unauthorized Action!"
                    };
                }else if(error.response.statusText!==null || error.response.statusText!==undefined){
                    payloads = {
                        type: "FAILURE",
                        message: error.response.statusText
                    };
                }
            }


            return dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payloads });  
        }));
    });
};