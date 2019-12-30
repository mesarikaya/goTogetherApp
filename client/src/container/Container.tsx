import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router";
import { Route, Switch, withRouter } from 'react-router-dom';
import { UpdateAuth } from '../redux/actions/jwtAuthAction';

// Import the presentational components for this container
import App from './components/Page/App';
import GroupPage from './components/Page/GroupPage/GroupPage';
import UserPage from './components/Page/UserPage/UserPage';

// Import store and relevant types
import {store} from "../redux/store";
import { SecurityState } from '../redux/types/system/securityState';
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import { UserSearchResult } from 'src/redux/types/userInterface/userSearchResult';
import { GroupUser } from 'src/redux/types/userInterface/groupUser';

interface AppProps {
    system: SecurityState;
    userAccount: {
        subscribedGroups: GroupSearchResult[],
        invitationList: GroupSearchResult[]
    };
    groupSearchResults: {
        groups: GroupSearchResult[],
        page: number
    };
    userSearchResults: {
        users: UserSearchResult[],
        page: number
    };
    selectedGroup:{
        members:{
            users: GroupUser[]
        },
        waitingList: {
            users: GroupUser[]
        },
        invites: {
            users: GroupUser[]
        }
    };
    currentSelectedMembers: {
        users: GroupUser[]
    };
    currentWaitingList: {
        users: GroupUser[]
    };
    currentInvitationsList: {
        users: GroupUser[]
    };
    updateSession: typeof UpdateAuth;
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}
export interface State {
    system: SecurityState;
    userAccount: {
        subscribedGroups: GroupSearchResult[],
        invitationList: GroupSearchResult[]
    },
    groupSearchResults: {
        groups: GroupSearchResult[],
        page: number
    };
    userSearchResults: {
        users: UserSearchResult[],
        page: number
    };
    selectedGroup:{
        members:{
            users: GroupUser[]
        },
        waitingList: {
            users: GroupUser[]
        },
        invites: {
            users: GroupUser[]
        }
    };
    currentSelectedMembers: {
        users: GroupUser[]
    };
    currentWaitingList: {
        users: GroupUser[]
    };    
    currentInvitationsList: {
        users: GroupUser[]
    };
};

class Container extends React.Component<AppProps & RouteComponentProps<PathProps>, State> {
    public state: State;

    constructor(props: AppProps & RouteComponentProps<PathProps>) {
        
        super(props);

        // tslint:disable-next-line:no-console
        console.log('Container - Current Store State is: ', store.getState());
        const currentState = store.getState().system;

        this.state = {
            system: currentState.system,
            userAccount: currentState.userAccount,
            groupSearchResults: currentState.groupSearchResults,
            userSearchResults: currentState.userSearchResults,
            selectedGroup: currentState.selectedGroupUser,
            currentSelectedMembers: currentState.currentSelectedMembers,
            currentWaitingList: currentState.currentWaitingList,
            currentInvitationsList: currentState.currentInvitationsList
        };
    }

    public render() {

        return (
            <Switch>
                <Route exact={true} path="/" component={App}/>
                <Route path="/group" component={GroupPage} />
                <Route path="/user" component={UserPage} />
                <Route path="/**" component={App} />
            </Switch>
        );
    }
}

const mapStateToProps = (
    state: State, 
    OwnProps: AppProps & RouteComponentProps<PathProps>
    ) => ({
    system: state.system,
    userAccout: state.userAccount,
    groupSearchResults: state.groupSearchResults,
    userSearchResults: state.userSearchResults,
    selectedGroup: state.selectedGroup,
    currentSelectedMembers: state.currentSelectedMembers,
    currentWaitingList: state.currentWaitingList,
    currentInvitationsList: state.currentInvitationsList
})  

export default withRouter(connect(mapStateToProps, null)(Container));