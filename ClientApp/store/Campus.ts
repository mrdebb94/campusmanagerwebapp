import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import * as moment from 'moment';

export interface Campus {
    id?: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    active: boolean;
}

export interface CampusState {
    campusList: Campus[];
    editedCampus?: Campus;
    openCampusDialog: boolean;
    activeCampus?: Campus;
}

interface SetCampusListAction {
    type: 'SET_CAMPUS_LIST';
    campusList: Campus[];
}

interface AddCampusAction {
    type: 'ADD_CAMPUS';
    campus: Campus;
}

interface ModifyEditedCampusAction {
    type: 'MODIFY_EDITED_CAMPUS';
    campus: Campus;
}

interface ToggleCampusDialog {
    type: 'TOGGLE_CAMPUS_DIALOG';
    open: boolean;

}

type KnownAction = SetCampusListAction | AddCampusAction | ToggleCampusDialog | ModifyEditedCampusAction;

export const campusServices = {
    listCampus: (): Promise<any> => new Promise((resolve) => {
        fetch('api/campus/list', {
            method: 'GET',
        }).then(response => response.json())
            .then(response => {
                let campusList = response.map((campus) => ({
                    id: campus.campusId,
                    startDate: moment(campus.startDate),
                    endDate: moment(campus.endDate),
                    active: campus.active
                }));
                resolve(campusList);
            });
    }),
    addCampus: (editedCampus): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            StartDate: editedCampus.startDate.format(),
            EndDate: editedCampus.endDate.format(),
            Active: editedCampus.active
        });

        fetch('api/campus/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then((response) => {
            resolve(response);
        });

    })
}

export const actionCreators = {
    addCampus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { campus: { editedCampus } } = getState();

        if (editedCampus) {

            campusServices.addCampus(editedCampus).then((response) => {

                campusServices.listCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let campusList:Campus[] = response as Campus[];
                    dispatch({ type: 'SET_CAMPUS_LIST', campusList });

                    dispatch({ type: 'TOGGLE_CAMPUS_DIALOG', open: false });
                });

            });
        }

    },
    setCampusList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        //TODO: hibakezelés
        campusServices.listCampus().then((response) => {
            //TODO: valahogy a Promise-ba definiálni
            let campusList:Campus[] = response as Campus[];
            dispatch({ type: 'SET_CAMPUS_LIST', campusList });
        });
    },

    //TODO: hozzáfűzés ne a Component-ben legyen, hanem itt!
    modifyEditedCampus: ({ id = '', startDate = moment(), endDate = moment(), active = false }: { id?: string, startDate?: moment.Moment, endDate?: moment.Moment, active?: boolean }): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'MODIFY_EDITED_CAMPUS', campus: { id, startDate, endDate, active } });
    },

    toggleCampusDialog: (open: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_CAMPUS_DIALOG', open });
    }

};
const initialState: CampusState = { campusList: [], openCampusDialog: false };

export const reducer: Reducer<CampusState> = (state = initialState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'TOGGLE_CAMPUS_DIALOG': {
            return {
                ...state,
                openCampusDialog: action.open
            };
        }
        case 'SET_CAMPUS_LIST': {
            return {
                ...state,
                campusList: action.campusList
            };
        }
        case 'MODIFY_EDITED_CAMPUS': {
            return {
                ...state,
                editedCampus: { ...action.campus }
            };
        }
        default: {
            return state;
        }

    }
};

