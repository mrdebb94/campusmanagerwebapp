import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';
import * as CampusStore from '../store/Campus';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';

import ProjectDialog from './ProjectDialog';

type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

interface ProjectListState {
    selectedRows: string | null;
}

class Project extends React.Component<ProjectProps, ProjectListState> {

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: null
        };
    }

    componentDidMount() {
        this.props.setProjectList();
    }

    handleClick = (event, project) => {
        if (this.state.selectedRows == project.projectCampusId) {
            this.setState({ selectedRows: null });
            this.props.modifyEditedProject({});

        } else {
            this.setState({ selectedRows: project.projectCampusId });
            this.props.modifyEditedProject({ ...project });
        }
    }

    public render() {
        return <div>
            <ProjectDialog />
            <Toolbar>
                <Button
                    color="primary"
                    onClick={() => {
                        this.props.toggleProjectDialog(true, "edit");
                    }}>
                    Módosítás
                </Button>
                <Button color="primary"
                    onClick={() => {
                        this.props.toggleProjectDialog(true, "create");
                    }}
                >
                    Új projekt
                </Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox disabled />
                        </TableCell>
                        <TableCell>Project azonosító</TableCell>
                        <TableCell>Project neve</TableCell>
                        <TableCell>Campus időszak</TableCell>
                        <TableCell>Projekt státusz</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.projectList.map((project, i) =>
                        <TableRow
                            hover
                            key={project.projectCampusId!}
                            selected={this.state.selectedRows == project.projectCampusId}
                            onClick={event => this.handleClick(event, project)}
                        >
                            <TableCell
                                padding="checkbox"
                            >
                                <Checkbox
                                    checked={this.state.selectedRows == project.projectCampusId}
                                />
                            </TableCell>
                            <TableCell>{project.projectCampusId}</TableCell>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>
                                {project.campus ? project.campus.startDate.format('YYYY.MM.DD') : ''}-
                                        {project.campus ? project.campus.endDate.format('YYYY.MM.DD') : ''}
                            </TableCell>
                            <TableCell>{project.projectStatus!.value}</TableCell>
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
)(Project);