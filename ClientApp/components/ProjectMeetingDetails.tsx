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

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';

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

interface ProjectMeetingState {
    filterMenuValue: number;
    editableTeamMemberRatings: ProjectDetailsStore.TeamMemberRating[];
    editedTeamMemberRatingIndex: number,
    editedTeamMemberRatingText: string
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column"
    } as React.CSSProperties,
    button: {
        alignSelf: "flex-end"
    } as React.CSSProperties
}

class ProjectMeetingDetails extends React.Component<any, any> {

    state: ProjectMeetingState = {
        filterMenuValue: 0,
        editableTeamMemberRatings: [],
        editedTeamMemberRatingIndex: -1,
        editedTeamMemberRatingText: ""
    }

    textboxes: any[4]
    componentDidMount() {
        this.props.getProjectMeetingDetails(this.props.match.params.id);
    }

    constructor(props) {
        super(props);

    } 

    componentWillUnmount() {
        this.props.unSetProjectMeetingDetails();
    }

    componentWillReceiveProps(nextProps) {

        //fel fog nyílni a dialógusablak

        if (((!this.props.projectMeetingDetails) || (this.props.projectMeetingDetails &&
            this.props.projectMeetingDetails.teamMemberParticipationMeetings.length == 0))
            && nextProps.projectMeetingDetails 
            && nextProps.projectMeetingDetails.teamMemberParticipationMeetings.length != 0) {

            let editableTeamMemberRatings =
                nextProps.projectMeetingDetails.teamMemberParticipationMeetings.map(meeting => {
                    let editableRatings = meeting.teamMemberRatings.filter(
                        rating => rating.editable
                    );
                    console.log(editableRatings.length);
                    if(editableRatings.length>0) {
                        editableRatings[0].teamMemberName = meeting.teamMemberName;
                        return editableRatings[0];
                    } else {
                        return null;
                    }
                }
                );
            this.setState({
                editableTeamMemberRatings: [...editableTeamMemberRatings]
            });

        }


    }

    handleFilterChange = (event, index, value) => this.setState({ filterMenuValue: value });

    render() {
        return (<div>
            <AppBar
                title="Jelenléti ív"
                showMenuIconButton={false}
            />
            <Card containerStyle={{ marginBottom: 10 }}>
                <CardTitle title={"Megbeszélés"} subtitle={this.props.projectMeetingDetails
                    ? `${this.props.projectMeetingDetails.projectMeeting.startTime!.format("YYYY-MM-DD HH:mm")}
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
                                                                (event, value) => {
                                                                    this.props.editTeamMemberParticipationMeetings(index, value);
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
                                                                    (event, value) => {
                                                                        this.props.editProjectLeaderParticipationMeetings(index, value);
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
                        console.log("Katt");
                        this.props.saveProjectMeetingParticipations();
                    }} />
                </CardActions>
            </Card>
            <AppBar
                title="Értékelések"
                showMenuIconButton={false}
            />
            <Card containerStyle={{ marginBottom: 10 }}>
                <CardTitle title={"Megbeszélés"} subtitle={this.props.projectMeetingDetails
                    ? `${this.props.projectMeetingDetails.projectMeeting.startTime!.format("YYYY-MM-DD HH:mm")}
                     - ${this.props.projectMeetingDetails.projectMeeting.endTime!.format("HH:mm")}`
                    : `Ismeretlen`} />
                <CardText>
                    {
                        this.state.editableTeamMemberRatings
                        .filter(teamMemberRating=>teamMemberRating!=null)
                        .map((teamMemberRating, index) => (
                            <div style={styles.container}>
                                <h3>{teamMemberRating.teamMemberName}</h3>
                                <TextField
                                    id={teamMemberRating.teamMemberRatingId}
                                    style={{ "width": "100%" }}
                                    hintText={!this.state.editableTeamMemberRatings[index].text
                                    ?"Értékelés hozzáadása"
                                    :undefined}
                                    multiLine={true}
                                    rows={2}
                                    rowsMax={8}
                                    value={this.state.editedTeamMemberRatingIndex==index
                                        ? undefined
                                        : teamMemberRating.text
                                    }
                                    onBlur={(event) => {
                                        //console.log("Fokusz elhagy");
                                        let target = event.target as HTMLInputElement;
                                        let teamMemberRatings = [...this.state.editableTeamMemberRatings];
                                        teamMemberRatings[index].text = target.value;
                                        console.log(teamMemberRatings);
                                        this.setState({
                                            editedTeamMemberRatingIndex: -1,
                                            teamMemberRatings: teamMemberRatings
                                        });
                                    }
                                    }
                                    onFocus={(event) => {
                                        let target = event.target as HTMLInputElement
                                        this.setState({
                                            editedTeamMemberRatingIndex: index,
                                            editedTeamMemberRatingText:
                                            this.state.editableTeamMemberRatings[index].text
                                        });
                                    }}
                                    />
                                <FlatButton style={styles.button} label="Értékelés mentése" onClick={() => {
                                   this.props.saveTeamMemberRating(this.state.editableTeamMemberRatings[index]);
                                }}
                                />
                            </div>
                        ))
                    }
                </CardText>
            </Card>
        </div>)
    }
}

export default connect(
    (state: ApplicationState) => state.projectDetails,
    ProjectDetailsStore.actionCreators)
    (ProjectMeetingDetails) as typeof ProjectMeetingDetails;
