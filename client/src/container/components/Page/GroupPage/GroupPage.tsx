import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from "react-router";

// Creaate history variable to be able to go back and forth within routes
//  import createBrowserHistory from 'history/createBrowserHistory';
// const history = createBrowserHistory({ forceRefresh: true });

// Add styling related imports
import '../../../../stylesheets/css/cards/GroupPage.css';

// Import store and types
import { store } from 'src/redux/store';
import { StoreState } from 'src/redux/types/storeState';
import NavigationBar from '../../Navigation/NavigationBar';
import { LoginFormFields } from 'src/redux/types/userInterface/loginFormFields';
import { isNullOrUndefined } from 'util';
import GroupMemberTable from './GroupMemberTable';
import { GroupUser } from '../../../../redux/types/userInterface/groupUser';
import GroupWaitingList from './GroupWaitingList';
import { CardDeck, Button } from 'react-bootstrap';
import { SearchUsers } from 'src/redux/actions/userSearchAction';
import GroupSearchForm from '../../Forms/GroupSearchForm';
import { UserSearchResult } from 'src/redux/types/userInterface/userSearchResult';
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import { GroupSearchFormFields } from 'src/redux/types/userInterface/groupSearchFormFields';
import UserTableList from '../../Tables/UserTableList';


/** CREATE Prop and State interfaces to use in the component */
// Set the default Props
export interface GroupProps{
    groupInfo:GroupSearchResult;
    userSearchFormFields: GroupSearchFormFields;
    loginFormFields: LoginFormFields;
    onSubmit: typeof SearchUsers;
}

export interface GroupState{
    groupInfo: GroupSearchResult;
    userSearchFormFields: GroupSearchFormFields;
    storeState: StoreState;
    isUserInGroup: boolean;
    isUserOwnerInGroup: boolean;
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}


class GroupPage extends React.Component<GroupProps & RouteComponentProps < PathProps >, GroupState>{

    public state: GroupState;

    constructor(props: GroupProps& RouteComponentProps < PathProps >){

        super(props);
        const currAppState = store.getState();
        const localStorageSelectedGroup = window.localStorage.getItem('selectedGroupCard');

        // tslint:disable-next-line: no-console
        console.log("Local storage selected group:", localStorageSelectedGroup);
        let selectedGroup:GroupSearchResult= {
            id: '',
            name: '',
            groupDetails: {
                originCity: '',
                originZipCode: '',
                originRange: 2,
                destinationCity: '',
                destinationZipCode: '',
                destinationRange: 2 
            },
            members: {
                users: []
            },
            waitingList:{
                users: []
            }
        };

        if (!isNullOrUndefined(localStorageSelectedGroup)){
            selectedGroup = JSON.parse(localStorageSelectedGroup);
        }
        
        const groupUser = this.isUserInGroup(selectedGroup.members.users);
        const groupOwner = this.isOwnerInGroup(selectedGroup.members.users);
        // tslint:disable-next-line: no-console
        console.log("Group page currentAppState:", currAppState);

        /* const userResults: {users: UserSearchResult[], page: number} = {
            users: [],
            page: 0
        }; */

        this.state = {
            groupInfo: selectedGroup,
            userSearchFormFields: {
                origin: '',
                originRange: 2,
                destination: '',
                destinationRange: 2
            },
            storeState: currAppState,
            isUserInGroup:groupUser,
            isUserOwnerInGroup: groupOwner
        }

        this.loadMore = this.loadMore.bind(this);
        this.handleUserSearchFormUpdate = this.handleUserSearchFormUpdate.bind(this);
    }

    public componentDidUpdate(oldProps: GroupProps& RouteComponentProps < PathProps >) {
        
        // tslint:disable-next-line: no-console
        console.log("Inside componentDidUpdate", store.getState());

        const newProps = this.props;
        if(oldProps.groupInfo !== newProps.groupInfo) {
            this.setState({ 
                groupInfo: this.props.groupInfo 
            });
        }

        const currAppState = store.getState();
        if(this.state.storeState !== currAppState) {
            // tslint:disable-next-line: no-console
            console.log("Inside componentDidUpdate2", store.getState());
            this.setState({ 
                storeState: currAppState
            });
        }
    }

