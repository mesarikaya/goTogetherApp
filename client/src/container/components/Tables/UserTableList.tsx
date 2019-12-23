import * as React from 'react';

// Import types
import { UserSearchResult } from 'src/redux/types/userInterface/userSearchResult';

// Styling imports
import { Card, Button, Table } from 'react-bootstrap';
import '../../../stylesheets/css/cards/groupCard.css';
import { withRouter, RouteComponentProps } from 'react-router';
import { UpdateWaitingList } from 'src/redux/actions/UpdateWaitingList';
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';

interface Props {
    groupInfo: GroupSearchResult;
    userList: UserSearchResult[];
    token: string;
    onInviteUser: typeof UpdateWaitingList;
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}


class UserTableList extends React.Component<Props & RouteComponentProps < PathProps >>{

    constructor(props: Props & RouteComponentProps < PathProps >){
        super(props);
        this.createTable = this.createTable.bind(this);
        this.handleOnInviteUser = this.handleOnInviteUser.bind(this);
    }

    public createTable(data: UserSearchResult[]) {

        // tslint:disable-next-line: no-console
        console.log("Loading the data", data);
        const rows = [];
        for (const obj in data) {
            if (data.hasOwnProperty(obj)) {
                rows.push(
                    <tr>
                      <td className="text-center">{data[obj].firstName + " " + data[obj].middleName + "."}</td>
                      <td className="text-center">{data[obj].surname}</td>
                      <td className="text-center">{data[obj].userName}</td>
                      <td className="text-center">{data[obj].address}</td>
                      <td className="text-center"><Button variant="info" size="sm" name={data[obj].userName} onClick={this.handleOnInviteUser}>Invite</Button></td>
                    </tr>
                );
            }
        }

        return rows;
    }

    
    public handleOnInviteUser = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {

        event.preventDefault();
        const userId = event.currentTarget.getAttribute('name');
        const groupId = this.props.groupInfo.id;
        if(userId && groupId){
            this.props.onInviteUser(event, this.props.groupInfo, groupId, userId, this.props.token, 'add');
        }
    }

    public render(){
        
        const tableRows = this.createTable(this.props.userList);
        return (
            <React.Fragment>
                {/* <!- USer List Card design --> */}
                <Card className="UserListCard">
                    <Card.Header>
                        <Card.Title className="card-header-text text-center">
                            Members
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive={true}>
                            <thead className="text-center">
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>username</th>
                                    <th>Adress</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                    {tableRows}
                            </tbody> 
                        </Table>
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default withRouter(UserTableList);