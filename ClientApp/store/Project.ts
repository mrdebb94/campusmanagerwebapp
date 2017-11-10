import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { isEmpty } from '../utils/helper'
import * as moment from 'moment';
import { Campus, campusServices } from './Campus'
import { Mentor, Student } from './CampusParticipation'

export interface ProjectStatus {
    value: string;
}

export interface SubscribedMentor {
    subscribedMentorId: number,
    mentor: Mentor
}

export interface SubscribedStudent {
    subscribedStudentId: number,
    student: Student
}

//TODO: ProjectDetails status
export interface Project {
    projectCampusId: string | null;
    projectId: string | null;
    name: string;
    description: string;
    campus?: Campus;
    projectStatus?: ProjectStatus;
    subscribedMentors: SubscribedMentor[];
    subscribedStudents: SubscribedStudent[];
}

export interface ProjectState {
    projectList: Project[];
    activeProjectList?: Project[];
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

interface SetActiveProjectListAction {
    type: 'SET_ACTIVE_PROJECT_LIST';
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


type KnownAction = SetProjectListAction | AddProjectAction |
    ToggleProjectDialog | ModifyEditedProjectAction | SetActiveProjectListAction;

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
                }
            ));
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
    listActiveProjectInCurrentCampus: (): Promise<any> => new Promise((resolve) => {
        fetch('api/project/current/active/list', {
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
                    },
                    subscribedStudents: project.subscribedStudents,
                    subscribedMentors: project.subscribedMentors
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
            ProjectId: editedProject.projectId
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

    subscribeProject: (projectCampusId, xsrfToken): Promise<any> => new Promise((resolve) => {

        let data = JSON.stringify({
            ProjectCampusId: projectCampusId
        });

        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/project/subscribe', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            resolve(response);
        });

    }),

    listProjectSubscribersInCurrentCampus: (): Promise<any> => new Promise((resolve) => {
        fetch('api/project/subscriber/list', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(response => {

                //TODO: nem lenne elég csak a moment-es részt módosítani,
                //TODO: ha a többi egyezik?
                let projectList = response.map((project) => ({
                    projectCampusId: project.projectCampusId,
                    name: project.name,
                    subscribedStudents: project.subscribedStudents,
                    subscribedMentors: project.subscribedMentors
                }));
                resolve(projectList);
            });
    }),
    
    approveStudentProjectSubscribe: (subscribedStudentId, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            SubscribedStudentId: subscribedStudentId
        });

        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/projectdetails/teammembers/add', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            resolve(response);
        });

    }),
    approveMentorProjectSubscribe: (subscribedMentorId, xsrfToken): Promise<any> => new Promise((resolve) => {
        let data = JSON.stringify({
            SubscribedMentorId: subscribedMentorId
        });

        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/projectdetails/projectleaders/add', {
            method: 'POST',
            headers,
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            resolve(response);
        });

    })
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

    setActiveProjectList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList: [] });
        //TODO: hibakezelés
        projectServices.listActiveProjectInCurrentCampus().then((response) => {
            //TODO: valahogy a Promise-ba definiálni
            let projectList: Project[] = response as Project[];
            console.log(projectList);
            dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
        });
    },
    setProjectSubscriberList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        
                dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList: [] });
                //TODO: hibakezelés
                projectServices.listProjectSubscribersInCurrentCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let projectList: Project[] = response as Project[];
                    console.log(projectList);
                    dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                });
            },
    
    //TODO: hozzáfűzés ne a Component-ben legyen, hanem itt!
    //TODO: ahhoz itt is (dispatch, getState) -t kell használni!
    modifyEditedProject: ({
        projectCampusId = null,
        projectId = null,
        name = '',
        description = '',
        campus,
        projectStatus,
        subscribedMentors=[],
        subscribedStudents=[]
        }:
        { 
            projectCampusId?: string | null,
            projectId?: string | null,
            name?: string,
            description?: string,
            campus?: Campus,
            projectStatus?: ProjectStatus,
            subscribedMentors?: SubscribedMentor[];
            subscribedStudents?: SubscribedStudent[];

        }): AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({
                type: 'MODIFY_EDITED_PROJECT', project: {
                    projectCampusId, projectId, name, description, campus, projectStatus,
                    subscribedMentors, subscribedStudents
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

    subscribeProject: (projectCampusId): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { session } = getState();
        projectServices.subscribeProject(projectCampusId, session.xsrfToken).then(
            (response) => {
               console.log(response);
            }
        );
    },

    approveStudentProjectSubscribe: (subscribedStudentId) : AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();
        projectServices. approveStudentProjectSubscribe(subscribedStudentId, session.xsrfToken).then(
            (response) => {
                console.log(response);
             }
        )
    },

    approveMentorProjectSubscribe: (subscribedMentorId) : AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();
        projectServices. approveMentorProjectSubscribe(subscribedMentorId, session.xsrfToken).then(
            (response) => {
                console.log(response);
             }
        )
    }

};
const initialState: ProjectState = {
    projectList: [], projectDialog: {
        open: false, mode: '', campusList: [], projectList: []
    }
};

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
        case 'SET_ACTIVE_PROJECT_LIST': {
            return {
                ...state,
                activeProjectList: [...action.projectList]
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

