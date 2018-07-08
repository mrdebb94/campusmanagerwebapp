import 'whatwg-fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { User } from './Users';

export interface Student {
    studentId?: string;
    user: User;
}

export interface Mentor {
    mentorId?: string;
    /*name: string;
    phone: string;*/
	user: User;
}

export interface CampusParticipation {
    campusParticipationId?: string;
    role: string;
    student?: Student;
    mentor?: Mentor;
}

export interface CampusParticipationState {
    campusParticipationList?: CampusParticipation[];
    editedCampusParticipation?: CampusParticipation;
    campusParticipationDialog?: { open: boolean };

}

interface ModifyEditedCampusParticipationAction {
    type: 'MODIFY_EDITED_CAMPUS_PARTICIPATION';
    campusParticipation: CampusParticipation;
}


interface SetCampusParticipations {
    type: 'SET_CAMPUS_PARTICIPATIONS';
    campusParticipations: CampusParticipation[];
}

interface ToggleCampusParticipationDialog {
    type: 'TOGGLE_CAMPUS_PARTICIPATION_DIALOG';
    status: { open: boolean };
}

type KnownAction = SetCampusParticipations | ToggleCampusParticipationDialog
    | ModifyEditedCampusParticipationAction;

export const campusParticipationServices = {

    getCampusParticipations: (): Promise<any> => new Promise((resolve) => {
        fetch("api/campus/current/participations", {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(response => resolve(response))
    }),

    editCampusParticipation: (campusParticipation, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            CampusParticipationId: campusParticipation.campusParticipationId,
            Role: campusParticipation.role
        });

        let headers = {};
        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/campus/changeCampusParticipation', {
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

    editCampusParticipation: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { campusParticipation: { editedCampusParticipation } } = getState();
        let { session } = getState();

        if (editedCampusParticipation) {

            campusParticipationServices.editCampusParticipation(editedCampusParticipation, session.xsrfToken).then((response) => {

                 campusParticipationServices.getCampusParticipations().then(response => {
                  //console.log(response);
                    dispatch({ type: 'SET_CAMPUS_PARTICIPATIONS', campusParticipations: response });
					dispatch({ type: 'TOGGLE_CAMPUS_PARTICIPATION_DIALOG', status: { open: false } });
                });
               // dispatch({ type: 'TOGGLE_CAMPUS_PARTICIPATION_DIALOG', status: { open: false } });

            });
        }

    },
    //TODO: hozzáfűzés ne a Component-ben legyen, hanem itt!
    modifyEditedCampusParticipation: ({
        campusParticipationId = '',
        student,
        mentor,
        role =''
    }:
        {
            campusParticipationId?: string,
            student?: Student,
            mentor?: Mentor,
            role: string
        }): AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({
                type: 'MODIFY_EDITED_CAMPUS_PARTICIPATION', campusParticipation: {
                    campusParticipationId, student, mentor, role:(role==''?(student?'Student':'Mentor'):role)
                }
            });
        },
        toggleCampusParticipationDialog: (open: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({ type: 'TOGGLE_CAMPUS_PARTICIPATION_DIALOG', status: { open } });
        },
    
        getCampusParticipations: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
            campusParticipationServices.getCampusParticipations().then(response => {
                console.log(response);
                dispatch({ type: 'SET_CAMPUS_PARTICIPATIONS', campusParticipations: response });
            });
        }
}

const initialState: CampusParticipationState = { campusParticipationList: [], 
    campusParticipationDialog: { open: false } };

export const reducer: Reducer<CampusParticipationState> = (state = initialState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SET_CAMPUS_PARTICIPATIONS': {
            return {
                ...state,
               campusParticipationList: [...action.campusParticipations]
            };
        }
        case 'TOGGLE_CAMPUS_PARTICIPATION_DIALOG': {
            return {
                ...state,
                campusParticipationDialog: { ...action.status }
            };   
        }
        case 'MODIFY_EDITED_CAMPUS_PARTICIPATION': {
            return {
                ...state,
                editedCampusParticipation: {...action.campusParticipation}
            }
        }
        default: {
            return state;
        }


    }
}