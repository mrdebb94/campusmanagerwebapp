import 'whatwg-fetch';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { isEmpty } from '../utils/helper'
import * as moment from 'moment';
import { Campus, campusServices } from './Campus';
import { Mentor, Student } from './CampusParticipation';

export interface ProjectStatus {
    value: string;
}

export interface SubscribedMentor {
    subscribedMentorId: string,
    projectCampusId: string,

}

export interface SubscribedMentorData extends SubscribedMentor {
    subscribedMentorId: string,
    projectCampusId: string,
    mentor: Mentor;
}

export interface SubscribedStudent {
    subscribedStudentId: string,
    projectCampusId: string
}

export interface SubscribedStudentData extends SubscribedStudent {
    subscribedStudentId: string,
    projectCampusId: string,
    student: Student;
}

//TODO: ProjectDetails status
export interface Project {
    projectCampusId: string | null;
    projectId: string | null;
    name: string;
    description: string;
    campus?: Campus;
    projectStatus?: ProjectStatus;
    subscribedMentors: SubscribedMentorData[];
    subscribedStudents: SubscribedStudentData[];
}

//tárolja, hogy a bejelentkezett felhasználó melyikre jelentkezett már
export interface ActiveProject extends Project {
    subscribed: boolean;
}

export interface ProjectState {
    projectList: Project[];
    activeProjectList: ActiveProject[];
    editedProject?: Project;
    projectDialog: {
        open: boolean,
        mode: string,
        campusList: Campus[],
        projectList: Project[]
    };

    projectSubscribeDialog: {
        open: boolean,
        mode: string,
        subscribedMentor?: SubscribedMentorData,
        subscribedStudent?: SubscribedStudentData,
        projectList: ActiveProject[];
    };
}

interface SetProjectListAction {
    type: 'SET_PROJECT_LIST';
    projectList: Project[];
}

interface SetActiveProjectListAction {
    type: 'SET_ACTIVE_PROJECT_LIST';
    projectList: ActiveProject[];
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

interface ToggleProjectSubscribeDialog {
    type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG';
    status: {
        open: boolean, mode: string, projectList: ActiveProject[], subscribedMentor?: SubscribedMentorData,
        subscribedStudent?: SubscribedStudentData
    };
}

interface SignalrProjectSubscribe {
    type: 'SIGNALR_PROJECT_SUBSCRIBE';
    projectCampusId: string;
}

interface SignalrProjectUnSubscribe {
    type: 'SIGNALR_PROJECT_UNSUBSCRIBE';
    projectCampusId: string;
}

type KnownAction = SetProjectListAction | AddProjectAction |
    ToggleProjectDialog | ModifyEditedProjectAction | SetActiveProjectListAction | ToggleProjectSubscribeDialog
    | SignalrProjectSubscribe | SignalrProjectUnSubscribe;

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
                    subscribedMentors: project.subscribedMentors,
                    subscribed: project.subscribed
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

