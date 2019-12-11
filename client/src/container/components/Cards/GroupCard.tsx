import * as React from 'react';

// Import types
import { GroupUser } from 'src/redux/types/userInterface/groupUser';
// import { GroupCardFields } from 'src/redux/types/userInterface/groupCardFields';

// Styling imports
import { Card } from 'react-bootstrap';
import '../../../stylesheets/css/cards/groupCard.css';
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props {
    key: string,
    name: string;
    groupDetails: any;
    members: GroupUser;
    group: GroupSearchResult
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}

class GroupCard extends React.Component<Props & RouteComponentProps < PathProps >>{

    constructor(props: Props & RouteComponentProps < PathProps >){
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    public handleOnClick = async (event: React.MouseEvent): Promise<void> =>{

        event.preventDefault();

        // Set the selected group item to the local storage
        window.localStorage.setItem('selectedGroupCard', JSON.stringify(this.props.group));
        this.props.history.push('/group');
    }

    public render(){
        return (
            <React.Fragment>
                {/* <!- Group Card design --> */}
                <Card className="groupCard" onClick={this.handleOnClick}>
                    <Card.Header><Card.Title className="card-header-text">Group: {this.props.name}</Card.Title></Card.Header>
                    <Card.Body>
                        <Card.Text className="card-text">
                        {this.props.groupDetails.originCity}, {this.props.groupDetails.originZipCode} (+/-{this.props.groupDetails.originRange} km)
                        </Card.Text>
                        <Card.Text className="card-text">
                            <i className="fas fa-angle-double-down fa-7x"/>
                        </Card.Text>            
                        <Card.Text className="card-text">
                        {this.props.groupDetails.destinationCity}, {this.props.groupDetails.originZipCode} (+/-{this.props.groupDetails.destinationRange} km)
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br />
            </React.Fragment>
        );
    }
}

export default withRouter(GroupCard);