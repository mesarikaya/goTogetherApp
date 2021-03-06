import axios from "axios";
axios.defaults.withCredentials = true;
import { Dispatch } from "redux";
import { UpdateResponseStatusActionType } from '../types/action/updateResponseStatusActionType';
import ResponseStatus from '../types/userInterface/responseStatus';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/auth/" : "http://localhost:8080/api/auth/";

/**
 * Make account registration request
 * @param e HTML Form Event
 * @param formFields Registration Form input data
 */
export function sendAccountVerification(event: React.FormEvent<HTMLFormElement>, 
                                        formFields: {userName: string}) {
    
    if (event !== null) { event.preventDefault(); }

    // Set data to send with Post request
    const data = formFields;
    return ((dispatch: Dispatch<UpdateResponseStatusActionType>) => {
        return (axios.post(`${url}verify`, data, { 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
              },
              withCredentials: true
        }).then((response:any) => {
            
            let payloads: ResponseStatus = {
                type: "SUCCESS",
                message: "Request is in progress!"
            };

            // Depending on response status, allow or not for login
            if (response.status === 200) {

                const responseData = response.data;
                const responseMessage = responseData.message;
                const responseType = responseData.type;
                
                payloads = {
                    type: responseType,
                    message: responseMessage
                };

                return dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payloads });        
            }
            else {
                payloads = {
                    type: "FAILURE",
                    message: response.statusText
                };                

                return dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payloads });  
            }
        })
        .catch((error: any) => {
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

            return dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payloads }); 
        }));
    });
};