import 'whatwg-fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface User {
	userId?: string;
	userName: string;
    name: string;
	password: string;
	email: string;
	type: string;
};

export interface UsersState {
	editedUser?: User;
	usersList: User[];
	selectedUser?: User;
	openUserDialog: boolean;
    userFormError: User;
};

interface SetUsersListAction {
	type: 'SET_USERS_LIST';
	usersList: User[];
}

interface SetUserFormErrorAction {
	type: 'SET_USER_FORM_ERROR';
	userFormError: User;
}

interface AddUserAction {
	type: 'ADD_USER';
	user: User;
}

interface ModifyEditedUserAction {
	type: 'MODIFY_EDITED_USER';
	user: User;
}

interface ToggleUserDialog {
	type: 'TOGGLE_USER_DIALOG';
	open: boolean;

}

type KnownAction = SetUsersListAction | AddUserAction 
                   | ToggleUserDialog | ModifyEditedUserAction | SetUserFormErrorAction;

export const userServices = {

   reportUserInPdf: (userId): Promise<any> => new Promise<any>((resolve) => {
		//TODO: hibakezelés
		fetch(`api/report/user?userId=${userId}`, {
			method: 'GET',
			credentials: 'same-origin'
		}).then(response => response.blob())
          .then((response) => {
			resolve(response);
		});
	}),

	//credentials: 'include' 
	listUsers: (): Promise<any> => new Promise<any>((resolve) => {
		//TODO: hibakezelés
		fetch('api/user/list', {
			method: 'GET',
			credentials: 'same-origin'
		}).then(response => response.json())
          .then((response) => {
			resolve(response);
		});
	}),

	addUser: (editedUser, xsrfToken): Promise<any> => new Promise<any>((resolve) => {
		let data = JSON.stringify({
			Name: editedUser.name,
            UserName: editedUser.userName,
			Password: editedUser.password,
			Email: editedUser.email,
			Type: editedUser.type
		});
		//TODO: hibakezelés
		let headers = {};
		
		//let xsrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
		//console.log("Kapott token LOGIN" +  xsrfToken);

		headers['Content-Type'] = 'application/json';
		headers['X-XSRF-TOKEN'] = xsrfToken;

		fetch('api/user/add', {
			method: 'POST',
			/*headers: {
				'Content-Type': 'application/json'	
			}*/
			headers,
			body: data,
			credentials: 'same-origin'
		})
            .then(response => response.json())
			.then((response) => {
				resolve(response);
			});
	})
}

export const actionCreators = {
	addUser: (editedUser:User): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SET_USER_FORM_ERROR', userFormError: {
									   userName:'',
									   name:'',
									   email:'',
									   password:'',
									   type:'' 
                                   } });
		//let { users: { editedUser } } = getState();
		let { session } = getState();

		if (editedUser) {

			console.log("Token " + session.xsrfToken);

			//let {name, email,password } = editedUser;

			//let data = new FormData();
			//data.append("json", JSON.stringify({ Name: editedUser.name, Password: editedUser.password, Email: editedUser.email }));
			let data = JSON.stringify({ 
				UserName: editedUser.userName, 
                Name: editedUser.name,
                Password: editedUser.password,
                Email: editedUser.email
            });
			//TODO: hibakezelés
			userServices.addUser(editedUser, session.xsrfToken).then((response) => {
                if(response.status=="success") {
					userServices.listUsers().then((response) => {
						dispatch({ type: 'SET_USERS_LIST', usersList: response });
						dispatch({ type: 'TOGGLE_USER_DIALOG', open: false });
					});
				} else if(response.status=="fail") {

                    /*       userName: response.data.userName?response.data.userName:''
					   }*/
                       dispatch({ type: 'SET_USER_FORM_ERROR', userFormError: {
									   userName:response.data.userName?response.data.userName:'',
									   name:response.data.name?response.data.name:'',
									   email:response.data.email?response.data.email:'',
									   password:response.data.password?response.data.password:'',
									   type:'' 
                                   }
                       });
                }
			});
		}

	},
	setUsersList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log(getState());
		userServices.listUsers().then((response) => {
			dispatch({ type: 'SET_USERS_LIST', usersList: response });
		});
	},

	modifyEditedUser: ({ id = '', userName='', name = '', email = '', password = '', type = '' }: 
	{ id?: string, userName?: string, name?: string, email?: string, password?: string, type?: string }): AppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'MODIFY_EDITED_USER', user: { id, userName, name, email, password, type } });
	},

	toggleUserDialog: (open: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'TOGGLE_USER_DIALOG', open });
	}

};

const initialState: UsersState = { usersList: [], 
                                   openUserDialog: false, 
                                   userFormError: {
									   userName:'',
									   name:'',
									   email:'',
									   password:'',
									   type:'' 
                                   }
                                 };

export const reducer: Reducer<UsersState> = (state = initialState, incomingAction: Action) => {
	const action = incomingAction as KnownAction;
	switch (action.type) {
		case 'TOGGLE_USER_DIALOG': {
			return {
				...state,
				openUserDialog: action.open
			};
		}
		case 'SET_USERS_LIST': {
			return {
				...state,
				usersList: action.usersList
			};
		}
		case 'MODIFY_EDITED_USER': {
			return {
				...state,
				editedUser: { ...action.user }
			};
		}

        case 'SET_USER_FORM_ERROR': {
			return {
				...state,
				userFormError: { ...action.userFormError }
			};
		}

		default: {
			return state;
		}

	}
};
