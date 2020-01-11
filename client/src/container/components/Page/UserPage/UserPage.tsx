import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from "react-router";

// Add styling related imports
import '../../../../stylesheets/css/cards/GroupPage.css';

// Import store and types
import { store } from 'src/redux/store';
import NavigationBar from '../../Navigation/NavigationBar';
import { LoginFormFields } from 'src/redux/types/userInterface/loginFormFields';
import { GroupSearchFormFields } from 'src/redux/types/userInterface/groupSearchFormFields';
import { updateUserAccount } from 'src/redux/actions/UserPage/updateUserAccountAction';
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import UserSubscribedGroupsList from './UserSubscribedGroupsList';
import UserInvitationsList from './UserInvitationsList';
import { updateGroupMember } from 'src/redux/actions/GroupPage/updateGroupMemberAction';
import { updateInvitationsList } from 'src/redux/actions/GroupPage/updateInvitationsListAction';
import { updateWaitingList } from 'src/redux/actions/GroupPage/updateWaitingListAction';
import { CardDeck, Button } from 'react-bootstrap';
import GroupSearchForm from '../../Forms/GroupSearchForm';
import GroupSearchList from '../../Tables/GroupSearchList';
import { SearchGroups } from 'src/redux/actions/groupSearchAction';
import { updateSelectedGroup } from 'src/redux/actions/GroupPage/updateSelectedGroupAction';
import { UserDetailsResult } from 'src/redux/types/userInterface/userDetailsResult';
import { UpdateAuth } from 'src/redux/actions/jwtAuthAction';
import { RegistrationFormFields } from 'src/redux/types/userInterface/registrationFormFields';
import { registerAccount } from 'src/redux/actions/registerAccountAction';
import { AppState } from 'src/redux/reducers/rootReducer';

/** CREATE Prop and State interfaces to use in the component */
// Set the default Props
export interface UserProps{
    isLoading: boolean;
    userAccount: UserDetailsResult;
    groupSearchFormFields: GroupSearchFormFields;
    onLoginSubmit: typeof UpdateAuth;
    onRegistrationSubmit: typeof registerAccount;
    loginFormFields: LoginFormFields;
    registrationFormFields: RegistrationFormFields;
    onSubmit: typeof SearchGroups;
    onUpdateGroupMember: typeof updateGroupMember;
    onUpdateGroupInvitationsList: typeof updateInvitationsList;
    onUpdateGroupWaitingList: typeof updateWaitingList;
    onGetUserAccountDetails: typeof updateUserAccount;
    updateSelectedGroup: typeof updateSelectedGroup;
}

export interface UserState{
    groupSearchFormFields: GroupSearchFormFields;
    storeState: AppState;
    userInfo: UserDetailsResult;
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}

class UserPage extends React.Component<UserProps&RouteComponentProps<PathProps>, UserState>{

    public state: UserState;

    constructor(props:UserProps&RouteComponentProps<PathProps>){

        super(props);
        const currAppState:AppState = store.getState();
        this.state = {
            groupSearchFormFields: {
                origin: '',
                originRange: 2,
                destination: '',
                destinationRange: 2
            },
            storeState: currAppState,
            userInfo: currAppState.userAccount
        };

        this.loadMore = this.loadMore.bind(this);
        this.handleGroupSearchFormUpdate = this.handleGroupSearchFormUpdate.bind(this);
    }

    public componentDidMount() {
        const currAppState = store.getState();
        this.props.onGetUserAccountDetails(null,
                                           currAppState.system.userName,
                                           currAppState.system.token);
    }

    public componentDidUpdate(oldProps:UserProps&RouteComponentProps<PathProps>) {

        const currAppState = store.getState();
        if(this.state.storeState !== currAppState){
            this.setState({ 
                storeState: currAppState
            });
        }
    }

    public loadMore = async (event: any): Promise<void> => {
        this.props.onSubmit(null, 
                            this.state.groupSearchFormFields, 
                            this.state.storeState.groupSearchResults.groups,
                            this.state.storeState.groupSearchResults.page,
                            this.state.storeState.system.token);
    }

    public handleGroupSearchFormUpdate = (formFields: GroupSearchFormFields): void => {
        this.setState({groupSearchFormFields: formFields});
    }

