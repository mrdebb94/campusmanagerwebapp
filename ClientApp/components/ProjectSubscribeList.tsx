import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ProjectSubscribeDialog from './ProjectSubscribeDialog';

type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

class ProjectSubscribeList extends React.Component<ProjectProps, any> {

    state = {
        menuValue: 0,
        tabValue: 0,
        openMenu: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setProjectSubscriberList();
    }

    openMenu = () => {
        this.setState((prevState, props) => ({
            openMenu: !prevState.openMenu
        }));
    }

    handleClose = () => {
        this.setState({ openMenu: false });
    };

    handleTabChange = (event, value) => {
        //console.log(value);
        this.setState({ tabValue: value });
    };

    handleMenuChange = (value) => this.setState({ openMenu: false, menuValue: value });

    public render() {
        return (
            <div>
                <AppBar position="static">
                    {
                        this.props.activeProjectList && (
                            <Tabs
                                value={this.state.tabValue}
                                onChange={this.handleTabChange}
                            >
                                {this.props.activeProjectList && this.props.activeProjectList.map(
                                    ({ projectCampusId, name }, index) => (
                                        <Tab key={projectCampusId!} label={name} value={index} />
                                    ))
                                }
                            </Tabs>)
                    }
                </AppBar>
                <ProjectSubscribeDialog />
                <Toolbar>
                    <div>
                       {/* <Button
                            aria-owns={this.state.openMenu ? 'simple-menu' : null}
                            aria-haspopup="true"
                            onClick={this.openMenu}
                        >
                            Szűrés
                        </Button>
                       
                        <Menu
                            id="simple-menu"
                            open={this.state.openMenu}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={event => this.handleMenuChange(0)}>Minden jelentkező</MenuItem>
                            <MenuItem onClick={event => this.handleMenuChange(1)}>Mentor jelentkezők</MenuItem>
                            <MenuItem onClick={event => this.handleMenuChange(2)}>Csapattag jelentkezők</MenuItem>
                        </Menu>
                       */}
                    </div>

                    { /* Több jelentkező kijelöléséhez jóváhagyás, módosítás gomb 
                        <RaisedButton label="Módosítás" primary={true} />
                        */}
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Jelentkező neve</TableCell>
                            <TableCell>Típus</TableCell>
                            <TableCell>Jóváhagyás</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(this.props.activeProjectList.length > this.state.tabValue
                            && (this.state.menuValue == 0 || this.state.menuValue == 2)
                        ) && this.props.activeProjectList[this.state.tabValue].subscribedStudents.
                            map((subscribedStudent, index) => {
                                let { subscribedStudentId, student: { user: { name } } } = subscribedStudent
                                return (
                                    <TableRow key={subscribedStudentId}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>Tanuló</TableCell>
                                        <TableCell>
                                            <Button

                                                color="primary"
                                                onClick={() => this.props.approveStudentProjectSubscribe(subscribedStudentId)}
                                            >
                                                <DoneIcon />
                                            </Button>
                                            <Button
                                                color="primary"
                                                onClick={() =>
                                                    this.props.toggleProjectSubscribeDialog(
                                                        true, {
                                                            subscribedStudent/*: {
                                                                subscribedStudentId,
                                                                projectCampusId: this.props.activeProjectList[this.state.tabValue].projectCampusId!,
                                                                student: { user: { name } }
                                                            }*/
                                                        }
                                                    )}

                                            >
                                                Módosít
                                        </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                        {(this.props.activeProjectList.length > this.state.tabValue
                            && (this.state.menuValue == 0 || this.state.menuValue == 1)
                        ) && this.props.activeProjectList[this.state.tabValue].subscribedMentors.
                            map((subscribedMentor, index) => {
                                let { subscribedMentorId, mentor: { user: { name } } } = subscribedMentor;
                                return (
                                    <TableRow key={subscribedMentorId}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>Mentor</TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                onClick={() => this.props.approveMentorProjectSubscribe(subscribedMentorId)}

                                            >
                                                <DoneIcon />
                                            </Button>
                                            <Button
                                                color="primary"
                                                onClick={() =>
                                                    this.props.toggleProjectSubscribeDialog(
                                                        true, {
                                                            subscribedMentor/*:
                                                                {
                                                                    subscribedMentorId,
                                                                    projectCampusId: this.props.activeProjectList[this.state.tabValue].projectCampusId!,
                                                                    mentor: { user: { name } }
                                                                }*/
                                                        }
                                                    )}

                                            >
                                                Módosít
                                            </Button>

                                        </TableCell>
                                    </TableRow>

                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.project,
    ProjectStore.actionCreators)
    (ProjectSubscribeList);