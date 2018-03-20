import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';
import * as CampusStore from '../store/Campus';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';


const styles = {
    block: {
        maxWidth: 250,
    },
    checkbox: {
        marginBottom: 16,
    }
};

/*const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    block: {
        maxWidth: 250,
    },
    checkbox: {
        marginBottom: 16,
    }
  });*/


const dataSourceConfig = {
    text: 'name',
    value: 'projectId',
};


type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

interface ProjectDialogState {
    projectContinueDisabled: boolean;
    projectContinueChecked: boolean;
    /*selectedProject?: ProjectStore.Project | null;*/
    selectedProjectIndex: number;
    selectedCampusIndex: number;
    editedProject: ProjectStore.Project;
}

export class ProjectDialog extends React.Component<ProjectProps, ProjectDialogState> {

    constructor(props) {
        super(props);

        this.state = {
            projectContinueDisabled: true,
            projectContinueChecked: false,
            selectedCampusIndex: 0,
            selectedProjectIndex: -1,
            editedProject: {
                name: '',
                description: '',
                projectId: '',
                projectCampusId: null,
                subscribedMentors: [],
                subscribedStudents: [],
                projectStatus: { value: "Active" }

            }


        };
    }


    componentWillReceiveProps(nextProps) {

        //fel fog nyílni a dialógusablak
        if (this.props.projectDialog.open == false
            && nextProps.projectDialog.open == true) {

                this.setState({
                    projectContinueDisabled: true,
                    projectContinueChecked: false,
                    selectedCampusIndex: 0,
                    selectedProjectIndex: -1,
                    editedProject: {
                        name: '',
                        description: '',
                        projectId: '',
                        projectCampusId: null,
                        subscribedMentors: [],
                        subscribedStudents: [],
                        projectStatus: { value: "Active" }
                    }
                });
            
            //be fog záródni a dialógusablak
        } else if (this.props.projectDialog.open == true
            && nextProps.projectDialog.open == false) {
           
        }

    }

    componentDidMount() {
        /*this.props.modifyEditedProject({
            campus: {...this.props.projectDialog.campusList![0]},
            projectStatus: { value: "Active" }
        });*/
    }

    continueProject=(event) => {
           
        if(this.props.projectDialog.projectList.length>0) {                        
			const checked=event.target.checked;
			if (checked) {
			   
				this.setState((prevState, props) => ({
					projectContinueChecked: checked,
					editedProject: {
						...prevState.editedProject,
						projectId: props.projectDialog.projectList![0].projectId
					}
				}));

			} else {
		 
				this.setState((prevState, props) => ({
					projectContinueChecked: checked,
					editedProject: {
						...prevState.editedProject,
						projectId: null
					}
				}));
			}
		}
    }

    render() {

        return <Dialog
            open={this.props.projectDialog.open}
            maxWidth="sm"
            fullWidth
        >   
            <DialogTitle>
             Új projekt létrehozása
            </DialogTitle>
            <DialogContent>
                <div>

                    <div>
                        <div style={styles.block}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        style={styles.checkbox}
                                        onChange={this.continueProject}
                                        checked={this.state.projectContinueChecked}
                                    />
                                }
                                label="Projekt folytatása"
                            />
                        </div>
                        <div>
                            
                            <InputLabel htmlFor="project-helper">Folytatni kívánt projekt</InputLabel>
                            <Select
                                inputProps={{
                                    name: 'project',
                                    id: 'project-helper'
                                }}
                                value={this.state.editedProject.projectId}
                                onChange={(event) => {
                                    
                                    this.setState((prevState, props) => ({
                                        editedProject: {
                                            ...prevState.editedProject,
                                            projectId: event.target.value
                                        }
                                    }));
                                }}
                                disabled={!this.state.projectContinueChecked}
                            >
                          
                                {this.props.projectDialog.projectList!.map((project) =>
                                    <MenuItem key={project.projectId!} value={project.projectId!} >
                                        {
                                            project.name
                                        }
                                    </MenuItem>
                                )}
                            </Select>
                            
