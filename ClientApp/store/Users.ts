import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';


export interface User {
	id?: string;
	name: string;
	password: string;
	email: string;
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

export const actionCreators = {
	addUser: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

		let { users: { editedUser } } = getState();

		if (editedUser) {

			//let {name, email,password } = editedUser;

			//let data = new FormData();
			//data.append("json", JSON.stringify({ Name: editedUser.name, Password: editedUser.password, Email: editedUser.email }));
            let data = JSON.stringify({ Name: editedUser.name, Password: editedUser.password, Email: editedUser.email });
			//TODO: hibakezelés
			fetch('api/user/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: data
			})
				.then((response) => {
					dispatch({ type: 'TOGGLE_USER_DIALOG', open: false });
				});
		}

	},
	setUsersList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

		//TODO: hibakezelés
		fetch('api/user/list', {
			method: 'GET',
		})
			.then(response => response.json()).then((response) => {
				dispatch({ type: 'SET_USERS_LIST', usersList: response });
			});
	},

	modifyEditedUser: ({ id = '', name = '', email = '', password = '' }: { id?: string, name?: string, email?: string, password?: string }): AppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'MODIFY_EDITED_USER', user: { id, name, email, password } });
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
