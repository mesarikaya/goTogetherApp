import axios from "axios";
axios.defaults.withCredentials = true;
import { Dispatch } from "redux";
import { RegistrationFormFields } from '../types/userInterface/registrationFormFields';;
import { UpdateResponseStatusActionType } from '../types/action/updateResponseStatusActionType';
import ResponseStatus from '../types/userInterface/responseStatus';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/auth/" : "http://localhost:8080/api/auth/";

/**
 * Make GET request and dipatch the image data to be shown via redux  
 * @param e HTML Form Event
 * @param formFields Login form input data
 */
export function registerAccount(event: React.FormEvent<HTMLFormElement>, formFields: RegistrationFormFields) {
    
    if (event !== null) { event.preventDefault(); }

    // Set data to send with Post request
    const data = formFields;
    return ((dispatch: Dispatch<UpdateResponseStatusActionType>) => {
        return (axios.post(`${url}register`, data, { 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
              },
              withCredentials: true
        }).then((response:any) => {
            
            let payload: ResponseStatus = {
                type: "success",
                message: "Request is in progress!"
            };

            // Depending on response status, allow or not for login
            if (response.status === 200) {

                const responseData = response.data;
                const responseMessage = responseData.message;
                const responseType = responseData.type;
                
                payload = {
                    type: responseType,
                    message: responseMessage
                };

                dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payload });        
            }
            else {
                // TODO: CREATE ERROR HANDLERS
                // tslint:disable-next-line:no-console
                console.log("Error in axios");
                payload = {
                    type: "success",
                    message: "Error: Request could not be processed!"
                };

                dispatch({ type: 'UPDATE_RESPONSE_STATUS_REQUEST', payload }); 
            }
            // TODO: PUT THE RIGHT type for error inside the catch
        })
        .catch((error: any) => {
            // handle error
            // tslint:disable-next-line:no-console
            console.log("Error in get is:", error.response);
            throw (error);
        }));
       
    });
};