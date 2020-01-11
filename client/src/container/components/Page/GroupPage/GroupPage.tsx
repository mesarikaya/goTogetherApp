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
import NavigationBar from '../../Navigation/NavigationBar';
import { LoginFormFields } from 'src/redux/types/userInterface/loginFormFields';
import GroupMemberTable from './GroupMemberTable';
import { GroupUser } from '../../../../redux/types/userInterface/groupUser';
import GroupWaitingList from './GroupWaitingList';
import { CardDeck, Button } from 'react-bootstrap';
import { SearchUsers } from '../../../../redux/actions/userSearchAction';
import GroupSearchForm from '../../Forms/GroupSearchForm';
import { UserSearchResult } from '../../../../redux/types/userInterface/userSearchResult';
import { GroupSearchResult } from '../../../../redux/types/userInterface/groupSearchResult';
import { GroupSearchFormFields } from '../../../../redux/types/userInterface/groupSearchFormFields';
import UserTableList from '../../Tables/UserTableList';
import { updateGroupMember } from '../../../../redux/actions/GroupPage/updateGroupMemberAction';
import { updateWaitingList } from '../../../../redux/actions/GroupPage/updateWaitingListAction';
import { updateGroup } from '../../../../redux/actions/GroupPage/updateGroupAction';
import { updateInvitationsList } from '../../../../redux/actions/GroupPage/updateInvitationsListAction';
import { updateUserAccount } from '../../../../redux/actions/UserPage/updateUserAccountAction';
import { UpdateAuth } from '../../../../redux/actions/jwtAuthAction';
import { RegistrationFormFields } from 'src/redux/types/userInterface/registrationFormFields';
import { registerAccount } from 'src/redux/actions/registerAccountAction';
import { AppState } from 'src/redux/reducers/rootReducer';

/** CREATE Prop and State interfaces to use in the component */
// Set the default Props
export interface GroupProps{
    isLoading: boolean;
    groupInfo: GroupSearchResult;
    userSearchFormFields: GroupSearchFormFields;
    loginFormFields: LoginFormFields;
    registrationFormFields: RegistrationFormFields;
    onLoginSubmit: typeof UpdateAuth;
    onRegistrationSubmit: typeof registerAccount;
    onSubmit: typeof SearchUsers;
    onUpdateMember: typeof updateGroupMember;
    onUpdateWaitingList: typeof updateWaitingList;
    onUpdateInvitationsList: typeof updateInvitationsList;
    onGroupDelete: typeof updateGroup;
    onGetUserAccountDetails: typeof updateUserAccount;
}

export interface GroupState{
    groupInfo: GroupSearchResult;
    userSearchFormFields: GroupSearchFormFields;
    storeState: AppState;
    isUserInGroup: boolean;
    isUserOwnerInGroup: boolean;
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}

class GroupPage extends React.Component<GroupProps & RouteComponentProps<PathProps>, GroupState>{

    public state: GroupState;

    constructor(props: GroupProps& RouteComponentProps<PathProps>){

        super(props);
        const currAppState:AppState = store.getState();
        const selectedGroup:GroupSearchResult = currAppState.selectedGroup; 
        
        this.state = {
            groupInfo: selectedGroup,
            userSearchFormFields: {
                origin: '',
                originRange: 2,
                destination: '',
                destinationRange: 2
            },
            storeState: currAppState,
            isUserInGroup: this.isUserInGroup(selectedGroup.members.users),
            isUserOwnerInGroup: this.isOwnerInGroup(selectedGroup.members.users)
        }

        this.loadMore = this.loadMore.bind(this);
        this.handleUserSearchFormUpdate = this.handleUserSearchFormUpdate.bind(this);
        this.handleJoinRequest = this.handleJoinRequest.bind(this);
        this.handleRejectJoinRequest = this.handleRejectJoinRequest.bind(this);
        this.handleGroupDeleteRequest = this.handleGroupDeleteRequest.bind(this);
    }