    public isUserInGroup(data:GroupUser[]) {
        const isUserInGroup = data.some((obj:GroupUser) => obj.userId===store.getState().system.userName);
        return isUserInGroup;
    } 

    public isOwnerInGroup(data:GroupUser[]) {
        const isOwnerInGroup = data.some((obj:GroupUser) => obj.owner && obj.userId===store.getState().system.userName);
        return isOwnerInGroup;
    }

    public loadMore = async (event: any): Promise<void> => {     
        this.props.onSubmit(null, 
                            this.state.userSearchFormFields, 
                            this.state.storeState.userSearchResults.users,
                            this.state.storeState.userSearchResults.page,
                            this.state.storeState.system.token);
    }

    public handleUserSearchFormUpdate = (formFields: GroupSearchFormFields): void => {
        this.setState({
            userSearchFormFields: formFields
        });
    }

    public render() {
        
        const userSearchResult = this.state.storeState.userSearchResults.users;
        return (
            <div className="GroupPage">
                <NavigationBar loginFormFields={this.props.loginFormFields} />
                <div className="container px-0 mx-auto">
                    <h2 className="text-center">                                
                        {this.state.groupInfo.name}: <span>
                                                        {this.state.groupInfo.groupDetails.originCity}, {this.state.groupInfo.groupDetails.originZipCode}
                                                        <i className="fas fa-angle-double-right fa-3x"/><i className="fas fa-angle-double-right fa-3x"/> 
                                                        {this.state.groupInfo.groupDetails.destinationCity},    
                                                        {this.state.groupInfo.groupDetails.originZipCode} 
                                                        {this.state.isUserOwnerInGroup && this.state.isUserInGroup ? <Button variant="info" size="sm">Delete Group</Button>: null}
                                                     </span>
                    </h2>
                    <CardDeck>
                        <GroupMemberTable key={this.state.groupInfo.id} 
                                          groupInfo={this.state.groupInfo}
                                          userName={this.state.storeState.system.userName}
                                          isUserInGroup={this.state.isUserInGroup}
                                          isUserOwnerInGroup={this.state.isUserOwnerInGroup}/>

                        <GroupWaitingList key={this.state.groupInfo.id} 
                                          groupInfo={this.state.groupInfo}
                                          userName={this.state.storeState.system.userName}
                                          isUserInGroup={this.state.isUserInGroup}
                                          isUserOwnerInGroup={this.state.isUserOwnerInGroup}/>
                    </CardDeck>
                </div>
                <div className="container mx-auto my-auto align-items-center">
                    <div className="row justify-content-center">
                        <div className="searchForm">                                  
                            <h1 className="joinAGroupText text-center">Find a member?</h1>
                            <p className="joinAGroupSubText text-center">Search with ease based on the origin and destination radius</p>
                            <GroupSearchForm 
                                formFields={this.state.userSearchFormFields}
                                page={this.state.storeState.userSearchResults.page}
                                token={this.state.storeState.system.token} 
                                updateSearchFormFields={this.handleUserSearchFormUpdate}
                                onSubmit={this.props.onSubmit}
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto my-auto">                       
                    {Object.keys(userSearchResult).length>0 ? (
                    <div>
                        <UserTableList userList={this.state.storeState.userSearchResults.users} />
                       {this.state.storeState.userSearchResults.page !== 0 ? 
                            <Button type="button" onClick={this.loadMore}> Load More... </Button>: null
                       }
                    </div>): null
                    }        
                </div>
            </div>
        );
    }
}

// Create mapToState and mapDispatch for Redux
const mapStateToProps = (
    state: GroupState, 
    OwnProps: GroupProps & RouteComponentProps<PathProps>
    ) => {
    return {
        groupInfo: state.groupInfo,
        storeState: state.storeState
    }
}

// TODO: Add user search dispatch
const mapDispatchToProps = (dispatch: any) => {
    return {
        onSubmit: (
            e: React.FormEvent<HTMLFormElement>, 
            formFields: GroupSearchFormFields,
            existingUsers: UserSearchResult[],
            page: number,
            token: string,
        ) => dispatch(SearchUsers(e, formFields, existingUsers, page, token))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupPage));
