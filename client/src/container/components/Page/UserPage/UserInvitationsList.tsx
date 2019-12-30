import * as React from 'react';

// Add styling related imports
import '../../../../stylesheets/css/cards/CardTable.css';

// Import the store and types
import { GroupSearchResult } from '../../../../redux/types/userInterface/groupSearchResult';
import { Table, Card, Button, ButtonToolbar } from 'react-bootstrap';
import { updateGroupMember } from 'src/redux/actions/GroupPage/updateGroupMemberAction';
import { withRouter } from 'react-router-dom';
import { updateSelectedGroup } from 'src/redux/actions/GroupPage/updateSelectedGroupAction';

export interface Props {
    key: string;
    invitationsList: GroupSearchResult[];
    userName: string;
    token: string;
    onUpdateMember: typeof updateGroupMember;
    updateSelectedGroup: typeof updateSelectedGroup;
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}

class UserInvitationsList extends React.Component<Props&PathProps,{}>{

    constructor(props:Props&PathProps){
        super(props);
        this.createTable = this.createTable.bind(this);
    }

    public handleOnAccept = async (event: React.MouseEvent<HTMLButtonElement>, 
                                   currentGroup: GroupSearchResult): Promise<void> => {
        event.preventDefault();
        const groupId = currentGroup.id;
        const userId = this.props.userName;

        // tslint:disable-next-line: no-console
        console.log("Groupid is: " + groupId);
        if(userId && groupId){
            this.props.onUpdateMember(event, currentGroup, groupId, userId, this.props.token, 'add');
        }
    }

    public handleOnReject = async (event: React.MouseEvent<HTMLButtonElement>, 
                                   currentGroup: GroupSearchResult): Promise<void> => {
        event.preventDefault();
        const groupId = currentGroup.id;
        const userId = this.props.userName;
        if(userId && groupId){
           this.props.onUpdateMember(event, currentGroup, groupId, userId, this.props.token, 'delete');
        }
    }

    public handleOnClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, 
                                  group: GroupSearchResult): Promise<void> =>{
        event.preventDefault();
        this.props.updateSelectedGroup(event, group, group.id, this.props.token);
        this.props.history.push('/group');
    }

    public createTable(data: GroupSearchResult[]) {

        const rows = [];
        for (const obj in data) {
            if (data.hasOwnProperty(obj)) {
                rows.push(
                    <tr key={data[obj].id}>
                        <td align="center" 
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => this.handleOnClick(e, data[obj])}>{data[obj].name}</td>
                        <td className="text-center align-middle">
                            <ButtonToolbar className="buttonToolbar">
                                <Button variant="info" size="sm" 
                                        // tslint:disable-next-line: jsx-no-lambda
                                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.handleOnAccept(e, data[obj])}>
                                    <i className="far fa-check-circle"/>
                                </Button>
                                <Button variant="danger" size="sm" 
                                        // tslint:disable-next-line: jsx-no-lambda
                                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.handleOnReject(e, data[obj])}>
                                    <i className="far fa-times-circle"/>
                                </Button>
                            </ButtonToolbar>
                        </td>
                    </tr>
                );
            }
        }

        return rows;
    }

    public render(){

        const tableRows = this.createTable(this.props.invitationsList); 
        return (
            <React.Fragment>
                <Card className="GroupWaitingListCard groupViewCardDeck">
                    <Card.Header>
                        <Card.Title className="card-header-text text-center">
                            Invites    
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive={true}>
                            <thead>
                                <tr>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows}
                            </tbody> 
                        </Table>
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default withRouter(UserInvitationsList);



