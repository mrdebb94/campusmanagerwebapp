import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

import * as moment from 'moment';

import { Mentor, Student } from './CampusParticipation'

export interface ProjectMeeting {
    projectMeetingId?: string;
    startTime?: moment.Moment;
    endTime?: moment.Moment;
    room: string;
    description: string;
    isCancelled: boolean;
    hasWeekly: boolean;
}

export interface TeamMember {
    teamMemberId: string;
    student: Student;
}

export interface TeamMemberRating { 
   teamMemberRatingId: string;
   text:string;
   editable:boolean;
   projectLeaderName:string; 
   teamMemberName:string;  
}

export interface ProjectLeader {
    projectLeaderId: string;
    mentor: Mentor;
}

export interface TeamMemberParticipationMeeting {
    teamMemberParticipationMeetingId?: string;
    teamMemberName: string;
    checked: boolean;
    teamMemberRating:TeamMemberRating[];
}

export interface ProjectLeaderParticipationMeeting {
    projectLeaderParticipationMeetingId?: string;
    projectLeaderName: string;
    checked: boolean;
}


export interface ProjectMeetingDetails {
    projectMeeting: ProjectMeeting;
    teamMemberParticipationMeetings: TeamMemberParticipationMeeting[];
    projectLeaderParticipationMeetings: ProjectLeaderParticipationMeeting[];
}

export interface ProjectDetailsState {
    projectMeetingList: ProjectMeeting[];
    projectMeetingDialog: { open: boolean, mode: string };
    projectMeetingDetails?: ProjectMeetingDetails;
}

interface SetProjectMeetingListAction {
    type: 'SET_PROJECT_MEETING_LIST';
    projectMeetingList: ProjectMeeting[];
}

interface SetProjectMeetingDetailsAction {
    type: 'SET_PROJECT_MEETING_DETAILS';
    projectMeetingDetails: ProjectMeetingDetails;
}

interface UnSetProjectMeetingDetailsAction {
    type: 'UNSET_PROJECT_MEETING_DETAILS';
}


interface AddProjectMeetingAction {
    type: 'ADD_PROJECT_MEETING';
    projectMeeting: ProjectMeeting;
}

interface ToggleProjectMeetingDialogAction {
    type: 'TOGGLE_PROJECT_MEETING_DIALOG';
    status: { open: boolean, mode: string };
}

type KnownAction = SetProjectMeetingListAction | AddProjectMeetingAction
    | ToggleProjectMeetingDialogAction | SetProjectMeetingDetailsAction | UnSetProjectMeetingDetailsAction;

//services