    public render() {
        const groupSearchResult = this.state.storeState.groupSearchResults.groups;
        return (
            <div className="UserPage">
                <NavigationBar storeState={this.state.storeState}
                               loginFormFields={this.props.loginFormFields}
                               registrationFormFields={this.props.registrationFormFields} 
                               onLoginSubmit={this.props.onLoginSubmit}
                               onRegistrationSubmit={this.props.onRegistrationSubmit}
                               onGetUserAccountDetails={this.props.onGetUserAccountDetails}
                />
                <div className="container px-0 mx-auto pageContainer">
                    <CardDeck key={this.state.storeState.system.userName}>
                        <UserSubscribedGroupsList key={this.state.storeState.system.userName+"_subs"}
                                                  subscribedGroups={this.state.storeState.userAccount.subscribedGroups}
                                                  userName={this.state.storeState.system.userName}
                                                  token={this.state.storeState.system.token}
                                                  onUpdateMember={this.props.onUpdateGroupMember}
                                                  updateSelectedGroup={this.props.updateSelectedGroup}
                                                  onGetUserAccountDetails={this.props.onGetUserAccountDetails}/>

                        <UserInvitationsList key={this.state.storeState.system.userName+"_invites"} 
                                             invitationsList={this.state.storeState.userAccount.invitationList}
                                             userName={this.state.storeState.system.userName}
                                             token={this.state.storeState.system.token}
                                             onUpdateMember={this.props.onUpdateGroupMember}
                                             onUpdateInvitationList={this.props.onUpdateGroupInvitationsList}
                                             updateSelectedGroup={this.props.updateSelectedGroup}
                                             onGetUserAccountDetails={this.props.onGetUserAccountDetails}/>
                    </CardDeck>
                </div>
                    
                <div className="container mx-auto my-auto align-items-center">
                    <div className="row justify-content-center">
                        <div className="searchForm">                                  
                            <h1 className="joinAGroupText text-center">Join a group?</h1>
                            <p className="joinAGroupSubText text-center">
                                Search with ease based on the origin and destination radius
                            </p>
                            <GroupSearchForm 
                                formFields={this.state.groupSearchFormFields}
                                page={this.state.storeState.groupSearchResults.page}
                                token={this.state.storeState.system.token} 
                                updateSearchFormFields={this.handleGroupSearchFormUpdate}
                                onSubmit={this.props.onSubmit}
                            />
                        </div>
                    </div>
                </div>

                <br/>

                <div className="container mx-auto my-auto p-2">                       
                        <CardDeck>
                            <GroupSearchList 
                                key={this.state.storeState.system.userName + "_searchedgroups"} 
                                groupSearchResult={groupSearchResult}
                                userName={this.state.storeState.system.userName}
                                token={this.state.storeState.system.token}
                                onApplyGroup={this.props.onUpdateGroupWaitingList}
                                updateSelectedGroup={this.props.updateSelectedGroup}
                            />
                       </CardDeck>
                       {this.state.storeState.groupSearchResults.page !== 0 ? 
                            <Button type="button" onClick={this.loadMore}> Load More... </Button>: null
                       }       
                </div>

            </div>
        );
    }
}

// Create mapToState and mapDispatch for Redux
const mapStateToProps = (
    state: UserState, 
    OwnProps: UserProps&RouteComponentProps<PathProps>
    ) => {
    return {
        storeState: state.storeState
    }
}

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
            existingUsers: GroupSearchResult[],
            page: number,
            token: string,
        ) => dispatch(SearchGroups(e, formFields, existingUsers, page, token)),
        onGetUserAccountDetails: (
            event: React.MouseEvent<HTMLButtonElement> | null,
            userId: string,
            token: string
        ) => dispatch(updateUserAccount(event, userId, token)),
        onUpdateGroupMember: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroup: GroupSearchResult,
            groupId: string,
            userId: string,
            token: string,
            actionType: 'add'|'delete'
        ) => dispatch(updateGroupMember(e, currentGroup, groupId, userId, token, actionType)),
        onUpdateGroupInvitationsList: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroup: GroupSearchResult,
            groupId: string,
            userId: string,
            token: string,
            actionType: 'add'|'delete'
        ) => dispatch(updateInvitationsList(e, currentGroup, groupId, userId, token, actionType)),
        onUpdateGroupWaitingList: (
            e: React.MouseEvent<HTMLButtonElement>,
            currentGroup: GroupSearchResult,
            groupId: string,
            userId: string,
            token: string,
            actionType: 'add'|'delete',
            addToMembers: true|false
        ) => dispatch(updateWaitingList(e, currentGroup, groupId, userId, token, actionType, addToMembers)),
        updateSelectedGroup: (
            event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
            currentGroup: GroupSearchResult,
            groupId: string,
            token: string) => dispatch(updateSelectedGroup(event, currentGroup, groupId, token))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPage));
