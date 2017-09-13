import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export const INIT_SESSION = 'InitConfigAction'

export interface SettingsState {
    //id: string;
    xsrfToken?: string;
    authenticated?: boolean;
};

interface InitConfigAction {
    type: 'InitConfigAction';
    payload: SettingsState;
};

interface SetAuthenticationAction {
    type: 'SetAuthenticationAction';
    authenticated: boolean;
};

type KnownAction = InitConfigAction | SetAuthenticationAction;

export const sessionServices = {
    login: (userName: string, password: string, xsrfToken: string): Promise<any> => new Promise<any>((resolve, reject) => {
        let data = JSON.stringify({
            Name: userName,
            Password: password
        });
        //TODO: hibakezelés
        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/user/login', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
            .then((response) => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
    }),
    logout: (xsrfToken:string):  Promise<any> => new Promise<any>((resolve, reject) => {
            let headers = {};
    
            headers['Content-Type'] = 'application/json';
            headers['X-XSRF-TOKEN'] = xsrfToken;
    
            fetch('api/user/logout', {
                method: 'POST',
                headers,
                body: {},
                credentials: 'include'
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
                .then((response) => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
    })
};

export const actionCreators = {

    initialize: (settings?: SettingsState): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        // var saved = Cookies.getJSON('settings');
        var xsrfToken = document.getElementById('xsrf-token')!.dataset['xsrfToken'];
        //var id = document.getElementById('session').dataset['id'];
        dispatch({ type: INIT_SESSION, payload: settings || { xsrfToken: xsrfToken, authenticated: false } });
        // Cookies.set('settings', getState().settings, { expires: 365 });
    },
    login: (userName: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();

        sessionServices.login(userName, password, session.xsrfToken!).then(response => {
            console.log("Bejelentkezve");
            dispatch({ type: 'SetAuthenticationAction', authenticated: true });
        }, error => {
            console.log("Hiba");
            dispatch({ type: 'SetAuthenticationAction', authenticated: false });
        });
    },
    logout: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();

        sessionServices.logout(session.xsrfToken!).then( response => {
            console.log("Kijelentkezett");
            dispatch({ type: 'SetAuthenticationAction', authenticated: false });
        });
    }
};

const DefaultSettings: SettingsState = { xsrfToken: undefined, authenticated: undefined };

export const reducer: Reducer<SettingsState> = (state: SettingsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case INIT_SESSION:
            return action.payload;
        case 'SetAuthenticationAction': {
            return {...state, authenticated : action.authenticated }; 
        }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            // const exhaustiveCheck: never = action;
            break;
    }
    return state || DefaultSettings;
};