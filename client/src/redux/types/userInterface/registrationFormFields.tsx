export interface RegistrationFormFields {
    userName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    streetName: string;
    houseNumber: string;
    city: string;
    zipcode: string;
    state: string;
    country: string;
    validated: boolean;
    hasPasswordMatch: boolean;
}