                        </div>
                        <div>
                            <TextField
                                label="Projekt név"
                                value={this.state.editedProject.name}
                                onChange={(event) => {
                                    ///this.props.modifyEditedProject({ ...this.props.editedProject, name: target.value }); 
                                    let target = event.target as HTMLInputElement;
                                    this.setState((prevState, props) => ({
                                        editedProject: {
                                            ...prevState.editedProject,
                                            name: target.value
                                        }
                                    }));
                                }}
                                disabled={this.state.projectContinueChecked}
                            />
                        </div>
                        {/*
                    <AutoComplete
                        floatingLabelText="Projekt név"
                        floatingLabelFixed={true}
                        searchText={this.props.editedProject ? this.props.editedProject.name : ''}
                        dataSource={this.props.projectDialog.projectList}
                        dataSourceConfig={dataSourceConfig}
                        onUpdateInput={(searchText, dataSource)=>{
                          
                           this.props.modifyEditedProject({
                                    ...this.props.editedProject,
                                     name: searchText
                                });
                           
                        }}
                        onNewRequest={(chosenRequest, index) => {
                          
                            //nem a listából választottunk projektet
                            if (index == -1) {
                                this.setState({
                                    projectContinueDisabled: true,
                                    projectContinueChecked: false,
                                    selectedProject: null
                                });
                                this.props.modifyEditedProject({
                                    ...this.props.editedProject,
                                    projectId: null, name: chosenRequest
                                });
                            } else {
                                this.setState({
                                    projectContinueDisabled: false,
                                    projectContinueChecked: false,
                                    selectedProject: chosenRequest
                                });

                                this.props.modifyEditedProject({
                                    ...this.props.editedProject,
                                    name: chosenRequest.name
                                });

                            }
                        }}
                    >
                    </AutoComplete>
				*/}
                    </div>

                    <div>
                        <TextField
                            label="Leírás"
                            multiline={true}
                            rows={4}
                            rowsMax={8}
                            value={this.state.editedProject.description}
                            onChange={(event) => {
                                let target = event.target as HTMLInputElement;
                                this.setState((prevState, props) => ({
                                    editedProject: {
                                        ...prevState.editedProject,
                                        description: target.value
                                    }
                                }));
                            }}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="campus-helper">Campus</InputLabel>
                        <Select
                            inputProps={{
                                name: 'campus',
                                id: 'campus-helper',
                            }}
                            value={
                                this.state.selectedCampusIndex
                            }
                            onChange={(event) => {
                                const index: number = parseInt(event.target.value);
                              
                                this.setState((prevState, props) => ({
                                    selectedCampusIndex: index,
                                    editedProject: {
                                        ...prevState.editedProject,
                                        campus: props.projectDialog.campusList![index]
                                    }
                                }));
                            }}
                        >
                            {this.props.projectDialog.campusList!.map((campus, index) =>
                                <MenuItem key={campus.campusId} value={index} >
                                    {
                                        campus.startDate.format('YYYY.MM.DD') + '-' + campus.endDate.format('YYYY.MM.DD')
                                    }
                                </MenuItem>
                            )}
                        </Select>
                        
                    </div>
                    <div>
                        {/*
                        <InputLabel htmlFor="status-helper">Státusz</InputLabel>
                        <Select
                            inputProps={{
                                name: 'status',
                                id: 'status-helper',
                            }}

                            value={this.state.editedProject.projectStatus!.value}
                            onChange={(event) => {

                         
                                this.setState((prevState, props) => ({
                                    projectStatus: { value: event.target.value }
                                }));

                            }}
                        >
                            <MenuItem value="Active">Aktív</MenuItem>
                            <MenuItem value="Inactive">Inaktív</MenuItem>
                            <MenuItem value="Pending">Függőben</MenuItem>
                        </Select>
                        */}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

                <Button color="primary" onClick={(event) => {
                    this.props.addProject(this.state.editedProject);
                }}
                >
                    Létrehozás
				</Button>,

                <Button onClick={() => {
                    this.props.toggleProjectDialog(false, '');
                }}
                >
                    Mégse
				</Button>

            </DialogActions>
        </Dialog>
    }
}



export default connect(
    (state: ApplicationState) => state.project,
    ProjectStore.actionCreators               
)(ProjectDialog) as React.ComponentClass<{}>;