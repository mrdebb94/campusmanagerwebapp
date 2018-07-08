import 'whatwg-fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface SnackbarNotificationState {
	open:boolean;
    message:string;
};


interface ToggleSnackbarNotification {
	type: 'TOGGLE_SNACKBAR_NOTIFICATION';
    status: SnackbarNotificationState;
}

type KnownAction = ToggleSnackbarNotification

export const actionCreators = {
	toggle: ({open, message}): AppThunkAction<KnownAction> => (dispatch, getState) => {
	    dispatch({ type: 'TOGGLE_SNACKBAR_NOTIFICATION', status:{open, message}});
	}
};

const initialState: SnackbarNotificationState = { open:false, message:'' };

export const reducer: Reducer<SnackbarNotificationState> = (state = initialState, incomingAction: Action) => {
	const action = incomingAction as KnownAction;
	switch (action.type) {
		case 'TOGGLE_SNACKBAR_NOTIFICATION': {
			return {
              ...state,
			  open:action.status.open,
              message:action.status.message
			};
		}
		default: {
			return state;
		}

	}
};
