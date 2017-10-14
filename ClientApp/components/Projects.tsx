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

import {ProjectDialog} from './ProjectDialog';

type ProjectProps =
ProjectStore.ProjectState        // ... state we've requested from the Redux store
& typeof ProjectStore.actionCreators      // ... plus action creators we've requested
& RouteComponentProps<{}>

interface ProjectListState {
    selectedRows: number[] | string;
}

class Project extends React.Component<ProjectProps, ProjectListState> {
   
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: []
        };
    }

    componentDidMount() {
        this.props.setProjectList();
    }
    
    public render() {
        return <div>
            <ProjectDialog {...this.props}/>
            <Toolbar>
                        <ToolbarGroup lastChild={true}>
                            <RaisedButton label="Módosítás" primary={true} onClick={() => {
                                this.props.toggleProjectDialog(true, "edit");
                            }} />
                            <RaisedButton label="Új projekt" primary={true} onClick={() => {
                                this.props.toggleProjectDialog(true, "create");
                            }} />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table
                        onRowSelection={(selectedRows) => {
                            console.log(selectedRows);
                            this.setState({ selectedRows });
                            this.props.modifyEditedProject({ ...this.props.projectList[selectedRows[0]] });
                        }}
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Project azonosító</TableHeaderColumn>
                                <TableHeaderColumn>Project neve</TableHeaderColumn>
                                <TableHeaderColumn>Campus időszak</TableHeaderColumn>
                                <TableHeaderColumn>Projekt státusz</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            deselectOnClickaway={false}>
                            {this.props.projectList.map((project, i) =>
                                <TableRow
                                    key={project.projectCampusId!}
                                    selected={(this.state.selectedRows as number[]).indexOf(i) !== -1}>
                                    <TableRowColumn>{project.projectCampusId}</TableRowColumn>
                                    <TableRowColumn>{project.name}</TableRowColumn>
                                    <TableRowColumn>
                                        {project.campus?project.campus.startDate.format('YYYY.MM.DD'):''}-
                                        {project.campus?project.campus.endDate.format('YYYY.MM.DD'):''}
                                    </TableRowColumn>
                                    <TableRowColumn>{project.projectStatus!.value}</TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
        </div>
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.project, // Selects which state properties are merged into the component's props
    ProjectStore.actionCreators                // Selects which action creators are merged into the component's props
)(Project) as typeof Project;