    unSubscribeProject: (projectCampusId, xsrfToken): Promise<any> => new Promise((resolve) => {

        let data = JSON.stringify({
            ProjectCampusId: projectCampusId
        });

        let headers = {};

        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken;

        fetch('api/project/unsubscribe', {
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

    }),

    modifyMentorProjectSubscribe: (subscribedMentor: SubscribedMentor, xsrfToken: string): Promise<any> =>
        new Promise((resolve, reject) => {
            let data = JSON.stringify({
                SubscribedMentorId: subscribedMentor.subscribedMentorId,
                ProjectCampusId: subscribedMentor.projectCampusId
            });

            let headers = {};

            headers['Content-Type'] = 'application/json';
            headers['X-XSRF-TOKEN'] = xsrfToken;

            fetch('api/project/subscribes/mentor/modify', {
                method: 'POST',
                headers,
                body: data,
                credentials: 'same-origin'
            }).then((response) => {
                resolve(response);
            });
        }),
    modifyStudentProjectSubscribe: (subscribedStudent: SubscribedStudent, xsrfToken: string): Promise<any> =>
        new Promise((resolve, reject) => {
            let data = JSON.stringify({
                SubscribedStudentId: subscribedStudent.subscribedStudentId,
                ProjectCampusId: subscribedStudent.projectCampusId
            });

            let headers = {};

            headers['Content-Type'] = 'application/json';
            headers['X-XSRF-TOKEN'] = xsrfToken;

            fetch('api/project/subscribes/student/modify', {
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

    addProject: (editedProject: Project): AppThunkAction<KnownAction> => (dispatch, getState) => {

        //let { project: { editedProject } } = getState();
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
            let projectList: ActiveProject[] = response as ActiveProject[];
            console.log(projectList);
            dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
        });
    },
    setProjectSubscriberList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList: [] });
        //TODO: hibakezelés
        projectServices.listProjectSubscribersInCurrentCampus().then((response) => {
            //TODO: valahogy a Promise-ba definiálni
            let projectList: ActiveProject[] = response as ActiveProject[];
            console.log(projectList);
            dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
        });
    },

    //TODO: hozzáfűzés ne a Component-ben legyen, hanem itt!
    //TODO: ahhoz itt is (dispatch, getState) -t kell használni!
    modifyEditedProject: ({
        projectCampusId = null,
        projectId = '',
        name = '',
        description = '',
        campus,
        projectStatus,
        subscribedMentors = [],
        subscribedStudents = []
    }:
        {
            projectCampusId?: string | null,
            projectId?: string,
            name?: string,
            description?: string,
            campus?: Campus,
            projectStatus?: ProjectStatus,
            subscribedMentors?: SubscribedMentorData[];
            subscribedStudents?: SubscribedStudentData[];

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

    toggleProjectSubscribeDialog: (open: boolean, { subscribedMentor, subscribedStudent }
        : { subscribedMentor?: SubscribedMentorData, subscribedStudent?: SubscribedStudentData }):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            if (open) {
                projectServices.listActiveProjectInCurrentCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let projectList: ActiveProject[] = response as ActiveProject[];
                    //console.log(projectList);
                    dispatch({
                        type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG', status: {
                            open, mode: "", projectList, subscribedMentor, subscribedStudent
                        }
                    });

                });
            } else {
                dispatch({
                    type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG', status: {
                        open, mode: "", projectList: [], subscribedMentor: undefined, subscribedStudent: undefined
                    }
                });
            }
        },

    subscribeProject: (projectCampusId): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { session } = getState();
        projectServices.subscribeProject(projectCampusId, session.xsrfToken).then(
            (response) => {
                console.log(response);
                projectServices.listActiveProjectInCurrentCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let projectList: ActiveProject[] = response as ActiveProject[];
                    console.log(projectList);
                    dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                });
            }
        );
    },

    unSubscribeProject: (projectCampusId): AppThunkAction<KnownAction> => (dispatch, getState) => {

        let { session } = getState();
        projectServices.unSubscribeProject(projectCampusId, session.xsrfToken).then(
            (response) => {
                console.log(response);
                projectServices.listActiveProjectInCurrentCampus().then((response) => {
                    //TODO: valahogy a Promise-ba definiálni
                    let projectList: ActiveProject[] = response as ActiveProject[];
                    console.log(projectList);
                    dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                });
            }
        );
    },

    approveStudentProjectSubscribe: (subscribedStudentId): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();
        projectServices.approveStudentProjectSubscribe(subscribedStudentId, session.xsrfToken).then(
            (response) => {
                console.log(response);
                projectServices.listProjectSubscribersInCurrentCampus().then((response) => {
                    let projectList: ActiveProject[] = response as ActiveProject[];
                    console.log(projectList);
                    dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                });
            }
        )
    },

    approveMentorProjectSubscribe: (subscribedMentorId): AppThunkAction<KnownAction> =>
        (dispatch, getState) => {
            let { session } = getState();
            projectServices.approveMentorProjectSubscribe(subscribedMentorId, session.xsrfToken).then(
                (response) => {
                    console.log(response);
                    projectServices.listProjectSubscribersInCurrentCampus().then((response) => {
                        let projectList: ActiveProject[] = response as ActiveProject[];
                        console.log(projectList);
                        dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                    });
                }
            )
        },

    modifyMentorProjectSubscribe: (subscribedMentor: SubscribedMentor): AppThunkAction<KnownAction> =>
        (dispatch, getState) => {
            let { session } = getState();

            projectServices.modifyMentorProjectSubscribe(subscribedMentor, session.xsrfToken!).then(
                (response) => {
                    console.log(response);
                    projectServices.listProjectSubscribersInCurrentCampus().then((response) => {
                        let projectList: ActiveProject[] = response as ActiveProject[];
                        console.log(projectList);
                        dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                        dispatch({
                            type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG', status: {
                                open: false, mode: "", projectList: [], subscribedMentor: undefined, subscribedStudent: undefined
                            }
                        });
                    });
                    /*dispatch({
                        type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG', status: {
                            open:false, mode: "", projectList:[], subscribedMentor:undefined, subscribedStudent:undefined
                        }
                    });*/
                }
            );
        },

    modifyStudentProjectSubscribe: (subscribedStudent: SubscribedStudent): AppThunkAction<KnownAction> =>
        (dispatch, getState) => {
            let { session } = getState();

            projectServices.modifyStudentProjectSubscribe(subscribedStudent, session.xsrfToken!).then(
                (response) => {
                    console.log(response);
                    projectServices.listProjectSubscribersInCurrentCampus().then((response) => {
                        let projectList: ActiveProject[] = response as ActiveProject[];
                        console.log(projectList);
                        dispatch({ type: 'SET_ACTIVE_PROJECT_LIST', projectList });
                        dispatch({
                            type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG', status: {
                                open: false, mode: "", projectList: [],
                                subscribedMentor: undefined, subscribedStudent: undefined
                            }
                        });
                    });
                    /*dispatch({
                        type: 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG', status: {
                            open:false, mode: "", projectList:[], subscribedMentor:undefined, subscribedStudent:undefined
                        }
                    });*/
                }
            );
        },
    subscribeProjectSignalR: (projectCampusId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_PROJECT_SUBSCRIBE', projectCampusId });

    },
    unSubscribeProjectSignalR: (projectCampusId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_PROJECT_UNSUBSCRIBE', projectCampusId });

    },

};
const initialState: ProjectState = {
    projectList: [], activeProjectList: [], projectDialog: {
        open: false, mode: '', campusList: [], projectList: []
    },
    projectSubscribeDialog: {
        open: false, mode: '', projectList: []
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
        case 'TOGGLE_PROJECT_SUBSCRIBE_DIALOG': {
            return {
                ...state,
                projectSubscribeDialog: { ...action.status }
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

