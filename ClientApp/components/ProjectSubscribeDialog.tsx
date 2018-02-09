import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';

import * as ProjectStore from '../store/Project';

// At runtime, Redux will merge together...

type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

interface ProjectSubscribeType {
    selectedProjectId: string | null;
}

export class ProjectSubscribeDialog extends React.Component<ProjectProps, any> {

    state: ProjectSubscribeType = {
        selectedProjectId: null
    }
    componentDidMount() {

    }

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {

        //fel fog nyílni a dialógusablak
        if (this.props.projectSubscribeDialog.open == false
            && nextProps.projectSubscribeDialog.open == true) {
            let key;
            if (nextProps.projectSubscribeDialog.subscribedMentor) {
                key = nextProps.projectSubscribeDialog.subscribedMentor.projectCampusId;
            } else if (nextProps.projectSubscribeDialog.subscribedStudent) {
                key = nextProps.projectSubscribeDialog.subscribedStudent.projectCampusId;
            }
            this.setState({
                selectedProjectId: key
            });
            //be fog záródni a dialógusablak
        } else if (this.props.projectSubscribeDialog.open == true
            && nextProps.projectSubscribeDialog.open == false) {
            this.setState({
                selectedProjectId: null
            });
        }

    }

    public render() {

        const { projectSubscribeDialog: { subscribedMentor, subscribedStudent } } = this.props;
        return <div>
            <Dialog
                aria-labelledby="project-dialog-title"
                title="Projekt jelentkezés módosítása"
                open={this.props.projectSubscribeDialog ? this.props.projectSubscribeDialog.open : false}
            >
                <DialogTitle id="project-dialog-title">Projekt jelentkezés módosítása</DialogTitle>
                <DialogContent>
                    {(subscribedMentor && subscribedMentor.mentor) &&
                        <TextField
                            label="Név"
                            value={subscribedMentor.mentor.name}
                            disabled={true}
                        />

                    }
                    {(subscribedStudent && subscribedStudent.student) &&
                        <TextField
                            label="Név:"
                            value={subscribedStudent.student.name}
                            disabled={true}
                        />

                    }
                    <br />
                    <InputLabel htmlFor="subscribed-project">Jelentkezett project</InputLabel>
                    <Select
                    
                        value={
                            /*this.state.selectedProjectId ? this.state.selectedProjectId : null*/
							this.state.selectedProjectId!
                        }
                        onChange={(event) => {
                            this.setState({ selectedProjectId: event.target.value })
                        }}
                        inputProps={{
                            name: 'subscribed-project',
                            id: 'subscribed-project',
                        }}
                    >
                        {this.props.projectSubscribeDialog.projectList.map((project, index) => (
                            <MenuItem key={index} value={project.projectCampusId!}
                            >
                            {project.name}
                            </MenuItem>
                        ))
                        }
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={
                            () => {
                                if (subscribedMentor) {
                                    this.props.modifyMentorProjectSubscribe({
                                        subscribedMentorId: subscribedMentor.subscribedMentorId,
                                        projectCampusId: this.state.selectedProjectId!
                                    });
                                } else if (subscribedStudent) {
                                    this.props.modifyStudentProjectSubscribe({
                                        subscribedStudentId: subscribedStudent.subscribedStudentId,
                                        projectCampusId: this.state.selectedProjectId!
                                    });
                                }

                            }} >
                        Módosítás
                    </Button>
                    <Button
                        color="primary"
                        onClick={
                            () => { this.props.toggleProjectSubscribeDialog(false, {}) }}
                    >
                        Mégse
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    }
}

export default connect(
    (state: ApplicationState) => state.project,
    ProjectStore.actionCreators)
    (ProjectSubscribeDialog) as React.ComponentClass<{}>;