export const projectDetailsServices = {
    getProjectMeetingDetails: (id: string): Promise<any> => new Promise<any>((resolve, reject) => {
        fetch(`api/projectdetails/projectmeetings/details/${id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(projectMeeting => {
                let projectMeetingDetail: ProjectMeetingDetails = {
                    projectMeeting: {
                        ...projectMeeting,
                        startTime: moment(projectMeeting.startTime),
                        endTime: moment(projectMeeting.endTime),
                    },
                    teamMemberParticipationMeetings: projectMeeting.teamMemberParticipationMeetings,
                    projectLeaderParticipationMeetings: projectMeeting.projectLeaderParticipationMeetings
                }

                resolve(projectMeetingDetail);
            });
    }),
    listProjectMeetings: (): Promise<any> => new Promise<any>((resolve, reject) => {
        fetch('api/projectdetails/projectmeetings/list', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => response.json())
            .then(projectMeetings => {
                let projectMeetingList = projectMeetings.map(projectMeeting => ({
                    ...projectMeeting,
                    startTime: moment(projectMeeting.startTime),
                    endTime: moment(projectMeeting.endTime)
                }))
                resolve(projectMeetingList);
            });
    }),
    addProjectMeeting: (projectMeeting: ProjectMeeting, xsrfToken: string): Promise<any> =>
        new Promise<any>((resolve, reject) => {

            let data = JSON.stringify({
                StartTime: projectMeeting.startTime!.utc().format(),
                EndTime: projectMeeting.endTime!.utc().format(),
                HasWeekly: projectMeeting.hasWeekly,
                Description: projectMeeting.description,
                Room: projectMeeting.room
            });

            console.log(data);

            let headers = {};

            headers['Content-Type'] = 'application/json';
            headers['X-XSRF-TOKEN'] = xsrfToken;

            fetch('api/projectdetails/projectmeetings/add', {
                method: 'POST',
                headers,
                body: data,
                credentials: 'same-origin'
            }).then(response => { resolve(response) });

        }),

    saveProjectMeetingParticipations:
    (projectMeetingDetails: ProjectMeetingDetails, xsrfToken: string): Promise<any> =>
        new Promise<any>((resolve, reject) => {

            let data = JSON.stringify({
                ProjectMeetingId: projectMeetingDetails.projectMeeting.projectMeetingId,
                TeamMemberParticipationMeetings: projectMeetingDetails.teamMemberParticipationMeetings,
                ProjectLeaderParticipationMeetings: projectMeetingDetails.projectLeaderParticipationMeetings
            });

            let headers = {};

            headers['Content-Type'] = 'application/json';
            headers['X-XSRF-TOKEN'] = xsrfToken;

            fetch('api/projectdetails/projectmeetings/participations/save', {
                method: 'POST',
                headers,
                body: data,
                credentials: 'same-origin'
            }).then(response => { resolve(response) });


        }),

        //projectmeetings/ratings/save
        saveTeamMemberRating:
        (teamMemberRating: TeamMemberRating, xsrfToken: string): Promise<any> =>
            new Promise<any>((resolve, reject) => {
                let data = JSON.stringify({
                    TeamMemberRatingId: teamMemberRating.teamMemberRatingId,
                    Text: teamMemberRating.text
                });
    
                let headers = {};
    
                headers['Content-Type'] = 'application/json';
                headers['X-XSRF-TOKEN'] = xsrfToken;
    
                fetch('api/projectdetails/projectmeetings/ratings/save', {
                    method: 'POST',
                    headers,
                    body: data,
                    credentials: 'same-origin'
                }).then(response => { resolve(response) });
    
            })
};

//actioncreators
export const actionCreators = {

    getProjectMeetingDetails: (id: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        projectDetailsServices.getProjectMeetingDetails(id).then((response) => {

            let projectMeetingDetails: ProjectMeetingDetails = response as ProjectMeetingDetails;
            console.log(projectMeetingDetails);
            dispatch({ type: 'SET_PROJECT_MEETING_DETAILS', projectMeetingDetails });
        });
    },

    unSetProjectMeetingDetails: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({ type: 'UNSET_PROJECT_MEETING_DETAILS' });
    },

    setProjectMeetingList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        projectDetailsServices.listProjectMeetings().then((response) => {

            let projectMeetingList: ProjectMeeting[] = response as ProjectMeeting[];
            dispatch({ type: 'SET_PROJECT_MEETING_LIST', projectMeetingList });
        });
    },

    addProjectMeeting: (projectMeeting): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let { session } = getState();

        console.log(projectMeeting);
        projectDetailsServices.addProjectMeeting(projectMeeting, session.xsrfToken!).then((response) => {
            dispatch({ type: 'TOGGLE_PROJECT_MEETING_DIALOG', status: { open: false, mode: '' } });
        });

    },
    toggleProjectMeetingDialog: (open: boolean, mode: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_PROJECT_MEETING_DIALOG', status: { open, mode } });
    },

    editTeamMemberParticipationMeetings: (index: number, checked: boolean)
        : AppThunkAction<KnownAction> => (dispatch, getState) => {
            let { projectDetails: { projectMeetingDetails } } = getState();

            if (projectMeetingDetails) {
                let teamMemberParticipationMeetings = [...projectMeetingDetails.teamMemberParticipationMeetings];
                teamMemberParticipationMeetings[index].checked = checked;
                projectMeetingDetails.teamMemberParticipationMeetings = teamMemberParticipationMeetings;
                dispatch({ type: 'SET_PROJECT_MEETING_DETAILS', projectMeetingDetails });
            }
        },
    editProjectLeaderParticipationMeetings: (index: number, checked: boolean)
        : AppThunkAction<KnownAction> => (dispatch, getState) => {
            let { projectDetails: { projectMeetingDetails } } = getState();

            if (projectMeetingDetails) {
                let projectLeaderParticipationMeetings = [...projectMeetingDetails.projectLeaderParticipationMeetings];
                projectLeaderParticipationMeetings[index].checked = checked;
                projectMeetingDetails.projectLeaderParticipationMeetings = projectLeaderParticipationMeetings;
                dispatch({ type: 'SET_PROJECT_MEETING_DETAILS', projectMeetingDetails });
            }
        },
    saveProjectMeetingParticipations: ()
        : AppThunkAction<KnownAction> => (dispatch, getState) => {
            let { projectDetails: { projectMeetingDetails } } = getState();
            let { session } = getState();

            projectDetailsServices.saveProjectMeetingParticipations(projectMeetingDetails!,
                session.xsrfToken!).then(
                (response) => {
                    /*projectDetailsServices
                    .getProjectMeetingDetails(projectMeetingDetails!.projectMeeting.projectMeetingId!)
                    .then((response) => {
                        let projectMeetingDetails: ProjectMeetingDetails = response as ProjectMeetingDetails;
                        console.log(projectMeetingDetails);
                        dispatch({ type: 'SET_PROJECT_MEETING_DETAILS', projectMeetingDetails });
                    });*/
                }
                )

        },
        saveTeamMemberRating: (teamMemberRating: TeamMemberRating)
        : AppThunkAction<KnownAction> => (dispatch, getState) => {
            let { session } = getState();

            projectDetailsServices.saveTeamMemberRating(teamMemberRating,
                session.xsrfToken!).then(
                (response) => {
                    /*projectDetailsServices
                    .getProjectMeetingDetails(projectMeetingDetails!.projectMeeting.projectMeetingId!)
                    .then((response) => {
                        let projectMeetingDetails: ProjectMeetingDetails = response as ProjectMeetingDetails;
                        console.log(projectMeetingDetails);
                        dispatch({ type: 'SET_PROJECT_MEETING_DETAILS', projectMeetingDetails });
                    });*/
                }
                )

        }

}

//reduce
const initialState: ProjectDetailsState = {
    projectMeetingList: [],
    projectMeetingDialog: { open: false, mode: '' }
};

export const reducer: Reducer<ProjectDetailsState> = (state = initialState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SET_PROJECT_MEETING_LIST': {
            return {
                ...state,
                projectMeetingList: action.projectMeetingList
            }
        }
        case 'TOGGLE_PROJECT_MEETING_DIALOG': {
            return {
                ...state,
                projectMeetingDialog: { ...action.status }
            };
        }
        case 'SET_PROJECT_MEETING_DETAILS': {
            return {
                ...state,
                projectMeetingDetails: { ...action.projectMeetingDetails }
            };
        }
        case 'UNSET_PROJECT_MEETING_DETAILS': {
            return {
                ...state,
                projectMeetingDetails:undefined
            };
        }
        default:
            return state;
    }
}