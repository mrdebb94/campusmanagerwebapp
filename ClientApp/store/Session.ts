import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export const INIT_SESSION = 'InitConfigAction'

export interface SettingsState {
    //id: string;
    xsrfToken?: string;
    authenticated?: boolean;
    roles?: string[];
    failedLogin: boolean;
};

interface InitConfigAction {
    type: 'InitConfigAction';
    payload: SettingsState;
};

interface SetAuthenticationAction {
    type: 'SetAuthenticationAction';
    authenticated: boolean;
};

interface SetXsrfTokenAction {
    type: 'SetXsrfTokenAction';
    xsrfToken: string;
};

interface SetRolesAction {
    type: 'SetRolesAction';
    roles: string[];
};


interface SetFailedLogin {
    type: 'SetFailedLogin';
    failedLogin: boolean;
};

type KnownAction = InitConfigAction | SetAuthenticationAction 
   | SetXsrfTokenAction | SetFailedLogin | SetRolesAction;

export const sessionServices = {
    getXsrfToken: (): Promise<any> => new Promise<any>((resolve) => {
        fetch('api/xsrftoken/get', {
            method: 'GET',
            body: {},
            credentials: 'same-origin'
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then((response) => {
            resolve(response);
        })
    }),
    login: (userName: string, password: string, xsrfToken: string): Promise<any> => new Promise<any>((resolve, reject) => {
        let data = JSON.stringify({
            UserName: userName,
            Password: password
        });
        //TODO: hibakezelés
        let headers = {};

        //xsrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
        //console.log("Kapott token LOGIN" +  xsrfToken);

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/user/login', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
		    .then((response) => response.json())
            .then((response) => {
                //TODO: resolveban frissíteni kéne a token-t
                resolve(response);
            }).catch(error => {
                reject(error);
            });
    }),
    logout: (xsrfToken: string): Promise<any> => new Promise<any>((resolve, reject) => {
        let headers = {};

        //xsrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
        //console.log("Kapott token LOGIN" +  xsrfToken);

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/user/logout', {
            method: 'POST',
            headers,
            body: {},
            credentials: 'same-origin'
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
        dispatch({ type: INIT_SESSION, payload: settings || {
            xsrfToken: xsrfToken, authenticated: false, failedLogin:false } 
        });
        // Cookies.set('settings', getState().settings, { expires: 365 });
    },
    login: (userName: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();
        dispatch({ type: 'SetFailedLogin', failedLogin: false });
        sessionServices.login(userName, password, session.xsrfToken!).then(response => {
            console.log("Bejelentkezve");
			console.log(response);
			let roles = response.value;
            sessionServices.getXsrfToken().then(respone => {
                dispatch({ type: 'SetAuthenticationAction', authenticated: true });
                var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
                console.log("Kapott token LOGIN" +  cookieValue);
                dispatch({type:'SetXsrfTokenAction', xsrfToken: cookieValue});
				dispatch({ type: 'SetRolesAction', roles });
            })

            //TODO: error-ba is?
            //var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
            //console.log("Kapott token LOGIN" +  cookieValue);
            //dispatch({type:'SetXsrfTokenAction', xsrfToken: cookieValue});
        }, error => {
                console.log("Hiba");
                dispatch({ type: 'SetAuthenticationAction', authenticated: false });
                dispatch({ type: 'SetFailedLogin', failedLogin: true  });
				dispatch({ type: 'SetRolesAction', roles: []});
        });
    },
    logout: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();

        sessionServices.logout(session.xsrfToken!).then(response => {
            console.log("Kijelentkezett");
            //var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
            //console.log("Kapott token LOGOUT" +  cookieValue);
            //dispatch({type:'SetXsrfTokenAction', xsrfToken: cookieValue});
            sessionServices.getXsrfToken().then(respone => {
                dispatch({ type: 'SetAuthenticationAction', authenticated: false });
                var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
                console.log("Kapott token LOGOUT" +  cookieValue);
                dispatch({type:'SetXsrfTokenAction', xsrfToken: cookieValue});
				dispatch({ type: 'SetRolesAction', roles: []});
            })

            //dispatch({ type: 'SetAuthenticationAction', authenticated: false });
        });
    },
    setXsrfToken: (xsrfToken: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SetXsrfTokenAction', xsrfToken });
    },
	setRoles: (roles: string[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SetRolesAction', roles });
    }
};

const DefaultSettings: SettingsState = { xsrfToken: undefined, authenticated: undefined, failedLogin:false };

export const reducer: Reducer<SettingsState> = (state: SettingsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case INIT_SESSION: {
            return action.payload;
        }
        case 'SetAuthenticationAction': {
            return { ...state, authenticated: action.authenticated };
        }
        case 'SetXsrfTokenAction': {
            return { ...state, xsrfToken: action.xsrfToken };
        }
        case 'SetFailedLogin': {
            return { ...state, failedLogin: action.failedLogin };
        }
		case 'SetRolesAction': {
			 return { ...state, roles: [...action.roles] };
		}
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            // const exhaustiveCheck: never = action;
            break;
    }
    return state || DefaultSettings;
};