    public componentDidUpdate(oldProps: GroupProps& RouteComponentProps < PathProps >) {
        
        const currAppState = store.getState();
        const selectedGroup:GroupSearchResult = currAppState.selectedGroup;
        const newProps = this.props;
        // tslint:disable-next-line: no-console
        console.log(oldProps.groupInfo !== newProps.groupInfo, "and ", this.state.storeState !== currAppState);
        if(oldProps.groupInfo !== newProps.groupInfo 
            || this.state.storeState !== currAppState) {
            this.setState({ 
                groupInfo: selectedGroup,
                storeState: currAppState,
                isUserInGroup: this.isUserInGroup(selectedGroup.members.users),
                isUserOwnerInGroup: this.isOwnerInGroup(selectedGroup.members.users)
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

    public handleJoinRequest = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        const userId = event.currentTarget.getAttribute('name');
        const groupId = this.state.groupInfo.id;
        if(userId && groupId){
            this.props.onUpdateWaitingList(event, this.state.groupInfo, 
                groupId, userId, this.state.storeState.system.token, 'add', false);
        }
    }

    public handleRejectJoinRequest = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        const userId = event.currentTarget.getAttribute('name');
        const groupId = this.state.groupInfo.id;
        if(userId && groupId){
            this.props.onUpdateWaitingList(event, this.state.groupInfo, 
                groupId, userId, this.state.storeState.system.token, 'delete', true);
        }
    }

    public handleGroupDeleteRequest = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        const groupId = this.state.groupInfo.id;
        this.props.onGroupDelete(event, this.state.storeState.groupSearchResults.groups, groupId, this.state.storeState.system.token);
    }

    public render() {
        
        const userSearchResult = this.state.storeState.userSearchResults.users;
        return (
            <div className="GroupPage">
                <NavigationBar storeState={this.state.storeState}
                               loginFormFields={this.props.loginFormFields}
                               registrationFormFields={this.props.registrationFormFields}
                               onLoginSubmit={this.props.onLoginSubmit}
                               onRegistrationSubmit={this.props.onRegistrationSubmit}
                               onGetUserAccountDetails={this.props.onGetUserAccountDetails}
                />
                <div className="container px-0 mx-auto pageContainer">
                    <h2 className="text-center">                                
                        {this.state.groupInfo.name}: 
                        <span>
                            {this.state.groupInfo.groupDetails.originCity}, {this.state.groupInfo.groupDetails.originZipCode}
                                <i className="fas fa-angle-double-right fa-3x align-middle pl-2"/><i className="fas fa-angle-double-right fa-3x align-middle pr-2"/>  
                            {this.state.groupInfo.groupDetails.destinationCity},    
                            {this.state.groupInfo.groupDetails.originZipCode} 
                            {this.state.isUserOwnerInGroup && this.state.isUserInGroup ? 
                            <Button variant="info" size="sm" onClick={this.handleGroupDeleteRequest}>Delete Group</Button>: null}
                            {!this.state.isUserInGroup ? 
                            <Button variant="info" size="sm" 
                            name={this.state.storeState.system.userName} 
                            onClick={this.handleJoinRequest}>Join Group</Button>: null}
                        </span>
                    </h2>
                    <CardDeck key={this.state.groupInfo.id}>
                        <GroupMemberTable key={this.state.groupInfo.id + "_members"}
                                          groupInfo={this.state.groupInfo}
                                          userName={this.state.storeState.system.userName}
                                          isUserInGroup={this.state.isUserInGroup}
                                          isUserOwnerInGroup={this.state.isUserOwnerInGroup}
                                          token={this.state.storeState.system.token}
                                          onUpdateMember={this.props.onUpdateMember}/>

                        <GroupWaitingList key={this.state.groupInfo.id + "_waitList"} 
                                          groupInfo={this.state.groupInfo}
                                          userName={this.state.storeState.system.userName}
                                          isUserInGroup={this.state.isUserInGroup}
                                          isUserOwnerInGroup={this.state.isUserOwnerInGroup}
                                          token={this.state.storeState.system.token}
                                          onUpdateWaitingList={this.props.onUpdateWaitingList}
                                          onUpdateMember={this.props.onUpdateMember}/>
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

                <div className="container mx-auto my-auto p-2">                       
                    {Object.keys(userSearchResult).length>0 ? (
                    <div>
                        <UserTableList userList={this.state.storeState.userSearchResults.users}
                                       groupInfo={this.state.groupInfo}
                                       token={this.state.storeState.system.token}
                                       isUserInGroup={this.state.isUserInGroup}
                                       isUserOwnerInGroup={this.state.isUserOwnerInGroup}
                                       onInviteUser={this.props.onUpdateInvitationsList}
                        />
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
    OwnProps: GroupProps&RouteComponentProps<PathProps>
    ) => {
    return {
        groupInfo: state.groupInfo,
        storeState: state.storeState
    }
}

// TODO: Add user search dispatch
const mapDispatchToProps = (dispatch: any) => {
    return {
        onLoginSubmit: (
            e: React.FormEvent<HTMLFormElement>, 
            formFields: LoginFormFields
        ) => dispatch(UpdateAuth(e, formFields)),
        onRegistrationSubmit: (
            e: React.FormEvent<HTMLFormElement>, 
            formFields: RegistrationFormFields
        ) => dispatch(registerAccount(e, formFields)),
        onSubmit: (
            e: React.FormEvent<HTMLFormElement>, 
            formFields: GroupSearchFormFields,
            existingUsers: UserSearchResult[],
            page: number,
            token: string,
        ) => dispatch(SearchUsers(e, formFields, existingUsers, page, token)),
        onUpdateMember: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroup: GroupSearchResult,
            groupId: string,
            userId: string,
            token: string,
            actionType: 'add'|'delete'
        ) => dispatch(updateGroupMember(e, currentGroup, groupId, userId, token, actionType)),
        onUpdateWaitingList: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroup: GroupSearchResult,
            groupId: string,
            userId: string,
            token: string,
            actionType: 'add'|'delete',
            addToMemberList: true|false
        ) => dispatch(updateWaitingList(e, currentGroup, groupId, userId, token, actionType, addToMemberList)),
        onUpdateInvitationsList: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroup: GroupSearchResult,
            groupId: string,
            userId: string,
            token: string,
            actionType: 'add'|'delete'
        ) => dispatch(updateInvitationsList(e, currentGroup, groupId, userId, token, actionType)),
        onGroupDelete: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroups: GroupSearchResult[],
            groupId: string,
            token: string,
        ) => dispatch(updateGroup(e, currentGroups, groupId, token)),
        onGetUserAccountDetails: (
            event: React.MouseEvent<HTMLButtonElement> | null,
            userId: string,
            token: string
        ) => dispatch(updateUserAccount(event, userId, token))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupPage));
