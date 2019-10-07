import * as React from 'react';
import { connect } from 'react-redux';
import { Form, InputGroup, FormLabel, Button } from 'react-bootstrap';

// Add styling related imports
import '../../../stylesheets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../stylesheets/css/GroupSearch.css';

import { GroupSearchFormFields } from '../../../redux/types/userInterface/groupSearchFormFields';
import InputRange from '../Buttons/InputRange';
import { SearchGroups } from '../../../redux/actions/groupSearchAction';
import { submitForm } from '../../utilities/submitForm';

export interface Props {
    formFields: GroupSearchFormFields;
    onSubmit: typeof SearchGroups;
};

export interface State {
    formFields: GroupSearchFormFields;
};

class GroupSearchForm extends React.Component<Props, State> {
    
    public state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            formFields: {
                origin: '',
                originRange: 2,
                destination: '',
                destinationRange: 2,
                validated: false
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // TODO: Need to FIND A WAY TO USE THE RIGHT TYPE WITHOUT ERROR React.ChangeEvent<HTMLInputElement>
    public handleChange = async (event: any): Promise<void> => {

        // tslint:disable-next-line: no-console
        console.log("EVent handler on change: ", event.currentTarget.value);
        
        // read the form input fields
        const formFields = { ...this.state.formFields };
        formFields[event.currentTarget.name] = event.currentTarget.value;
        this.setState({
            formFields
        });
    }

    public handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // TODO: Add button disable
        submitForm(event);
        
        this.setState({ formFields: {
            ...this.state.formFields,
            validated: true
        }});

        // TODO: Deactivate Button -- disable
        
        // MAKE AN AJAX CALL
        this.props.onSubmit(event, this.state.formFields);

        // TODO: VALIDATE ON THE REST CONTROLLER AND RETURN ERROR OR THE SEARCH STATUS AND SAVE COOKIE

    };

    public render() {

        const validated = this.state.formFields.validated;
        return (
          <React.Fragment>

            <div className="searchForm">
                                                
                <h1 className="joinAGroupText">Join<span> a group</span>?</h1>
                <p className="joinAGroupSubText">Search with ease based on the origin and destination radius</p>
                
                <Form name="groupSearchForm" className="groupSearchFormValidation" 
                noValidate={true} validated = {validated} onSubmit = {this.handleSubmit}>
                    <Form.Row> 
                        <InputGroup className="justify-content-center">
                            {/* <!- Origin Input Group --> */}
                            <Form.Group className="originInputFormGroup" controlId="originAdressInputControl">
                                {/* <!- Origin Input text --> */}
                                <Form.Label className="originLabel" ><strong>Origin</strong></Form.Label>
                                <Form.Control 
                                    type="input"
                                    id={"origin"}
                                    name={"origin"}
                                    placeholder="Address/zip code" 
                                    required={true}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            {/* <!- Origin Input Range Group --> */}
                            <Form.Group controlId="originAdressRangeControl">
                                {/* <!- Origin Range --> */}
                                <FormLabel className="originRangeDropdownLabel" htmlFor="originRangeDropDownMenuButton">
                                <strong>Range</strong>
                                </FormLabel>
                                <InputRange value={0}/>
                            </Form.Group>
                        </InputGroup>
                    
                        <InputGroup className="justify-content-center">
                            {/* <!- Destination Input Group --> */}
                            <Form.Group className="destinationInputFormGroup" controlId="destinationAdressInputControl">
                                {/* <!- Destination Input text --> */}
                                <Form.Label className="destinationLabel" >
                                    <strong>Destination</strong>
                                </Form.Label>
                                <Form.Control 
                                    type="input"
                                    id={"destination"}
                                    name={"destination"}
                                    placeholder="Address/zip code" 
                                    required={true}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            {/* <!- Destination Input Range Group --> */}
                            <Form.Group controlId="destinationAdressRangeControl">
                                {/* <!- Destination Range --> */}
                                <FormLabel className="destinationRangeDropdownLabel" htmlFor="destinationRangeDropDownMenuButton">
                                    <strong>Range</strong>
                                </FormLabel>
                                <InputRange value={2}/>
                            </Form.Group>
                        </InputGroup>
                    
                    </Form.Row>
                    <Button size="lg" type="submit"> Search </Button>
                </Form>
            </div>
          </React.Fragment>
        );
  }
}


const mapDispatchToProps = (dispatch: any) => {
    return {
        onSubmit: (
            e: React.FormEvent<HTMLFormElement>, 
            formFields: GroupSearchFormFields
            ) => dispatch(SearchGroups(e, formFields))
    }
}

export default connect(null, mapDispatchToProps)(GroupSearchForm);
