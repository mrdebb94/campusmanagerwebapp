import 'whatwg-fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { isEmpty, transformDateRangeToUtc } from '../utils/helper'
import * as moment from 'moment';

export interface DateRange {
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

export interface Campus {
    campusId?: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    active: boolean;
    campusInactive?: DateRange;
    campusActiveNotStarted?: DateRange;
    campusActiveStarted?: DateRange;
    campusFinished?: DateRange;
}

export interface CampusState {
    campusList: Campus[];
    editedCampus?: Campus;
    campusDialog: { open: boolean, mode: string };
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
    status: { open: boolean, mode: string };

}

interface SetActiveCampus {
    type: 'SET_ACTIVE_CAMPUS';
    activeCampus: Campus;
}


type KnownAction = SetCampusListAction | AddCampusAction | ToggleCampusDialog | ModifyEditedCampusAction
    | SetActiveCampus;

export const campusServices = {

    getActiveCampus: (): Promise<any> => new Promise((resolve) => {
        fetch('api/campus/current', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(campus => {
                console.log(!isEmpty(campus));
                let currentCampus = !isEmpty(campus) ? ({
                    campusId: campus.campusId,
                    startDate: moment(campus.startDate),
                    endDate: moment(campus.endDate),
                    active: campus.active
                }) : undefined;

                resolve(currentCampus);
            });
    }),
    listCampus: (): Promise<any> => new Promise((resolve) => {
        fetch('api/campus/list', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(response => {
                let campusList = response.map((campus) => ({
                    campusId: campus.campusId,
                    startDate: moment(campus.startDate),
                    endDate: moment(campus.endDate),
                    active: campus.active,
                    campusInactive: campus.campusInactive ? ({
                        startDate: moment(campus.campusInactive.startDate),
                        endDate: moment(campus.campusInactive.endDate)
                    }) : null,
                    campusActiveNotStarted: campus.campusActiveNotStarted ? ({
                        startDate: moment(campus.campusActiveNotStarted.startDate),
                        endDate: moment(campus.campusActiveNotStarted.endDate)
                    }) : null
                }));
                resolve(campusList);
            });
    }),
    addCampus: (editedCampus, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            StartDate: editedCampus.startDate.format(),
            EndDate: editedCampus.endDate.format(),
            Active: editedCampus.active,
            CampusInactive: editedCampus.campusInactive
                ? transformDateRangeToUtc(editedCampus.campusInactive)
                : null,
            CampusActiveNotStarted: editedCampus.campusActiveNotStarted
                ? transformDateRangeToUtc(editedCampus.campusActiveNotStarted)
                : null,
            CampusActiveStarted: editedCampus.campusActiveStarted
                ? transformDateRangeToUtc(editedCampus.campusActiveStarted)
                : null,
            CampusFinished: editedCampus.campusFinished
                ? transformDateRangeToUtc(editedCampus.campusFinished)
                : null
        });

        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/campus/add', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            resolve(response);
        });

    }),
    editCampus: (editedCampus, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            CampusId: editedCampus.campusId,
            StartDate: editedCampus.startDate.utc().format(),
            EndDate: editedCampus.endDate.utc().format(),
            Active: editedCampus.active,
            CampusInactive: editedCampus.campusInactive
                ? transformDateRangeToUtc(editedCampus.campusInactive)
                : null,
            CampusActiveNotStarted: editedCampus.campusActiveNotStarted
                ? transformDateRangeToUtc(editedCampus.campusActiveNotStarted)
                : null,
            CampusActiveStarted: editedCampus.campusActiveStarted
                ? transformDateRangeToUtc(editedCampus.campusActiveStarted)
                : null,
            CampusFinished: editedCampus.campusFinished
                ? transformDateRangeToUtc(editedCampus.campusFinished)
                : null
        });

        let headers = {};
        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/campus/edit', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            resolve(response);
        });

    }),
    applyCampus: (campusId, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            CampusId: campusId
        });

        let headers = {};
        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/campus/apply', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            resolve(response);
        });
    }),

}

export const actionCreators = {

    getActiveCampus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        campusServices.getActiveCampus().then(campus => {
            dispatch({ type: 'SET_ACTIVE_CAMPUS', activeCampus: { ...campus } });
        })
    },

    applyActiveCampus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { campus: { activeCampus } } = getState();
        let { session } = getState();
        campusServices.applyCampus(activeCampus!.campusId, session.xsrfToken).then(campus => {
            //dispatch({ type: 'SET_ACTIVE_CAMPUS', activeCampus: { ...campus } });
        })
    },

    addCampus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { campus: { editedCampus } } = getState();
        let { session } = getState();

        if (editedCampus) {

            campusServices.addCampus(editedCampus, session.xsrfToken).then((response) => {

                campusServices.listCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let campusList: Campus[] = response as Campus[];
                    dispatch({ type: 'SET_CAMPUS_LIST', campusList });

                    dispatch({ type: 'TOGGLE_CAMPUS_DIALOG', status: { open: false, mode: '' } });
                });

            });
        }

    },
    editCampus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { campus: { editedCampus } } = getState();
        let { session } = getState();

        if (editedCampus) {

            campusServices.editCampus(editedCampus, session.xsrfToken).then((response) => {

                campusServices.listCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let campusList: Campus[] = response as Campus[];

                    dispatch({ type: 'SET_CAMPUS_LIST', campusList });
                    dispatch({ type: 'TOGGLE_CAMPUS_DIALOG', status: { open: false, mode: '' } });
                });

            });
        }

    },

    setCampusList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        //TODO: hibakezelés
        campusServices.listCampus().then((response) => {
            //TODO: valahogy a Promise-ba definiálni
            let campusList: Campus[] = response as Campus[];
            dispatch({ type: 'SET_CAMPUS_LIST', campusList });
        });
    },

    //TODO: hozzáfűzés ne a Component-ben legyen, hanem itt!
    modifyEditedCampus: ({
            campusId = '',
        startDate = moment(),
        endDate = moment(),
        active = false,
        campusInactive,
        campusActiveNotStarted,
        campusActiveStarted,
        campusFinished
        }:
        {
            campusId?: string,
            startDate?: moment.Moment, endDate?: moment.Moment,
            active?: boolean,
            campusInactive?: DateRange,
            campusActiveNotStarted?: DateRange,
            campusActiveStarted?: DateRange,
            campusFinished?: DateRange,
        }): AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({
                type: 'MODIFY_EDITED_CAMPUS', campus: {
                    campusId, startDate, endDate, active,
                    campusInactive, campusActiveNotStarted, campusActiveStarted, campusFinished
                }
            });
        },

    toggleCampusDialog: (open: boolean, mode: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_CAMPUS_DIALOG', status: { open, mode } });
    },


};
const initialState: CampusState = { campusList: [], campusDialog: { open: false, mode: '' } };

export const reducer: Reducer<CampusState> = (state = initialState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'TOGGLE_CAMPUS_DIALOG': {
            return {
                ...state,
                campusDialog: { ...action.status }
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
        case 'SET_ACTIVE_CAMPUS': {
            return {
                ...state,
                activeCampus: { ...action.activeCampus }
            };
        }
        default: {
            return state;
        }

    }
};

