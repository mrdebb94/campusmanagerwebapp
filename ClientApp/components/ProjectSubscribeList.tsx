import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { ApplicationState } from '../store';
import * as ProjectStore from '../store/Project';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDone from 'material-ui/svg-icons/action/done';

import { Tabs, Tab } from 'material-ui/Tabs';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

import { ProjectSubscribeDialog } from './ProjectSubscribeDialog'

type ProjectProps =
    ProjectStore.ProjectState        // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>

class ProjectSubscribeList extends React.Component<ProjectProps, any> {

    state = {
        menuValue: 0,
        tabValue: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.setProjectSubscriberList();
    }

    handleTabChange = (value) => {
        //console.log(value);
        this.setState({ tabValue: value });
    };

    handleMenuChange = (event, index, value) => this.setState({ menuValue: value });

    public render() {
        return (
            <div>
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
                <ProjectSubscribeDialog {...this.props }/>
                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        <DropDownMenu value={this.state.menuValue} onChange={this.handleMenuChange}>
                            <MenuItem value={0} primaryText="Minden jelentkező" />
                            <MenuItem value={1} primaryText="Mentor jelentkezők" />
                            <MenuItem value={2} primaryText="Csapattag jelentkezők" />
                        </DropDownMenu>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        { /* Több jelentkező kijelöléséhez jóváhagyás, módosítás gomb */}
                        <RaisedButton label="Módosítás" primary={true} />
                    </ToolbarGroup>
                </Toolbar>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Jelentkező neve</TableHeaderColumn>
                            <TableHeaderColumn>Típus</TableHeaderColumn>
                            <TableHeaderColumn>Jóváhagyás</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(this.props.activeProjectList.length > this.state.tabValue
                            && (this.state.menuValue == 0 || this.state.menuValue == 2)
                        ) && this.props.activeProjectList[this.state.tabValue].subscribedStudents.
                            map(({ subscribedStudentId, student: {name} }
                                , index) => (
                                    <TableRow>
                                        <TableRowColumn>{name}</TableRowColumn>
                                        <TableRowColumn>Tanuló</TableRowColumn>
                                        <TableRowColumn>
                                            <FlatButton
                                                label="Elfogad"
                                                labelPosition="before"
                                                primary={true}
                                                onClick={() => this.props.approveStudentProjectSubscribe(subscribedStudentId)}
                                                icon={<ActionDone />}
                                            />
                                            <FlatButton
                                                label="Módosít"
                                                labelPosition="before"
                                                primary={true}
                                                onClick={() =>
                                                    this.props.toggleProjectSubscribeDialog(
                                                        true, { subscribedStudent: { 
                                                            subscribedStudentId, 
                                                            projectCampusId: this.props.activeProjectList[this.state.tabValue].projectCampusId!,              
                                                            student: { name, phone: "" } } }
                                                    )}
                                                icon={<ActionDone />}
                                            />
                                        </TableRowColumn>
                                    </TableRow>
                                ))
                        }
                        {(this.props.activeProjectList.length > this.state.tabValue
                            && (this.state.menuValue == 0 || this.state.menuValue == 1)
                        ) && this.props.activeProjectList[this.state.tabValue].subscribedMentors.
                            map(({ subscribedMentorId, mentor: {name} }
                                , index) => (
                                    <TableRow>
                                        <TableRowColumn>{name}</TableRowColumn>
                                        <TableRowColumn>Mentor</TableRowColumn>
                                        <TableRowColumn>
                                            <FlatButton
                                                label="Elfogad"
                                                labelPosition="before"
                                                primary={true}
                                                onClick={() => this.props.approveMentorProjectSubscribe(subscribedMentorId)}
                                                icon={<ActionDone />}
                                            />
                                            <FlatButton
                                                label="Módosít"
                                                labelPosition="before"
                                                primary={true}
                                                onClick={() =>
                                                    this.props.toggleProjectSubscribeDialog(
                                                        true, { subscribedMentor: 
                                                        { subscribedMentorId,
                                                          projectCampusId: this.props.activeProjectList[this.state.tabValue].projectCampusId!, 
                                                          mentor: { name, phone: "" } } }
                                                    )}
                                                icon={<ActionDone />}
                                            />

                                        </TableRowColumn>
                                    </TableRow>

                                ))
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
    (ProjectSubscribeList) as typeof ProjectSubscribeList;