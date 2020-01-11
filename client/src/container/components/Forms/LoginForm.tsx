import * as React from 'react';
import Switch from "react-switch";

// Add styling related imports
import '../../../stylesheets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../stylesheets/css/login.css';

// Add types
import { UpdateAuth } from '../../../redux/actions/jwtAuthAction';
import { updateUserAccount } from '../../../redux/actions/UserPage/updateUserAccountAction';
import { LoginFormFields } from '../../../redux/types/userInterface/loginFormFields';
import { Form, InputGroup } from 'react-bootstrap';
import { AppState } from 'src/redux/reducers/rootReducer';

export interface Props {
    isLoading: boolean;
    storeState: AppState;
    loginFormFields: LoginFormFields;
    onLoginSubmit: typeof UpdateAuth;
    onGetUserAccountDetails: typeof updateUserAccount;
};

export interface State {
    isLoading: false;
    loginFormFields: LoginFormFields;
};

class LoginForm extends React.Component<Props, State> {
    
    public state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            loginFormFields: {
                userName: '',
                password: '',
                rememberMe: false,
                validated: false
            }
        };

        this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleRememberMeChange(checked: boolean) {
        this.setState({ loginFormFields: {
                ...this.state.loginFormFields,
                rememberMe: checked
            }
        });
    }

    // TODO: Need to FIND A WAY TO USE THE RIGHT TYPE WITHOUT ERROR React.FormEvent<HTMLInputElement>
    public handleChange = async (event: any): Promise<void> => {

        // read the form input fields
        const loginFormFields = { ...this.state.loginFormFields };
        loginFormFields[event.currentTarget.name] = event.currentTarget.value;
        this.setState({
            loginFormFields
        });
    }

    public handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // TODO: Add button disable
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.setState({ loginFormFields: {
            ...this.state.loginFormFields,
            validated: true
        }});

        // TODO: Deactivate Button disable
        
        // MAKE AN AJAX CALL
        this.props.onLoginSubmit(event, this.state.loginFormFields);
    };

    public render() {

        const validated = this.state.loginFormFields.validated;
        return (
            <React.Fragment>
                <div className="container mb-2 modalContainer mx-auto loginFormContainer">
                    <div className="row-fluid">
                        <Form name="loginForm" 
                              className="needsLoginFormValidation"
                              noValidate={true}
                              validated = {validated}
                              onSubmit = {this.handleSubmit}>

                            <div className="error" />

                            <Form.Row className="mt-4">
                                <InputGroup className="LoginFormInputGroup">
                                    <Form.Control
                                        required={true}
                                        type="email"
                                        id={"username"}
                                        name={"username"}
                                        placeholder="username"
                                        onChange={this.handleChange}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text>
                                            <i className="fas fa-user-shield" />
                                        </InputGroup.Text>
                                    </InputGroup.Append>
                                    <Form.Control.Feedback type="invalid"
                                        className="invalid-feedback usernameError text-center">
                                        Invalid username!
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Row>

                            <Form.Row className="mt-1">
                                <InputGroup  >
                                    <Form.Control
                                        required={true}
                                        type="password"
                                        id={"password"}
                                        name={"password"}
                                        placeholder="password"
                                        onChange={this.handleChange}
                                    />
                                    <InputGroup.Append>
                                        <div className="input-group-text">
                                            <i className="far fa-eye" />
                                        </div>
                                    </InputGroup.Append>
                                    <Form.Control.Feedback type="invalid"
                                        className="invalid-feedback passwordError text-center">
                                        Invalid password!
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Row>

                            <div className="form-row mt-1 mb-1">
                                <label className={"my-auto"}>
                                    <Switch
                                        onChange={this.handleRememberMeChange}
                                        checked={this.state.loginFormFields.rememberMe}
                                        offColor={"#f46950"}
                                    />
                                </label>
                                <span className="my-auto"><a className="rememberMeText d-flex ml-auto my-auto">Remember me</a></span>
                                <a className="helpText d-flex ml-auto my-auto" href="/loginHelp">Need help?</a>
                            </div>

                            <div className="col text-center my-auto">
                                <button className="btn btn-primary submitButton" type="submit">
                                    Submit
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        );
  }
}

export default LoginForm;
