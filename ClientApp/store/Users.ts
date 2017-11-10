import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export interface User {
	userId?: string;
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
};

interface SetUsersListAction {
	type: 'SET_USERS_LIST';
	usersList: User[];
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

type KnownAction = SetUsersListAction | AddUserAction | ToggleUserDialog | ModifyEditedUserAction;

export const userServices = {

	//credentials: 'include' 
	listUsers: (): Promise<any> => new Promise<any>((resolve) => {
		//TODO: hibakezelés
		fetch('api/user/list', {
			method: 'GET',
			credentials: 'same-origin'
		}).then(response => response.json()).then((response) => {
			resolve(response);
		});
	}),

	addUser: (editedUser, xsrfToken): Promise<any> => new Promise<any>((resolve) => {
		let data = JSON.stringify({
			Name: editedUser.name,
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
			.then((response) => {
				resolve(response);
			});
	})
}

export const actionCreators = {
	addUser: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

		let { users: { editedUser } } = getState();
		let { session } = getState();

		if (editedUser) {

			console.log("Token " + session.xsrfToken);

			//let {name, email,password } = editedUser;

			//let data = new FormData();
			//data.append("json", JSON.stringify({ Name: editedUser.name, Password: editedUser.password, Email: editedUser.email }));
			let data = JSON.stringify({ Name: editedUser.name, Password: editedUser.password, Email: editedUser.email });
			//TODO: hibakezelés
			userServices.addUser(editedUser, session.xsrfToken).then((response) => {
				userServices.listUsers().then((response) => {
					dispatch({ type: 'SET_USERS_LIST', usersList: response });
					dispatch({ type: 'TOGGLE_USER_DIALOG', open: false });
				});
			});
		}

	},
	setUsersList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log(getState());
		userServices.listUsers().then((response) => {
			dispatch({ type: 'SET_USERS_LIST', usersList: response });
		});
	},

	modifyEditedUser: ({ id = '', name = '', email = '', password = '', type = '' }: 
	{ id?: string, name?: string, email?: string, password?: string, type?: string }): AppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'MODIFY_EDITED_USER', user: { id, name, email, password, type } });
	},

	toggleUserDialog: (open: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'TOGGLE_USER_DIALOG', open });
	}

};

const initialState: UsersState = { usersList: [], openUserDialog: false };

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
		default: {
			return state;
		}

	}
};
