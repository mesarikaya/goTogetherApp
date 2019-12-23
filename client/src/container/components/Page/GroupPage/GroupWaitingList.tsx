import * as React from 'react';

// Add styling related imports
import '../../../../stylesheets/css/cards/CardTable.css';

// Import the store and types
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import { GroupUser } from 'src/redux/types/userInterface/groupUser';
import { Table, Card, Button, ButtonToolbar } from 'react-bootstrap';
import { UpdateWaitingList } from 'src/redux/actions/UpdateWaitingList';


export interface Props {
    key: string;
    groupInfo: GroupSearchResult;
    userName: string;
    isUserInGroup: boolean;
    isUserOwnerInGroup: boolean;
    token: string;
    onUpdateWaitingList: typeof UpdateWaitingList;
}

class GroupWaitingList extends React.Component<Props,{}>{


    constructor(props:Props){
        super(props);
        this.handleOnAccept=this.handleOnAccept.bind(this);
        this.handleOnReject=this.handleOnReject.bind(this);
        this.createTable = this.createTable.bind(this);
    }

    public componentDidUpdate(oldProps: Props) {
        
        /*const newProps = this.props;
        if(oldProps.groupInfo !== newProps.groupInfo) {
            this.setState({ 
                groupInfo: this.props.groupInfo 
            });
        }*/
    }

    public handleOnAccept= async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        const userId = event.currentTarget.getAttribute('name');
        const groupId = this.props.groupInfo.id;
        if(userId && groupId){
            this.props.onUpdateWaitingList(event, this.props.groupInfo, groupId, userId, this.props.token, 'add');
        }
    }

    public handleOnReject= async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        const userId = event.currentTarget.getAttribute('name');
        const groupId = this.props.groupInfo.id;
        if(userId && groupId){
            this.props.onUpdateWaitingList(event, this.props.groupInfo, groupId, userId, this.props.token, 'delete');
        }
    }

    public createTable(data: GroupUser[]) {

        // tslint:disable-next-line: no-console
        console.log("Loading the data", data);
        const rows = [];

        for (const obj in data) {
            if (data.hasOwnProperty(obj)) {
                if(this.props.isUserInGroup){
                    if(this.props.isUserOwnerInGroup) {
                        rows.push(
                            <tr key={data[obj].userId}>
                                <td className="text-center">{data[obj].userName}</td>
                                <td className="text-center">{data[obj].address}</td>
                                <td className="text-center">
                                <ButtonToolbar className="text-center">
                                    <Button variant="info" size="sm" name={data[obj].userId} onClick={this.handleOnAccept}><i className="far fa-check-circle"/></Button>
                                    <Button variant="danger" size="sm" name={data[obj].userId} onClick={this.handleOnReject}><i className="far fa-times-circle"/></Button>
                                </ButtonToolbar>
                                </td>
                            </tr>
                        );
                    } else {
                        rows.push(
                            <tr key={data[obj].userId}>
                                <td className="text-center">{data[obj].userName}</td>
                                <td className="text-center"><i className="fas fa-eye"/></td>
                                <td/>
                            </tr>
                        );
                    }
                } else {
                    rows.push(
                        <tr key={data[obj].userId}>
                            <td className="text-center">{data[obj].userName}</td>
                            <td className="text-center"><i className="fas fa-lock"/></td>
                            <td/>
                        </tr>
                    );
                }
            }
        }

        return rows;
    }

    public render(){

        const tableRows = this.createTable(this.props.groupInfo.waitingList.users);
        
        return (
            <React.Fragment>
                <Card className="GroupWaitingListCard groupViewCardDeck">
                    <Card.Header>
                        <Card.Title className="card-header-text text-center">
                            Join Requests    
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive={true}>
                            <thead>
                                <tr>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Adress</th>
                                    <th className="text-center">Decision</th>
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

export default GroupWaitingList;



