import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as Users from './Users';
import * as Campus from './Campus';
import * as CampusParticipation from './CampusParticipation';
import * as Session from './Session';
import * as Project from './Project';
import * as ProjectDetails from './ProjectDetails';
import * as SnackbarNotification from './SnackbarNotification';
import * as SignalRConnections from './SignalRConnections';
import { responsiveStateReducer } from 'redux-responsive';

import { addTask } from 'domain-task';


// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
    users: Users.UsersState;
    campus: Campus.CampusState;
    session: Session.SettingsState;
    campusParticipation: CampusParticipation.CampusParticipationState;
    project: Project.ProjectState;
    projectDetails: ProjectDetails.ProjectDetailsState;
    snackbarNotification:  SnackbarNotification.SnackbarNotificationState;
    signalRConnections:SignalRConnections.SignalRConnectionsState;
	browser:any;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    users: Users.reducer,
    campus: Campus.reducer,
    session: Session.reducer,
    campusParticipation: CampusParticipation.reducer,
    project: Project.reducer,
    projectDetails: ProjectDetails.reducer,
    snackbarNotification: SnackbarNotification.reducer,
    signalRConnections: SignalRConnections.reducer,
	browser: responsiveStateReducer
	
}

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
