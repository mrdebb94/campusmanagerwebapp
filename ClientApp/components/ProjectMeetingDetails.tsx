import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import * as ProjectDetailsStore from '../store/ProjectDetails';

type ProjectDetailsProps =
    ProjectDetailsStore.ProjectDetailsState
    & typeof ProjectDetailsStore.actionCreators
    & RouteComponentProps<{}>


class ProjectMeetingDetails extends React.Component<any, any> {

    state = {
        filterMenuValue: 0
    }

    componentDidMount() {
        this.props.getProjectMeetingDetails(this.props.match.params.id);
    }

    handleFilterChange = (event, index, value) => this.setState({ filterMenuValue: value });

    render() {
        return (<div>
            <Card containerStyle={{ marginBottom: 10 }}>
                <CardTitle title={"Megbeszélés"} subtitle={this.props.projectMeetingDetails
                    ? `${this.props.projectMeetingDetails.projectMeeting.startTime!.format("YYYY-DD-MM HH:mm")}
                     - ${this.props.projectMeetingDetails.projectMeeting.endTime!.format("HH:mm")}`
                    : `Ismeretlen`} />
                <CardText>
                    {this.props.projectMeetingDetails ? (
                        <div>
                            <Toolbar>
                                <ToolbarGroup firstChild={true}>
                                    <DropDownMenu value={this.state.filterMenuValue} onChange={this.handleFilterChange}>
                                        <MenuItem value={0} primaryText="Mindenki" />
                                        <MenuItem value={1} primaryText="Csapattagok" />
                                        <MenuItem value={2} primaryText="Mentorok" />
                                    </DropDownMenu>
                                </ToolbarGroup>

                            </Toolbar>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderColumn>Név</TableHeaderColumn>
                                        <TableHeaderColumn>Megjelent</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        (this.state.filterMenuValue == 0 || this.state.filterMenuValue == 1) &&
                                        this.props.projectMeetingDetails.
                                            teamMemberParticipationMeetings.map(
                                                (teamMemberParticipationMeeting, index) => (
                                                <TableRow
                                                  key={teamMemberParticipationMeeting.teamMemberParticipationMeetingId!}>
                                                    <TableRowColumn>
                                                        {teamMemberParticipationMeeting.teamMemberName}
                                                    </TableRowColumn>
                                                    <TableRowColumn>
                                                        <Checkbox
                                                            checked={teamMemberParticipationMeeting.checked}
                                                            disabled={false}
                                                            onCheck={
                                                                (event, value)=>{
                                                                this.props.editTeamMemberParticipationMeetings(index,value);
                                                                }
                                                            }
                                                        />
                                                    </TableRowColumn>
                                                </TableRow>
                                            ))
                                    }
                                    {
                                        (this.state.filterMenuValue == 0 || this.state.filterMenuValue == 2) &&
                                        this.props.projectMeetingDetails.
                                            projectLeaderParticipationMeetings.map(
                                                (projectLeaderParticipationMeeting, index) => 
                                            (
                                                <TableRow
                                                    key={projectLeaderParticipationMeeting.projectLeaderParticipationMeetingId!}>
                                                    <TableRowColumn>
                                                        {projectLeaderParticipationMeeting.projectLeaderName}
                                                    </TableRowColumn>
                                                    <TableRowColumn>
                                                        <Checkbox
                                                            checked={projectLeaderParticipationMeeting.checked}
                                                            disabled={false}
                                                            onCheck={
                                                                (event, value)=>{
                                                                this.props.editProjectLeaderParticipationMeetings(index,value);
                                                                }
                                                            }
                                                        />
                                                    </TableRowColumn>
                                                </TableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </div>) : (<div>Nem jeleníthető meg</div>)
                    }
                </CardText>
                <CardActions>
                    <FlatButton label="Mentés" onClick={() => {
                        this.props.saveProjectMeetingParticipations();
                    }} />
                </CardActions>
            </Card>
        </div>)
    }
}

export default connect(
    (state: ApplicationState) => state.projectDetails,
    ProjectDetailsStore.actionCreators)
    (ProjectMeetingDetails) as typeof ProjectMeetingDetails;
