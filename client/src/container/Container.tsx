import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router";
import { Route, Switch, withRouter } from 'react-router-dom';
import { UpdateAuth } from '../redux/actions/jwtAuthAction';

// Import the presentational components for this container
import App from './components/Page/App';
import GroupPage from './components/Page/GroupPage/GroupPage';

// Import store and relevant types
import {store} from "../redux/store";
import { SecurityState } from '../redux/types/system/securityState';
import { GroupSearchResult } from 'src/redux/types/userInterface/groupSearchResult';
import { UserSearchResult } from 'src/redux/types/userInterface/userSearchResult';



interface AppProps {
    updateSession: typeof UpdateAuth,
    system: SecurityState,
    groupSearchResults: {
        groups: GroupSearchResult[],
        page: number
    };
    userSearchResults: {
        users: UserSearchResult[],
        page: number
    };
}

// These props are provided by the router
interface PathProps {
    history: any;
    location: any;
    match: any;
}

export interface State {
    system: SecurityState;
    groupSearchResults: {
        groups: GroupSearchResult[],
        page: number
    };
    userSearchResults: {
        users: UserSearchResult[],
        page: number
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
            groupSearchResults: currentState.groupSearchResults,
            userSearchResults: currentState.userSearchResults
        };
    }

    public componentDidUpdate(oldProps: AppProps) {
        
        const newProps = this.props;
        if(oldProps.system !== newProps.system 
            && oldProps.groupSearchResults !== newProps.groupSearchResults) {
            this.setState({ 
                system:this.props.system,
                groupSearchResults:this.props.groupSearchResults 
            });
        } else if(oldProps.system !== newProps.system){
            this.setState({ system:this.props.system });
        } else if(oldProps.groupSearchResults !== newProps.groupSearchResults) {
            this.setState({ groupSearchResults:this.props.groupSearchResults });
        }

        if(oldProps.userSearchResults !== newProps.userSearchResults) {
            this.setState({ userSearchResults:this.props.userSearchResults });
        }
    }

    public render() {

        return (
            <Switch>
                <Route exact={true} path="/" component={App}/>
                <Route path="/group" component={GroupPage} />
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
    groupSearchResults: state.groupSearchResults,
    userSearchResults: state.userSearchResults
})  

export default withRouter(connect(mapStateToProps, null)(Container));