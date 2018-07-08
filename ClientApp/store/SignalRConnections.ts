import * as signalR from "@aspnet/signalr";
import { AppThunkAction } from ".";
import { Reducer } from "redux";
import { Action } from "redux";

export interface SignalRConnectionsState {
    projectSubscribeConnection: signalR.HubConnection | null;
}

interface SetProjectSubscribeConnection {
    type: 'SET_PROJECT_SUBSCRIBE_CONNECTION';
    projectSubscribeConnection: signalR.HubConnection;
}
type KnownAction = SetProjectSubscribeConnection;

export const actionCreators = {
    startProjectSubscribeConnection: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let hubConnection = new signalR.HubConnection('/hub/projectsubscribe');

       // hubConnection.
        
        hubConnection.start()
          .then(() => {
              console.log('Connection started!')
            dispatch({ type: 'SET_PROJECT_SUBSCRIBE_CONNECTION', projectSubscribeConnection: hubConnection });
          });
    }
}

const initialState: SignalRConnectionsState = { projectSubscribeConnection:null  };

export const reducer: Reducer<SignalRConnectionsState> = (state = initialState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SET_PROJECT_SUBSCRIBE_CONNECTION': {
            console.log("CONNECTION REDUCER");
            return {
                ...state,
                projectSubscribeConnection: action.projectSubscribeConnection
            };
        }
        default: {
            return state;
        }

    }
}