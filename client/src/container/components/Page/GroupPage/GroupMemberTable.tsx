import * as React from 'react';

// Add styling related imports
import '../../../../stylesheets/css/cards/CardTable.css';

// Import the store and types
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import { GroupUser } from 'src/redux/types/userInterface/groupUser';
import { Table, Card, Button } from 'react-bootstrap';


export interface Props {
    key: string;
    groupInfo: GroupSearchResult;
    userName: string;
    isUserInGroup: boolean;
    isUserOwnerInGroup: boolean;
}

class GroupMemberTable extends React.Component<Props,{}>{


    constructor(props:Props){
        super(props);
        this.createTable = this.createTable.bind(this);
    }

    public componentDidUpdate(oldProps: Props) {
        
        const newProps = this.props;
        if(oldProps.groupInfo !== newProps.groupInfo) {
            this.setState({ 
                groupInfo: this.props.groupInfo 
            });
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
                        if (this.props.userName === data[obj].userId){
                            rows.push(
                              <tr>
                                <td className="text-center">{data[obj].userName}</td>
                                <td className="text-center">{data[obj].owner ? 'Owner' : 'Member'}</td>
                                <td className="text-center"><Button variant="info" size="sm">Leave</Button></td>
                              </tr>
                            );
                        }else{
                            rows.push(
                                <tr>
                                  <td className="text-center">{data[obj].userName}</td>
                                  <td className="text-center">{data[obj].owner ? 'Owner' : 'Member'}</td>
                                  <td className="text-center">{data[obj].owner ? null : <Button variant="info" size="sm">Remove</Button>}</td>
                                </tr>
                            );
                        }
                    } else {
                        if (this.props.userName === data[obj].userId){
                            rows.push(
                                <tr>
                                  <td className="text-center">{data[obj].userName}</td>
                                  <td className="text-center">{data[obj].owner ? 'Owner' : 'Member'}</td>
                                  <td className="text-center"><Button variant="info" size="sm">Leave</Button></td>
                                </tr>
                            );
                        }else{
                            rows.push(
                                <tr>
                                    <td className="text-center">{data[obj].userName}</td>
                                    <td className="text-center">{data[obj].owner ? 'Owner' : 'Member'}</td>
                                    <td/>
                                </tr>
                            );
                        }
                    }
                } else {
                    rows.push(
                        <tr>
                            <td className="text-center">{data[obj].userName}</td>
                            <td className="text-center">{data[obj].owner ? 'Owner' : 'Member'}</td>
                            <td/>
                        </tr>
                    );
                }
            }
        }

        return rows;
    }

    public render(){

        const tableRows = this.createTable(this.props.groupInfo.members.users);
        return (
            <React.Fragment>
                {/* <!- Group Member Overview Card design --> */}
                <Card className="GroupMemberTableCard groupViewCardDeck">
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
                                    <th>Status</th>
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

export default GroupMemberTable;



