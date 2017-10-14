import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';
import * as CampusStore from '../store/Campus';
import { RaisedButton } from 'material-ui';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { Dialog } from 'material-ui';
import { FlatButton } from 'material-ui';
import { TextField } from 'material-ui';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';


const styles = {
    block: {
        maxWidth: 250,
    },
    checkbox: {
        marginBottom: 16,
    }
};

const dataSourceConfig = {
    text: 'name',
    value: 'projectId',
};


type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

interface ProjectDialogState {
    projectContinueDisabled: boolean,
    projectContinueChecked: boolean
    selectedProject?: ProjectStore.Project | null
}

export class ProjectDialog extends React.Component<ProjectProps, ProjectDialogState> {

    constructor() {
        super();

        this.state = {
            projectContinueDisabled: true,
            projectContinueChecked: false
        };
    }

    componentDidMount() {
        this.props.modifyEditedProject({
            campus: {...this.props.projectDialog.campusList![0]},
            projectStatus: { value: "Active" }
        });
    }

    render() {

        return <Dialog
            title="Új projekt létrehozása"
            modal={false}
            open={this.props.projectDialog.open}
            autoScrollBodyContent={false}
            autoDetectWindowHeight={true}
            actions={[<FlatButton label="Hozzádás" primary={true} onClick={() => { this.props.addProject(); }} />,
            <FlatButton label="Mégse" primary={true} onClick={() => { this.props.toggleProjectDialog(false, ''); }} />]}
        >
            <div>
                {/*
    <TextField
        floatingLabelText="Projekt név"
        floatingLabelFixed={true}
        value={this.props.editedProject ? this.props.editedProject.name : ''}
        onChange={(event) => { 
            let target = event.target as HTMLInputElement; 
            this.props.modifyEditedProject({ ...this.props.editedProject, name: target.value }); }}
    />
    */}
                <div>
                    <AutoComplete
                        floatingLabelText="Projekt név"
                        floatingLabelFixed={true}
                        searchText={this.props.editedProject ? this.props.editedProject.name : ''}
                        dataSource={this.props.projectDialog.projectList}
                        dataSourceConfig={dataSourceConfig}
                        onUpdateInput={(searchText, dataSource)=>{
                           //console.log(searchText);
                           //console.log(dataSource);
                           this.props.modifyEditedProject({
                                    ...this.props.editedProject,
                                    /*projectId: chosenRequest.projectId,*/ name: searchText
                                });
                           
                        }}
                        onNewRequest={(chosenRequest, index) => {
                            //console.log(chosenRequest);
                            //console.log(index);

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
                                    /*projectId: chosenRequest.projectId,*/ name: chosenRequest.name
                                });

                            }
                        }}
                    >
                    </AutoComplete>
                </div>
                <div style={styles.block}>
                    <Checkbox
                        label="Projekt folytatása"
                        labelPosition="left"
                        style={styles.checkbox}
                        disabled={this.state.projectContinueDisabled}
                        onCheck={(event, isInputChecked) => {
                            if (isInputChecked) {
                                this.props.modifyEditedProject({
                                    ...this.props.editedProject,
                                    projectId: this.state.selectedProject!.projectId
                                });

                            } else {
                                this.props.modifyEditedProject({
                                    ...this.props.editedProject,
                                    projectId: null
                                });
                            }

                            this.setState({
                                projectContinueChecked: isInputChecked
                            });
                        }}
                        checked={this.state.projectContinueChecked}
                    />
                </div>
                <div>
                    <TextField
                        floatingLabelText="Leírás"
                        floatingLabelFixed={true}
                        multiLine={true}
                        rows={4}
                        rowsMax={8}
                        value={this.props.editedProject ? this.props.editedProject.description : ''}
                        onChange={(event) => {
                            let target = event.target as HTMLInputElement;
                            this.props.modifyEditedProject({ ...this.props.editedProject, description: target.value });
                        }}
                    />
                </div>
                <div>
                    <SelectField
                        floatingLabelText="Campus"
                        floatingLabelFixed={true}
                        value={this.props.editedProject && this.props.editedProject.campus ? this.props.editedProject.campus :
                            this.props.projectDialog.campusList![0]}
                        onChange={(event, index, value) => {
                            let target = event.target as HTMLInputElement;
                            this.props.modifyEditedProject({ ...this.props.editedProject, campus: value });
                        }}
                    >
                        {this.props.projectDialog.campusList!.map(campus =>
                            <MenuItem key={campus.campusId} value={campus} primaryText={
                                campus.startDate.format('YYYY.MM.DD') + '-' + campus.endDate.format('YYYY.MM.DD')} />
                        )}
                    </SelectField>
                </div>
                <div>
                    <SelectField
                        floatingLabelText="Státusz"
                        floatingLabelFixed={true}
                        value={this.props.editedProject && this.props.editedProject.projectStatus ?
                            this.props.editedProject.projectStatus.value : 'Active'}
                        onChange={(event, index, value) => {
                            let target = event.target as HTMLInputElement;
                            this.props.modifyEditedProject({ ...this.props.editedProject, projectStatus: { value } });
                        }}
                    >
                        <MenuItem value="Active" primaryText="Aktív" />
                        <MenuItem value="Inactive" primaryText="Inaktív" />
                        <MenuItem value="Pending" primaryText="Függőben" />
                    </SelectField>
                </div>
            </div>
        </Dialog>
    }
}