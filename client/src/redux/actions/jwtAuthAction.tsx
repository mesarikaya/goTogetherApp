import axios from "axios";
axios.defaults.withCredentials = true;
import { Dispatch } from "redux";
import { JwtAuthActionTypes }from '../types/action/jwtAuthActionType';
import { LoginFormFields } from 'src/redux/types/userInterface/loginFormFields';

// Set the API url for back end calls
const url = process.env.REACT_APP_NODE_ENV === 'production' ? "/api/auth/" : "http://localhost:8080/api/auth/";

/**
 * Make GET request and dipatch the image data to be shown via redux  
 * @param e HTML Form Event
 * @param formFields Login form input data
 */
export function UpdateAuth(event: React.FormEvent<HTMLFormElement>, formFields: LoginFormFields) {
    
    if (event !== null) { event.preventDefault(); }

    // Set data to send with Post request
    const data = formFields;
    return ((dispatch: Dispatch<JwtAuthActionTypes>) => {
        return (axios.post(`${url}login`, data, { 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: "no-cache"
              },
              withCredentials: true
            // TODO: Change the response type from any to a proper one soon
        }).then((response:any) => {
            
            let payload = { 
                cookie: "test cookies",
                loggedIn: false,
                userName: "guest",
                token: ''
             };

            // Depending on response status, allow or not for login
            if (response.status === 200) {

                payload = {
                    cookie: "authenticated cookie",
                    loggedIn: true,
                    userName: response.data.username,
                    token: response.data.token
                };

                dispatch({ type: 'SEND_LOGIN_REQUEST', payload });
            }
            else {

                // TODO: CREATE ERROR HANDLERS
                // tslint:disable-next-line:no-console
                console.log("Error in axios");
                dispatch({ type: 'SEND_LOGIN_REQUEST', payload });
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