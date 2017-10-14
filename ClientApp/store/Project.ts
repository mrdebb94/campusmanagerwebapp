import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { isEmpty } from '../utils/helper'
import * as moment from 'moment';
import { Campus, campusServices } from './Campus'

export interface ProjectStatus {
    value: string;
}

export interface Project {
    projectCampusId?: string | null;
    projectId: string | null;
    name: string;
    description: string;
    campus?: Campus;
    projectStatus?: ProjectStatus;
}

export interface ProjectState {
    projectList: Project[];
    editedProject?: Project;
    projectDialog: {
        open: boolean,
        mode: string,
        campusList: Campus[],
        projectList: Project[]
    };
}

interface SetProjectListAction {
    type: 'SET_PROJECT_LIST';
    projectList: Project[];
}

interface AddProjectAction {
    type: 'ADD_PROJECT';
    project: Project;
}

interface ModifyEditedProjectAction {
    type: 'MODIFY_EDITED_PROJECT';
    project: Project;
}

interface ToggleProjectDialog {
    type: 'TOGGLE_PROJECT_DIALOG';
    status: { open: boolean, mode: string, campusList: Campus[], projectList: Project[] };
}


type KnownAction = SetProjectListAction | AddProjectAction | ToggleProjectDialog | ModifyEditedProjectAction;

export const projectServices = {

    listCurrentProject: (): Promise<any> => new Promise((resolve) => {
        fetch('api/project/current/list', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(response => {

                //TODO: nem lenne elég csak a moment-es részt módosítani,
                //TODO: ha a többi egyezik?

                let projectList = response.map((project) => ({
                    projectCampusId: project.projectCampusId,
                    name: project.name,
                    description: project.description,
                    campus: {
                        campusId: project.campus.campusId,
                        startDate: moment(project.campus.startDate),
                        endDate: moment(project.campus.endDate)
                    },
                    projectStatus: {
                        value: project.projectStatus.value
                    }
                }));
                resolve(projectList);
            });
    }),
    listContinuableProject: (): Promise<any> => new Promise((resolve) => {
        fetch('api/project/continuable/list', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(response => {
                let projectList = response.map((project) => ({
                    projectId: project.projectId,
                    name: project.name,
                    description: project.description,
                }));
                resolve(projectList);
            });
    }),
    addProject: (editedProject, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            Name: editedProject.name,
            Description: editedProject.description,
            ProjectStatus: {
                Value: editedProject.projectStatus.value
            },
            Campus: {
                CampusId: editedProject.campus.campusId
            },
            ProjectId : editedProject.projectId
        });

        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/project/add', {
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

    addProject: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { project: { editedProject } } = getState();
        let { session } = getState();

        if (editedProject) {

            projectServices.addProject(editedProject, session.xsrfToken).then((response) => {

                projectServices.listCurrentProject().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let projectList: Project[] = response as Project[];
                    dispatch({ type: 'SET_PROJECT_LIST', projectList });

                    dispatch({
                        type: 'TOGGLE_PROJECT_DIALOG', status: {
                            open: false,
                            mode: '',
                            campusList: [],
                            projectList: []
                        }
                    });
                });

            });
        }

    },

    setProjectList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        //TODO: hibakezelés
        projectServices.listCurrentProject().then((response) => {
            //TODO: valahogy a Promise-ba definiálni
            let projectList: Project[] = response as Project[];
            dispatch({ type: 'SET_PROJECT_LIST', projectList });
        });
    },

    //TODO: hozzáfűzés ne a Component-ben legyen, hanem itt!
    modifyEditedProject: ({
        projectCampusId = null,
        projectId = null,
        name = '',
        description = '',
        campus,
        projectStatus,

        }:
        {
            projectCampusId?: string | null,
            projectId?: string | null,
            name?: string,
            description?: string,
            campus?: Campus,
            projectStatus?: ProjectStatus

        }): AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({
                type: 'MODIFY_EDITED_PROJECT', project: {
                    projectCampusId, projectId, name, description, campus, projectStatus
                }
            });
        },

    toggleProjectDialog: (open: boolean, mode: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        campusServices.listCampus().then(campusList => {
            projectServices.listContinuableProject().then(projectList => {
                dispatch({ type: 'TOGGLE_PROJECT_DIALOG', status: { open, mode, campusList, projectList } });
            });
        });
    },

};
const initialState: ProjectState = { projectList: [], projectDialog: { 
    open: false, mode: '', campusList: [], projectList:[] } };

export const reducer: Reducer<ProjectState> = (state = initialState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'TOGGLE_PROJECT_DIALOG': {
            return {
                ...state,
                projectDialog: { ...action.status }
            };
        }
        case 'SET_PROJECT_LIST': {
            return {
                ...state,
                projectList: action.projectList
            };
        }
        case 'MODIFY_EDITED_PROJECT': {
            return {
                ...state,
                editedProject: { ...action.project }
            };
        }

        default: {
            return state;
        }

    }
};

